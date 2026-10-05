-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'non_binary', 'prefer_not_to_say', 'other');

-- DropIndex
DROP INDEX "idx_users_github_url";

-- DropIndex
DROP INDEX "idx_users_linkedin_url";

-- DropIndex
DROP INDEX "academic_information_user_id_key";

-- AlterTable
-- "updated_at" gets a temporary DEFAULT so the column can be added to a
-- non-empty table, is backfilled from created_at, and then loses the default
-- again so the database matches the datamodel (Prisma maintains @updatedAt).
ALTER TABLE "users" ADD COLUMN "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
UPDATE "users" SET "updated_at" = "created_at";
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;

ALTER TABLE "users"
  ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
  ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(100);

-- gender: text -> "Gender" enum, converted in place so existing rows survive.
ALTER TABLE "users"
  ALTER COLUMN "gender" DROP NOT NULL,
  ALTER COLUMN "gender" TYPE "Gender" USING (
    CASE lower(coalesce(trim("gender"), ''))
      WHEN 'm'                       THEN 'male'
      WHEN 'male'                    THEN 'male'
      WHEN 'f'                       THEN 'female'
      WHEN 'female'                  THEN 'female'
      WHEN 'nb'                      THEN 'non_binary'
      WHEN 'nonbinary'               THEN 'non_binary'
      WHEN 'non-binary'              THEN 'non_binary'
      WHEN 'non_binary'              THEN 'non_binary'
      WHEN 'o'                       THEN 'other'
      WHEN 'other'                   THEN 'other'
      ELSE                               'prefer_not_to_say'
    END
  )::"Gender",
  ALTER COLUMN "gender" SET NOT NULL;

-- AlterTable
ALTER TABLE "academic_programs"
  ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
  ALTER COLUMN "institution" SET DATA TYPE VARCHAR(150);

-- AlterTable
ALTER TABLE "schools"
  ALTER COLUMN "name" SET DATA TYPE VARCHAR(150),
  ALTER COLUMN "short_name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "academic_information" DROP CONSTRAINT "academic_information_pkey",
DROP COLUMN "id",
ALTER COLUMN "school_other" SET DATA TYPE VARCHAR(150),
ADD CONSTRAINT "academic_information_pkey" PRIMARY KEY ("user_id");

-- Rebuild the team membership rule without "role": the leader is identified by
-- teams.leader_id (ERD: TEAM.leader_id "Single team leader"), which keeps the
-- 2-4 member rule and the "leader must be a member" rule intact after the
-- role column is dropped. Runs before DROP COLUMN "role" so the function never
-- references a column that no longer exists.
CREATE OR REPLACE FUNCTION "public"."validate_team_membership"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  current_team_id UUID;
  member_count INTEGER;
  leader_id UUID;
  leader_membership_count INTEGER;
BEGIN
  IF TG_TABLE_NAME = 'teams' THEN
    IF TG_OP = 'DELETE' THEN
      current_team_id := OLD.id;
    ELSE
      current_team_id := NEW.id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    current_team_id := OLD.team_id;
  ELSE
    current_team_id := NEW.team_id;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM "public"."teams" WHERE id = current_team_id
  ) THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    END IF;

    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO member_count
  FROM "public"."team_members"
  WHERE team_id = current_team_id;

  IF member_count < 2 OR member_count > 4 THEN
    RAISE EXCEPTION 'A team must have between 2 and 4 members';
  END IF;

  SELECT teams.leader_id INTO leader_id
  FROM "public"."teams" AS teams
  WHERE teams.id = current_team_id;

  SELECT COUNT(*) INTO leader_membership_count
  FROM "public"."team_members"
  WHERE team_id = current_team_id
    AND user_id = leader_id;

  IF leader_membership_count <> 1 THEN
    RAISE EXCEPTION 'The team leader must be a team member';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

-- AlterTable
ALTER TABLE "team_members" DROP COLUMN "role";

-- DropEnum
DROP TYPE "TeamMemberRole";

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE "public"."AcademicLevel" AS ENUM (
  'freshman',
  'sophomore',
  'junior',
  'senior',
  'graduate',
  'other'
);

CREATE TYPE "public"."TeamMemberRole" AS ENUM (
  'leader',
  'member'
);

ALTER TABLE "public"."users"
  ALTER COLUMN "id" DROP DEFAULT,
  ALTER COLUMN "id" TYPE UUID USING gen_random_uuid(),
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "username" TYPE VARCHAR(32),
  ALTER COLUMN "email" TYPE VARCHAR(320);

ALTER TABLE "public"."users"
  ADD COLUMN "auth_user_id" UUID;

CREATE UNIQUE INDEX "users_auth_user_id_key"
  ON "public"."users"("auth_user_id")
  WHERE "auth_user_id" IS NOT NULL;

ALTER TABLE "public"."users"
  ADD CONSTRAINT "users_email_format_check"
    CHECK ("email" = lower("email") AND "email" ~* '^[A-Z0-9._%+\-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  ADD CONSTRAINT "users_username_format_check"
    CHECK ("username" = lower("username") AND "username" ~ '^[a-z0-9_]{3,32}$');

ALTER TABLE "public"."users"
  DROP COLUMN "academic_program",
  DROP COLUMN "school";

CREATE TABLE "public"."academic_programs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "code" VARCHAR(20) NOT NULL,
  "name" TEXT NOT NULL,
  "institution" TEXT NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL,

  CONSTRAINT "academic_programs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "academic_programs_institution_code_key"
  ON "public"."academic_programs"("institution", "code");

CREATE TABLE "public"."schools" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "short_name" TEXT,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL,

  CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "schools_name_key" ON "public"."schools"("name");
CREATE UNIQUE INDEX "schools_short_name_key" ON "public"."schools"("short_name");

CREATE TABLE "public"."academic_information" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "program_id" UUID,
  "program_other" VARCHAR(150),
  "academic_level" "public"."AcademicLevel" NOT NULL,
  "expected_graduation_date" DATE,
  "school_id" UUID,
  "school_other" TEXT,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL,

  CONSTRAINT "academic_information_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "academic_information_program_check"
    CHECK (("program_id" IS NOT NULL) <> ("program_other" IS NOT NULL)),
  CONSTRAINT "academic_information_school_check"
    CHECK (("school_id" IS NOT NULL) OR ("school_other" IS NOT NULL))
);

CREATE UNIQUE INDEX "academic_information_user_id_key"
  ON "public"."academic_information"("user_id");

CREATE TABLE "public"."teams" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" VARCHAR(80) NOT NULL,
  "slug" VARCHAR(80) NOT NULL,
  "leader_id" UUID NOT NULL,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6) NOT NULL,

  CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "teams_slug_key" ON "public"."teams"("slug");

CREATE TABLE "public"."team_members" (
  "team_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "role" "public"."TeamMemberRole" NOT NULL,
  "joined_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "team_members_pkey" PRIMARY KEY ("team_id", "user_id")
);

CREATE UNIQUE INDEX "team_members_user_id_key" ON "public"."team_members"("user_id");

ALTER TABLE "public"."users"
  ADD CONSTRAINT "users_auth_user_id_fkey"
    FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "public"."academic_information"
  ADD CONSTRAINT "academic_information_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "academic_information_program_id_fkey"
    FOREIGN KEY ("program_id") REFERENCES "public"."academic_programs"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "academic_information_school_id_fkey"
    FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."teams"
  ADD CONSTRAINT "teams_leader_id_fkey"
    FOREIGN KEY ("leader_id") REFERENCES "public"."users"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."team_members"
  ADD CONSTRAINT "team_members_team_id_fkey"
    FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "team_members_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

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
    AND user_id = leader_id
    AND role = 'leader';

  IF leader_membership_count <> 1 THEN
    RAISE EXCEPTION 'The team leader must be a team member with leader role';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

CREATE CONSTRAINT TRIGGER "team_members_valid_membership"
AFTER INSERT OR UPDATE OR DELETE ON "public"."team_members"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION "public"."validate_team_membership"();

CREATE CONSTRAINT TRIGGER "teams_valid_membership"
AFTER INSERT OR UPDATE OF "leader_id" OR DELETE ON "public"."teams"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW
EXECUTE FUNCTION "public"."validate_team_membership"();

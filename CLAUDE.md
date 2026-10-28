# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Landing/registration site for the Data Science Club (DSC) Datathon. User-facing copy, code comments, and error messages are mostly in **Spanish**; keep new UI text in Spanish.

The repo holds two independent npm packages:

- **Root** — the frontend: Vite + React 19 + TypeScript + Tailwind CSS v4. Deployed on Vercel.
- **`server/`** — only the Prisma setup (schema, migrations, config) for the Supabase Postgres database. There is no backend application code yet.

> `.github/CONTRIBUTING.md` describes a T3-style layout (`src/app/`, tRPC, NextAuth, `src/server/db.ts`). That architecture does **not** exist in this repo. Go by the actual files.

## Commands

Frontend (run from repo root):

```sh
npm install
npm run dev        # Vite dev server
npm run build      # tsc -b (type check) && vite build
npm run lint       # eslint .
npm run preview    # serve the built dist/
```

Database (run from `server/`):

```sh
npm install                              # postinstall runs `prisma skills sync`
npx prisma validate
npx prisma generate
npx prisma migrate status
npx prisma migrate dev --create-only --name <name>   # generate SQL, then hand-edit before applying
npx prisma migrate deploy
```

No test framework is set up in either package (`server`'s `npm test` is a placeholder that fails).

## Environment

- Frontend: copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. `src/lib/supabase.ts` throws at import time if either is missing. Only the public/publishable key belongs here; it ships in the browser bundle.
- Prisma: `server/.env` holds `DATABASE_URL` (Supabase pooler) and `DIRECT_URL` (direct connection). Prisma 7 reads the datasource URL from `server/prisma.config.ts`, which uses `DIRECT_URL`. `schema.prisma` has no `url`.

## Architecture

### Frontend

Routing uses react-router in declarative mode. `src/main.tsx` wraps the app in `BrowserRouter`, and `src/App.tsx` declares the routes inside `components/Layout.tsx`. The layout renders the fixed Header, the Footer (`id="contacto"`), and scroll handling: on navigation it scrolls to `#hash` or back to the top. The pages are in `src/pages/`:
- `/` (`Home`): the original landing (Hero, Sponsors, CTA, Gallery).
- `/datathon`: sections `#que-es`, `#sede`, `#retos`, `#premios`.
- `/agenda`
- `/faq`
- `*` (`NotFound`)

`/equipo` and `/inscripcion` from the roadmap don't exist yet, and every "Inscripción" link still points to `#`. `vercel.json` rewrites every path to `index.html` so that reloading a route doesn't 404.

Content for the new pages is **placeholder** data in `src/data/` (`datathon.ts`, `schedule.ts`, `faq.ts`). Each file names the future Supabase table. The types in `src/types/content.ts` follow the same pattern as `src/types/index.ts`: a snake_case `*Row` that mirrors the planned table, plus the camelCase type via `AutoCamelCase`. To wire up the backend, create `src/services/<x>.ts` that returns the camelCase types and replace the import marked `TODO(backend)` in each page. `CTA.tsx` takes its countdown date from `edition.startsAt`. Dates are always formatted in `America/Monterrey` with the helpers in `src/utils/format.ts`; don't use `toLocaleString` directly.

Shared building blocks for internal pages are `PageHeader`, `Section`/`SectionHeading`, `FilterPills`, `ButtonLink` and `icons.tsx` (inline SVG). Static media is imported from `src/assets/`.

Styling is Tailwind v4 through the `@tailwindcss/vite` plugin. There is no `tailwind.config`. Design tokens (the `navy*`/`blue`/`lavender` colors and the `heading` (Poppins) and `body` (Inter) fonts) are defined in the `@theme` block in `src/index.css`. Shared component classes live in `src/App.css` under `@layer components`. Use the existing tokens instead of new hex values where possible.

### Data access

The browser talks to Supabase directly with the publishable key (`src/lib/supabase.ts`, with query functions in `src/services/`). There is no API layer in between, so **Row Level Security is the only access control**. Any new table must enable RLS and define explicit policies in a migration.

The data layer is mid-migration, so parts of the frontend are stale:

- `server/queries.sql` and `0_baseline` are the original single `users` table (numeric id, free-text `academic_program`/`school`). `src/types/index.ts` (`UserRow`) and `src/services/users.ts` still match that old shape, not the current Prisma schema.
- The `security_hardening` migration removes public `SELECT` on `users` because it contains email and `auth_user_id`. Anonymous `getUsers()` calls will no longer return rows. Public profile reads need a dedicated view or authenticated access.

### Database schema (`server/prisma/`)

`schema.prisma` is the source of truth for the models: `User`, `AcademicProgram`, `School`, `AcademicInformation`, `Team`, `TeamMember`. Prisma models are camelCase, mapped to snake_case tables and columns with `@map`/`@@map`. Every model and enum needs `@@schema("public")` because the datasource uses multiple schemas (`public`, `auth`). `users.auth_user_id` references Supabase's `auth.users`.

Several business rules exist **only in migration SQL**, not in `schema.prisma`. Prisma won't generate them, so preserve or extend them by hand when writing migrations:

- Teams have 2–4 members, and the leader (`teams.leader_id`) must be a member. This is enforced by the `validate_team_membership()` function through `DEFERRABLE INITIALLY DEFERRED` constraint triggers on `teams` and `team_members`. Insert a team together with its members in one transaction.
- A user belongs to at most one team (unique `team_members.user_id`).
- `academic_information`: exactly one of `program_id` or `program_other` is set, and at least one of `school_id` or `school_other` is set.
- `users.email` and `users.username` must be lowercase and pass format CHECK constraints (username `^[a-z0-9_]{3,32}$`).
- RLS policies: catalog tables are readable only where `is_active`; teams and memberships are publicly readable; `users`, `academic_information`, and Prisma's `_prisma_migrations` table have no public policies.

Migrations are therefore written as `--create-only`, hand-edited, and then applied. Existing migrations include data-preserving steps (for example, the in-place conversion of `gender` from text to an enum), so don't rewrite applied migrations.

## Git workflow

- Branch names must start with `feature/`, `bugfix/`, `enhancement/`, `hotfix/`, `docs/`, `structure/`, `assets/`, `tests/`, `experiment/`, or `release/`. This is enforced by `.githooks/post-checkout` (enable it with `python gitSetup.py ON`), which deletes badly named branches on checkout, and by the `branch-naming-check` CI workflow.
- PR descriptions follow the template in `.github/CONTRIBUTING.md`: Summary (≤100 words, written by a human), Description, an optional Checklist, a mermaid State machine for functional routines, and Useful links.
- The `datathon/` directory at the root is a stale, untracked leftover (env file, build output, node_modules). It is not part of the project.

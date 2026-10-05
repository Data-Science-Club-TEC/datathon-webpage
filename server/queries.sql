-- Esquema de la base de datos del datathon.
--
-- Ejecutar en Supabase: SQL Editor > New query > pegar > Run.


create table if not exists public.users (
  id                bigint generated always as identity primary key,
  name              text        not null,
  last_name         text        not null,
  username          text        not null unique,
  email             text        not null unique,
  gender            varchar(10) not null,
  academic_program  text        not null,
  school            text,
  profile_img       text,
  github_url        text,
  linkedin_url      text,
  created_at        timestamptz not null default now()
);


--RLS
-- La clave publica viaja en el bundle del navegador, asi que cualquiera puede
-- leerla. RLS es lo unico que impide que esa clave haga lo que quiera con la
-- tabla. Sin RLS, la tabla queda abierta a lectura y escritura para todo el
-- mundo.
--
alter table public.users enable row level security;
drop policy if exists "Public profiles are readable" on public.users;

create policy "Public profiles are readable"
  on public.users
  for select
  to anon, authenticated
  using (true);

-- No se crean politicas de insert, update ni delete. Con RLS activado, lo que
-- no tiene politica queda denegado por defecto, asi que la clave publica no
-- puede escribir en la tabla. Las escrituras se habilitaran cuando exista
-- autenticacion real (Supabase Auth), limitadas al dueno del registro con
-- auth.uid().

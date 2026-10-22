-- Run in pgAdmin: right-click your "opstrack" database -> Query Tool -> paste -> press F5.
-- Needs PostgreSQL 13 or newer (for gen_random_uuid()).

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                       -- mandatory, e.g. PRJ-001
  name text not null,                              -- mandatory
  status text not null default 'Active'
    check (status in ('Active', 'On hold', 'Completed')),
  owner_id uuid not null references users(id),    -- mandatory
  start_date date not null,                        -- mandatory
  end_date date,
  description text,
  created_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,  -- every task belongs to a project
  title text not null,                             -- mandatory
  assignee_id uuid not null references users(id),  -- mandatory
  due_date date not null,                          -- mandatory
  priority text not null default 'Medium'
    check (priority in ('Low', 'Medium', 'High')),
  status text not null default 'To do'
    check (status in ('To do', 'In progress', 'Done')),
  description text,
  created_at timestamptz not null default now()
);

create index tasks_project_idx on tasks (project_id);
create index tasks_assignee_idx on tasks (assignee_id);

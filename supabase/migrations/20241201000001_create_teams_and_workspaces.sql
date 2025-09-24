-- Create teams and workspaces schema with soft deletes and audit trails

-- Create workspaces table
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

-- Create teams table
create table teams (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade not null,
  name text not null,
  avatar_url text,
  is_private boolean not null default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone
);

-- Create user-workspace relationships with roles
create table user_workspaces (
  user_id uuid references profiles(id) on delete cascade not null,
  workspace_id uuid references workspaces(id) on delete cascade not null,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone,
  primary key (user_id, workspace_id)
);

-- Create user-team relationships with roles
create table user_teams (
  user_id uuid references profiles(id) on delete cascade not null,
  team_id uuid references teams(id) on delete cascade not null,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  deleted_at timestamp with time zone,
  primary key (user_id, team_id)
);

-- Create audit trail table for role changes
create table role_audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id text not null, -- composite key as text for flexibility
  user_id uuid references profiles(id) not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  old_values jsonb,
  new_values jsonb,
  changed_at timestamp with time zone default now()
);

-- Add unique constraints
create unique index teams_name_workspace_unique on teams (name, workspace_id) where deleted_at is null;

-- Add indexes for performance
create index workspaces_deleted_at_idx on workspaces (deleted_at);
create index teams_deleted_at_idx on teams (deleted_at);
create index teams_workspace_id_idx on teams (workspace_id);
create index user_workspaces_deleted_at_idx on user_workspaces (deleted_at);
create index user_workspaces_workspace_id_idx on user_workspaces (workspace_id);
create index user_teams_deleted_at_idx on user_teams (deleted_at);
create index user_teams_team_id_idx on user_teams (team_id);
create index role_audit_log_table_record_idx on role_audit_log (table_name, record_id);
create index role_audit_log_user_id_idx on role_audit_log (user_id);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_workspaces_updated_at before update on workspaces
  for each row execute function update_updated_at_column();

create trigger update_teams_updated_at before update on teams
  for each row execute function update_updated_at_column();

create trigger update_user_workspaces_updated_at before update on user_workspaces
  for each row execute function update_updated_at_column();

create trigger update_user_teams_updated_at before update on user_teams
  for each row execute function update_updated_at_column();

-- Function to log role changes
create or replace function log_role_changes()
returns trigger
set search_path = ''
as $$
declare
  old_data jsonb;
  new_data jsonb;
  table_name text;
  record_id text;
  actor_id uuid;
begin
  table_name := tg_table_name;
  
  if tg_op = 'INSERT' then
    new_data = to_jsonb(new);

    if table_name = 'user_workspaces' then
      record_id := new.user_id || ':' || new.workspace_id;
      actor_id := new.user_id;
    elsif table_name = 'user_teams' then
      record_id := new.user_id || ':' || new.team_id;
      actor_id := new.user_id;
    else
      record_id := new.id::text;
      actor_id := null;
    end if;

    actor_id := coalesce(auth.uid(), actor_id, '00000000-0000-0000-0000-000000000000'::uuid);

    insert into public.role_audit_log (table_name, record_id, user_id, action, new_values)
    values (table_name,
            record_id,
            actor_id,
            'insert',
            new_data);
    return new;
  elsif tg_op = 'UPDATE' then
    old_data = to_jsonb(old);
    new_data = to_jsonb(new);

    if table_name = 'user_workspaces' then
      record_id := new.user_id || ':' || new.workspace_id;
      actor_id := new.user_id;
    elsif table_name = 'user_teams' then
      record_id := new.user_id || ':' || new.team_id;
      actor_id := new.user_id;
    else
      record_id := new.id::text;
      actor_id := null;
    end if;

    actor_id := coalesce(auth.uid(), actor_id, '00000000-0000-0000-0000-000000000000'::uuid);

    insert into public.role_audit_log (table_name, record_id, user_id, action, old_values, new_values)
    values (table_name,
            record_id,
            actor_id,
            'update',
            old_data,
            new_data);
    return new;
  elsif tg_op = 'DELETE' then
    old_data = to_jsonb(old);

    if table_name = 'user_workspaces' then
      record_id := old.user_id || ':' || old.workspace_id;
      actor_id := old.user_id;
    elsif table_name = 'user_teams' then
      record_id := old.user_id || ':' || old.team_id;
      actor_id := old.user_id;
    else
      record_id := old.id::text;
      actor_id := null;
    end if;

    actor_id := coalesce(auth.uid(), actor_id, '00000000-0000-0000-0000-000000000000'::uuid);

    insert into public.role_audit_log (table_name, record_id, user_id, action, old_values)
    values (table_name,
            record_id,
            actor_id,
            'delete',
            old_data);
    return old;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Create triggers for role change logging
create trigger log_user_workspaces_changes after insert or update or delete on user_workspaces
  for each row execute function log_role_changes();

create trigger log_user_teams_changes after insert or update or delete on user_teams
  for each row execute function log_role_changes();

-- Enable RLS on all tables
alter table workspaces enable row level security;
alter table teams enable row level security;
alter table user_workspaces enable row level security;
alter table user_teams enable row level security;
alter table role_audit_log enable row level security;

-- Helper functions for RLS checks
create or replace function workspace_is_member(workspace_uuid uuid)
returns boolean
set search_path = public
security definer
language sql
as $$
  select exists (
    select 1
    from public.user_workspaces uw
    where uw.workspace_id = workspace_uuid
      and uw.user_id = auth.uid()
      and uw.deleted_at is null
  );
$$;

create or replace function workspace_has_role(workspace_uuid uuid, allowed_roles text[])
returns boolean
set search_path = public
security definer
language sql
as $$
  select exists (
    select 1
    from public.user_workspaces uw
    where uw.workspace_id = workspace_uuid
      and uw.user_id = auth.uid()
      and uw.role = any(allowed_roles)
      and uw.deleted_at is null
  );
$$;

create or replace function team_is_member(team_uuid uuid)
returns boolean
set search_path = public
security definer
language sql
as $$
  select exists (
    select 1
    from public.user_teams ut
    where ut.team_id = team_uuid
      and ut.user_id = auth.uid()
      and ut.deleted_at is null
  );
$$;

create or replace function team_has_role(team_uuid uuid, allowed_roles text[])
returns boolean
set search_path = public
security definer
language sql
as $$
  select exists (
    select 1
    from public.user_teams ut
    where ut.team_id = team_uuid
      and ut.user_id = auth.uid()
      and ut.role = any(allowed_roles)
      and ut.deleted_at is null
  );
$$;

-- RLS Policies for workspaces
create policy "Users can view workspaces they belong to" on workspaces
  for select using (workspace_is_member(id));

create policy "Workspace admins can update workspaces" on workspaces
  for update using (workspace_has_role(id, array['admin']));

create policy "Workspace admins can delete workspaces (soft delete)" on workspaces
  for update using (workspace_has_role(id, array['admin']));

-- RLS Policies for teams
create policy "Users can view teams in workspaces they belong to" on teams
  for select using (
    workspace_is_member(workspace_id)
    and teams.deleted_at is null
    and (
      not teams.is_private or
      team_is_member(teams.id)
    )
  );

create policy "Team admins can update teams" on teams
  for update using (
    team_has_role(teams.id, array['admin'])
    and teams.deleted_at is null
  );

create policy "Team admins can delete teams (soft delete)" on teams
  for update using (
    team_has_role(teams.id, array['admin'])
    and teams.deleted_at is null
  );

-- RLS Policies for user_workspaces
create policy "Users can view workspace memberships they belong to" on user_workspaces
  for select using (
    user_id = auth.uid()
    or workspace_has_role(user_workspaces.workspace_id, array['admin','editor'])
  );

create policy "Workspace admins can manage workspace memberships" on user_workspaces
  for all using (
    workspace_has_role(user_workspaces.workspace_id, array['admin'])
  );

-- RLS Policies for user_teams
create policy "Users can view team memberships they belong to" on user_teams
  for select using (
    user_id = auth.uid()
    or team_has_role(user_teams.team_id, array['admin','editor'])
  );

create policy "Team admins can manage team memberships" on user_teams
  for all using (
    team_has_role(user_teams.team_id, array['admin'])
  );

-- RLS Policies for role_audit_log (only admins can view)
create policy "Workspace admins can view audit logs" on role_audit_log
  for select using (
    workspace_has_role((split_part(role_audit_log.record_id, ':', 2))::uuid, array['admin'])
  );

-- Helper functions for soft deletes
create or replace function soft_delete_workspace(workspace_uuid uuid)
returns void
set search_path = ''
as $$
begin
  update workspaces 
  set deleted_at = now() 
  where id = workspace_uuid;
end;
$$ language plpgsql security definer;

create or replace function soft_delete_team(team_uuid uuid)
returns void
set search_path = ''
as $$
begin
  update teams 
  set deleted_at = now() 
  where id = team_uuid;
end;
$$ language plpgsql security definer;

create or replace function soft_delete_user_workspace(user_uuid uuid, workspace_uuid uuid)
returns void
set search_path = ''
as $$
begin
  update user_workspaces 
  set deleted_at = now() 
  where user_id = user_uuid and workspace_id = workspace_uuid;
end;
$$ language plpgsql security definer;

create or replace function soft_delete_user_team(user_uuid uuid, team_uuid uuid)
returns void
set search_path = ''
as $$
begin
  update user_teams 
  set deleted_at = now() 
  where user_id = user_uuid and team_id = team_uuid;
end;
$$ language plpgsql security definer;

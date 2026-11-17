create table if not exists posts (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  avatar text not null,
  major text not null,
  time text not null,
  category text not null,
  text text not null,
  image text,
  likes integer not null default 0,
  liked boolean default false,
  saved boolean default false,
  comments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on posts (created_at desc);

alter table posts add column if not exists user_id uuid references auth.users(id) on delete set null;

create policy "Anyone can view posts"
on posts
for select
using (true);

create policy "Users can insert their own posts"
on posts
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own posts"
on posts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own posts"
on posts
for delete
using (auth.uid() = user_id);

create table if not exists profiles (
  id uuid primary key,
  full_name text,
  major text,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender text not null,
  receiver text not null,
  content text not null,
  created_at timestamptz not null default now()
);

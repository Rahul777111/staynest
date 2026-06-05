-- StayNest social + premium schema
-- Tables degrade gracefully: the app uses an in-memory mock when Supabase env
-- vars are absent, so these are only needed for real persistence.

create table if not exists social_posts (
  id            text primary key,
  author_id     text not null,
  author_name   text not null,
  author_avatar text,
  text          text not null default '',
  image_url     text,
  listing_id    text,
  created_at    timestamptz not null default now(),
  like_count    integer not null default 0,
  comment_count integer not null default 0
);
create index if not exists idx_social_posts_author  on social_posts (author_id);
create index if not exists idx_social_posts_created on social_posts (created_at desc);

create table if not exists social_comments (
  id            text primary key,
  post_id       text not null references social_posts (id) on delete cascade,
  author_id     text not null,
  author_name   text not null,
  author_avatar text,
  text          text not null,
  created_at    timestamptz not null default now()
);
create index if not exists idx_social_comments_post on social_comments (post_id, created_at);

create table if not exists social_likes (
  id         bigint generated always as identity primary key,
  post_id    text not null references social_posts (id) on delete cascade,
  user_id    text not null,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);
create index if not exists idx_social_likes_post on social_likes (post_id);

create table if not exists social_follows (
  id          text primary key,
  follower_id text not null,
  followee_id text not null,
  created_at  timestamptz not null default now(),
  unique (follower_id, followee_id)
);
create index if not exists idx_social_follows_followee on social_follows (followee_id);
create index if not exists idx_social_follows_follower on social_follows (follower_id);

create table if not exists social_notifications (
  id         text primary key,
  user_id    text not null,
  actor_id   text not null,
  actor_name text not null,
  actor_avatar text,
  type       text not null check (type in ('like', 'comment', 'follow')),
  post_id    text,
  preview    text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_social_notifications_user on social_notifications (user_id, created_at desc);

-- Premium membership
create table if not exists premium_memberships (
  user_id text primary key,
  tier    text not null default 'free' check (tier in ('free', 'plus', 'host_pro')),
  since   timestamptz
);

// Shared TypeScript types for StayNest social features.
// Mirrors the column shapes used by supabase/migrations/social_schema.sql so the
// in-memory mock and the Supabase-backed store stay interchangeable.

export type SocialUser = {
  id: string;
  name: string;
  avatar?: string; // optional image url; falls back to an initial bubble
  bio?: string;
};

export type Post = {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  text: string;
  image_url?: string | null;
  listing_id?: string | null; // optional linked StayNest listing
  created_at: string; // ISO string
  like_count: number;
  comment_count: number;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  text: string;
  created_at: string;
};

export type Like = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type Follow = {
  id: string;
  follower_id: string;
  followee_id: string;
  created_at: string;
};

export type SocialNotification = {
  id: string;
  user_id: string; // recipient
  actor_id: string;
  actor_name: string;
  actor_avatar?: string;
  type: "like" | "comment" | "follow";
  post_id?: string | null;
  preview?: string | null; // small text snippet for context
  read: boolean;
  created_at: string;
};

// A feed item is a post enriched with the viewer's like state and a reason
// describing why it surfaced (followed author vs. popular).
export type FeedItem = Post & {
  liked_by_me: boolean;
  reason: "following" | "popular";
};

export type ProfileSummary = {
  user: SocialUser;
  post_count: number;
  follower_count: number;
  following_count: number;
  is_following: boolean;
};

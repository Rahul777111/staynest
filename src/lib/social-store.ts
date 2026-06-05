// Social data layer for StayNest.
//
// Like the rest of src/lib (see wishlist / supabase), this uses Supabase when
// it is configured (NEXT_PUBLIC_SUPABASE_* present) and otherwise falls back to
// a process-wide in-memory mock that is pre-seeded with demo content so the app
// is fully explorable with zero configuration.
//
// All exported helpers are async and server-only friendly (used from route
// handlers). They never throw on missing config — they degrade to the mock.

import { supabase, hasSupabase } from "./supabase";
import type {
  Post,
  Comment,
  Follow,
  SocialNotification,
  FeedItem,
  SocialUser,
  ProfileSummary,
} from "./social-types";

// ----------------------------------------------------------------------------
// In-memory mock (persists for the life of the server process)
// ----------------------------------------------------------------------------

type DB = {
  users: SocialUser[];
  posts: Post[];
  comments: Comment[];
  likes: { post_id: string; user_id: string; created_at: string }[];
  follows: Follow[];
  notifications: SocialNotification[];
  seeded: boolean;
};

// Use a global so Next.js dev hot-reload doesn't wipe the store on every edit.
const g = globalThis as unknown as { __staynest_social?: DB };

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

function seed(): DB {
  const now = Date.now();
  const iso = (minsAgo: number) => new Date(now - minsAgo * 60000).toISOString();

  const users: SocialUser[] = [
    { id: "u-giulia", name: "Giulia Romano", bio: "Superhost on the Amalfi Coast 🌊 Sharing slow mornings by the sea." },
    { id: "u-mason", name: "Mason Pike", bio: "Cabin host in Aspen. Skier, fire-builder, hot-tub philosopher." },
    { id: "u-eleni", name: "Eleni Andino", bio: "Cave houses & caldera sunsets in Oia, Santorini." },
    { id: "u-haruki", name: "Haruki Sato", bio: "Minimal living in Tokyo. Less stuff, more light." },
    { id: "u-marisol", name: "Marisol Vega", bio: "Desert design house in Joshua Tree. Stargazer." },
  ];

  const posts: Post[] = [
    {
      id: "p-1",
      author_id: "u-giulia",
      author_name: "Giulia Romano",
      text: "Infinity pool is officially open for the season ☀️ Guests this week caught the most unreal sunset over the Tyrrhenian. Who's coming to the Amalfi Coast?",
      image_url:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      listing_id: "villa-amalfi",
      created_at: iso(38),
      like_count: 3,
      comment_count: 1,
    },
    {
      id: "p-2",
      author_id: "u-eleni",
      author_name: "Eleni Andino",
      text: "Whitewashed walls stay cool even at 35°C — old island engineering beats AC any day. Caldera plunge pool weather has arrived in Oia.",
      image_url: "/listings/santorini.jpg",
      listing_id: "cave-santorini",
      created_at: iso(95),
      like_count: 5,
      comment_count: 0,
    },
    {
      id: "p-3",
      author_id: "u-mason",
      author_name: "Mason Pike",
      text: "First snow dusting on the pines this morning. Stacked three cords of firewood and the hot tub is hot. Cabin season is the best season.",
      image_url: "/listings/scotland.jpg",
      listing_id: "cabin-aspen",
      created_at: iso(220),
      like_count: 2,
      comment_count: 1,
    },
    {
      id: "p-4",
      author_id: "u-marisol",
      author_name: "Marisol Vega",
      text: "Clear desert skies tonight — the Milky Way was so bright over the pool it cast shadows. Joshua Tree never gets old.",
      image_url: "/listings/joshuatree.jpg",
      listing_id: "desert-joshuatree",
      created_at: iso(400),
      like_count: 4,
      comment_count: 0,
    },
    {
      id: "p-5",
      author_id: "u-haruki",
      author_name: "Haruki Sato",
      text: "Reorganised the loft this weekend. Rule that's served me well: if it doesn't earn its place, it leaves. Shibuya light doing the rest.",
      image_url: null,
      listing_id: "loft-tokyo",
      created_at: iso(700),
      like_count: 1,
      comment_count: 0,
    },
  ];

  const comments: Comment[] = [
    {
      id: "c-1",
      post_id: "p-1",
      author_id: "u-eleni",
      author_name: "Eleni Andino",
      text: "Those sunsets are unmatched. Booking my off-season escape now!",
      created_at: iso(30),
    },
    {
      id: "c-2",
      post_id: "p-3",
      author_id: "u-marisol",
      author_name: "Marisol Vega",
      text: "Opposite weather, same cozy energy. Trading you a desert night for a snowy one?",
      created_at: iso(180),
    },
  ];

  const likes: DB["likes"] = [
    { post_id: "p-1", user_id: "u-mason", created_at: iso(35) },
    { post_id: "p-1", user_id: "u-eleni", created_at: iso(33) },
    { post_id: "p-1", user_id: "u-haruki", created_at: iso(31) },
    { post_id: "p-2", user_id: "u-giulia", created_at: iso(90) },
    { post_id: "p-2", user_id: "u-mason", created_at: iso(88) },
    { post_id: "p-2", user_id: "u-marisol", created_at: iso(86) },
    { post_id: "p-2", user_id: "u-haruki", created_at: iso(84) },
    { post_id: "p-2", user_id: "u-giulia", created_at: iso(82) },
    { post_id: "p-3", user_id: "u-giulia", created_at: iso(210) },
    { post_id: "p-3", user_id: "u-eleni", created_at: iso(205) },
    { post_id: "p-4", user_id: "u-giulia", created_at: iso(395) },
    { post_id: "p-4", user_id: "u-mason", created_at: iso(390) },
    { post_id: "p-4", user_id: "u-eleni", created_at: iso(385) },
    { post_id: "p-4", user_id: "u-haruki", created_at: iso(380) },
    { post_id: "p-5", user_id: "u-marisol", created_at: iso(690) },
  ];

  const follows: Follow[] = [
    { id: uid("f"), follower_id: "u-giulia", followee_id: "u-eleni", created_at: iso(1000) },
    { id: uid("f"), follower_id: "u-mason", followee_id: "u-giulia", created_at: iso(1100) },
    { id: uid("f"), follower_id: "u-eleni", followee_id: "u-giulia", created_at: iso(1200) },
    { id: uid("f"), follower_id: "u-marisol", followee_id: "u-haruki", created_at: iso(1300) },
  ];

  const notifications: SocialNotification[] = [
    {
      id: uid("n"),
      user_id: "u-giulia",
      actor_id: "u-eleni",
      actor_name: "Eleni Andino",
      type: "comment",
      post_id: "p-1",
      preview: "Those sunsets are unmatched…",
      read: false,
      created_at: iso(30),
    },
    {
      id: uid("n"),
      user_id: "u-giulia",
      actor_id: "u-mason",
      actor_name: "Mason Pike",
      type: "follow",
      post_id: null,
      preview: null,
      read: false,
      created_at: iso(1100),
    },
    {
      id: uid("n"),
      user_id: "u-giulia",
      actor_id: "u-haruki",
      actor_name: "Haruki Sato",
      type: "like",
      post_id: "p-1",
      preview: "liked your post",
      read: true,
      created_at: iso(31),
    },
  ];

  return { users, posts, comments, likes, follows, notifications, seeded: true };
}

function db(): DB {
  if (!g.__staynest_social) g.__staynest_social = seed();
  return g.__staynest_social;
}

// ----------------------------------------------------------------------------
// Helpers shared by both backends
// ----------------------------------------------------------------------------

function knownUser(id: string, fallbackName?: string): SocialUser {
  const found = db().users.find((u) => u.id === id);
  if (found) return found;
  return { id, name: fallbackName || id.replace(/^u-/, "").replace(/-/g, " ") || "Guest" };
}

function ensureUser(id: string, name?: string, avatar?: string) {
  const d = db();
  const existing = d.users.find((u) => u.id === id);
  if (!existing) d.users.push({ id, name: name || "Guest", avatar });
  else if (name && existing.name === "Guest") existing.name = name;
}

// ----------------------------------------------------------------------------
// POSTS
// ----------------------------------------------------------------------------

export async function listPosts(opts: { authorId?: string } = {}): Promise<Post[]> {
  if (hasSupabase) {
    let q = supabase.from("social_posts").select("*").order("created_at", { ascending: false });
    if (opts.authorId) q = q.eq("author_id", opts.authorId);
    const { data } = await q;
    return (data || []) as Post[];
  }
  let posts = [...db().posts].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
  );
  if (opts.authorId) posts = posts.filter((p) => p.author_id === opts.authorId);
  return posts;
}

export async function getPost(id: string): Promise<Post | null> {
  if (hasSupabase) {
    const { data } = await supabase.from("social_posts").select("*").eq("id", id).single();
    return (data as Post) || null;
  }
  return db().posts.find((p) => p.id === id) || null;
}

export async function createPost(input: {
  author_id: string;
  author_name: string;
  author_avatar?: string;
  text: string;
  image_url?: string | null;
  listing_id?: string | null;
}): Promise<Post> {
  const post: Post = {
    id: uid("p"),
    author_id: input.author_id,
    author_name: input.author_name,
    author_avatar: input.author_avatar,
    text: input.text,
    image_url: input.image_url ?? null,
    listing_id: input.listing_id ?? null,
    created_at: new Date().toISOString(),
    like_count: 0,
    comment_count: 0,
  };
  if (hasSupabase) {
    const { data } = await supabase.from("social_posts").insert(post).select("*").single();
    return (data as Post) || post;
  }
  ensureUser(input.author_id, input.author_name, input.author_avatar);
  db().posts.unshift(post);
  return post;
}

export async function deletePost(id: string, requesterId?: string): Promise<boolean> {
  if (hasSupabase) {
    let q = supabase.from("social_posts").delete().eq("id", id);
    if (requesterId) q = q.eq("author_id", requesterId);
    await q;
    return true;
  }
  const d = db();
  const post = d.posts.find((p) => p.id === id);
  if (!post) return false;
  if (requesterId && post.author_id !== requesterId) return false;
  d.posts = d.posts.filter((p) => p.id !== id);
  d.comments = d.comments.filter((c) => c.post_id !== id);
  d.likes = d.likes.filter((l) => l.post_id !== id);
  return true;
}

// ----------------------------------------------------------------------------
// LIKES
// ----------------------------------------------------------------------------

export async function isLiked(postId: string, userId: string): Promise<boolean> {
  if (!userId) return false;
  if (hasSupabase) {
    const { data } = await supabase
      .from("social_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();
    return Boolean(data);
  }
  return db().likes.some((l) => l.post_id === postId && l.user_id === userId);
}

export async function setLike(
  postId: string,
  userId: string,
  liked: boolean,
  actorName?: string
): Promise<{ like_count: number; liked: boolean }> {
  if (hasSupabase) {
    if (liked) {
      await supabase.from("social_likes").upsert(
        { post_id: postId, user_id: userId },
        { onConflict: "post_id,user_id" }
      );
    } else {
      await supabase.from("social_likes").delete().eq("post_id", postId).eq("user_id", userId);
    }
    const { count } = await supabase
      .from("social_likes")
      .select("id", { count: "exact", head: true })
      .eq("post_id", postId);
    const like_count = count ?? 0;
    await supabase.from("social_posts").update({ like_count }).eq("id", postId);
    return { like_count, liked };
  }

  const d = db();
  const post = d.posts.find((p) => p.id === postId);
  const already = d.likes.some((l) => l.post_id === postId && l.user_id === userId);
  if (liked && !already) {
    d.likes.push({ post_id: postId, user_id: userId, created_at: new Date().toISOString() });
    if (post && post.author_id !== userId) {
      addNotificationSync({
        user_id: post.author_id,
        actor_id: userId,
        actor_name: actorName || knownUser(userId).name,
        type: "like",
        post_id: postId,
        preview: "liked your post",
      });
    }
  } else if (!liked && already) {
    d.likes = d.likes.filter((l) => !(l.post_id === postId && l.user_id === userId));
  }
  const like_count = d.likes.filter((l) => l.post_id === postId).length;
  if (post) post.like_count = like_count;
  return { like_count, liked };
}

// ----------------------------------------------------------------------------
// COMMENTS
// ----------------------------------------------------------------------------

export async function listComments(postId: string): Promise<Comment[]> {
  if (hasSupabase) {
    const { data } = await supabase
      .from("social_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    return (data || []) as Comment[];
  }
  return db()
    .comments.filter((c) => c.post_id === postId)
    .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
}

export async function addComment(input: {
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  text: string;
}): Promise<Comment> {
  const comment: Comment = {
    id: uid("c"),
    post_id: input.post_id,
    author_id: input.author_id,
    author_name: input.author_name,
    author_avatar: input.author_avatar,
    text: input.text,
    created_at: new Date().toISOString(),
  };
  if (hasSupabase) {
    const { data } = await supabase.from("social_comments").insert(comment).select("*").single();
    const { count } = await supabase
      .from("social_comments")
      .select("id", { count: "exact", head: true })
      .eq("post_id", input.post_id);
    await supabase.from("social_posts").update({ comment_count: count ?? 0 }).eq("id", input.post_id);
    return (data as Comment) || comment;
  }
  const d = db();
  ensureUser(input.author_id, input.author_name, input.author_avatar);
  d.comments.push(comment);
  const post = d.posts.find((p) => p.id === input.post_id);
  if (post) {
    post.comment_count = d.comments.filter((c) => c.post_id === input.post_id).length;
    if (post.author_id !== input.author_id) {
      addNotificationSync({
        user_id: post.author_id,
        actor_id: input.author_id,
        actor_name: input.author_name,
        type: "comment",
        post_id: input.post_id,
        preview: input.text.slice(0, 60),
      });
    }
  }
  return comment;
}

// ----------------------------------------------------------------------------
// FOLLOWS
// ----------------------------------------------------------------------------

export async function isFollowing(followerId: string, followeeId: string): Promise<boolean> {
  if (!followerId) return false;
  if (hasSupabase) {
    const { data } = await supabase
      .from("social_follows")
      .select("id")
      .eq("follower_id", followerId)
      .eq("followee_id", followeeId)
      .maybeSingle();
    return Boolean(data);
  }
  return db().follows.some(
    (f) => f.follower_id === followerId && f.followee_id === followeeId
  );
}

export async function setFollow(
  followerId: string,
  followeeId: string,
  follow: boolean,
  followerName?: string
): Promise<{ following: boolean; follower_count: number }> {
  if (hasSupabase) {
    if (follow) {
      await supabase.from("social_follows").upsert(
        { follower_id: followerId, followee_id: followeeId },
        { onConflict: "follower_id,followee_id" }
      );
    } else {
      await supabase
        .from("social_follows")
        .delete()
        .eq("follower_id", followerId)
        .eq("followee_id", followeeId);
    }
    const { count } = await supabase
      .from("social_follows")
      .select("id", { count: "exact", head: true })
      .eq("followee_id", followeeId);
    return { following: follow, follower_count: count ?? 0 };
  }

  const d = db();
  const exists = d.follows.some(
    (f) => f.follower_id === followerId && f.followee_id === followeeId
  );
  if (follow && !exists && followerId !== followeeId) {
    d.follows.push({
      id: uid("f"),
      follower_id: followerId,
      followee_id: followeeId,
      created_at: new Date().toISOString(),
    });
    addNotificationSync({
      user_id: followeeId,
      actor_id: followerId,
      actor_name: followerName || knownUser(followerId).name,
      type: "follow",
      post_id: null,
      preview: null,
    });
  } else if (!follow && exists) {
    d.follows = d.follows.filter(
      (f) => !(f.follower_id === followerId && f.followee_id === followeeId)
    );
  }
  const follower_count = d.follows.filter((f) => f.followee_id === followeeId).length;
  return { following: follow, follower_count };
}

async function followingIds(userId: string): Promise<string[]> {
  if (hasSupabase) {
    const { data } = await supabase
      .from("social_follows")
      .select("followee_id")
      .eq("follower_id", userId);
    return (data || []).map((r: { followee_id: string }) => r.followee_id);
  }
  return db()
    .follows.filter((f) => f.follower_id === userId)
    .map((f) => f.followee_id);
}

// ----------------------------------------------------------------------------
// PROFILE
// ----------------------------------------------------------------------------

export async function getProfile(id: string, viewerId?: string): Promise<ProfileSummary> {
  const user = knownUser(id);
  if (hasSupabase) {
    const [{ count: postCount }, { count: followers }, { count: following }] =
      await Promise.all([
        supabase.from("social_posts").select("id", { count: "exact", head: true }).eq("author_id", id),
        supabase.from("social_follows").select("id", { count: "exact", head: true }).eq("followee_id", id),
        supabase.from("social_follows").select("id", { count: "exact", head: true }).eq("follower_id", id),
      ]);
    return {
      user,
      post_count: postCount ?? 0,
      follower_count: followers ?? 0,
      following_count: following ?? 0,
      is_following: viewerId ? await isFollowing(viewerId, id) : false,
    };
  }
  const d = db();
  return {
    user,
    post_count: d.posts.filter((p) => p.author_id === id).length,
    follower_count: d.follows.filter((f) => f.followee_id === id).length,
    following_count: d.follows.filter((f) => f.follower_id === id).length,
    is_following: viewerId
      ? d.follows.some((f) => f.follower_id === viewerId && f.followee_id === id)
      : false,
  };
}

// ----------------------------------------------------------------------------
// FEED (followed authors first, then popular)
// ----------------------------------------------------------------------------

export async function getFeed(viewerId: string): Promise<FeedItem[]> {
  const posts = await listPosts();
  const following = viewerId ? await followingIds(viewerId) : [];

  const items: FeedItem[] = [];
  for (const p of posts) {
    const liked_by_me = viewerId ? await isLiked(p.id, viewerId) : false;
    const reason: FeedItem["reason"] =
      following.includes(p.author_id) ? "following" : "popular";
    items.push({ ...p, liked_by_me, reason });
  }

  // Following posts first (most recent), then popular sorted by engagement.
  const followingItems = items
    .filter((i) => i.reason === "following")
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  const popularItems = items
    .filter((i) => i.reason === "popular")
    .sort(
      (a, b) =>
        b.like_count + b.comment_count - (a.like_count + a.comment_count) ||
        +new Date(b.created_at) - +new Date(a.created_at)
    );
  return [...followingItems, ...popularItems];
}

// ----------------------------------------------------------------------------
// NOTIFICATIONS
// ----------------------------------------------------------------------------

function addNotificationSync(input: Omit<SocialNotification, "id" | "read" | "created_at">) {
  db().notifications.unshift({
    ...input,
    id: uid("n"),
    read: false,
    created_at: new Date().toISOString(),
  });
}

export async function listNotifications(userId: string): Promise<SocialNotification[]> {
  if (!userId) return [];
  if (hasSupabase) {
    const { data } = await supabase
      .from("social_notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return (data || []) as SocialNotification[];
  }
  return db()
    .notifications.filter((n) => n.user_id === userId)
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

export async function markNotificationsRead(userId: string): Promise<void> {
  if (!userId) return;
  if (hasSupabase) {
    await supabase.from("social_notifications").update({ read: true }).eq("user_id", userId);
    return;
  }
  db().notifications.forEach((n) => {
    if (n.user_id === userId) n.read = true;
  });
}

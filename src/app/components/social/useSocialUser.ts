"use client";

import { useAuth } from "@/lib/auth";

// Maps the StayNest auth identity to a stable social user id + display name.
// Guests get a session-stable id so they can post/like/comment in the demo.
export function useSocialUser() {
  const { user, displayName, isGuest } = useAuth();
  const id = user?.id ? `u-${user.id.slice(0, 8)}` : "u-guest";
  const name = displayName || (isGuest ? "Guest" : "You");
  return { id, name, isGuest, isAuthed: Boolean(user) };
}

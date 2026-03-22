import { NextRequest, NextResponse } from "next/server";
import { CURRENT_USER, MOCK_USERS } from "@/lib/mock-data";

const FOLLOW_STATE = new Set<string>();

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const targetUser =
    username === CURRENT_USER.username
      ? CURRENT_USER
      : MOCK_USERS.find((u) => u.username === username);

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (targetUser.username === CURRENT_USER.username) {
    return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
  }

  const key = `${CURRENT_USER.id}:${targetUser.id}`;
  const wasFollowing = FOLLOW_STATE.has(key);
  const isFollowing = !wasFollowing;

  if (isFollowing) {
    FOLLOW_STATE.add(key);
    targetUser.followersCount += 1;
    CURRENT_USER.followingCount += 1;
  } else {
    FOLLOW_STATE.delete(key);
    targetUser.followersCount = Math.max(0, targetUser.followersCount - 1);
    CURRENT_USER.followingCount = Math.max(0, CURRENT_USER.followingCount - 1);
  }

  return NextResponse.json({ isFollowing, followersCount: targetUser.followersCount });
}

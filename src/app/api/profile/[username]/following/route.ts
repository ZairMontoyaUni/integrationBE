import { NextRequest, NextResponse } from "next/server";
import { CURRENT_USER, MOCK_USERS } from "@/lib/mock-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const user =
    username === CURRENT_USER.username
      ? CURRENT_USER
      : MOCK_USERS.find((u) => u.username === username);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const following = MOCK_USERS.slice(0, Math.min(user.followingCount, 10));

  return NextResponse.json({ count: user.followingCount, users: following });
}

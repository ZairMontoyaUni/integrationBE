import { NextResponse } from "next/server";
import { CURRENT_USER, MOCK_USERS } from "@/lib/mock-data";

export async function GET() {
  const stories = [CURRENT_USER, ...MOCK_USERS.slice(0, 5)].map((user) => ({
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    isOwn: user.id === CURRENT_USER.id,
  }));

  return NextResponse.json(stories);
}

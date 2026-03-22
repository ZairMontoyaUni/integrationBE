import { NextRequest, NextResponse } from "next/server";
import { CURRENT_USER, MOCK_REELS } from "@/lib/mock-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const reels =
    username === CURRENT_USER.username
      ? MOCK_REELS.filter((reel) => reel.author.id === CURRENT_USER.id)
      : MOCK_REELS.filter((reel) => reel.author.username === username);

  return NextResponse.json(reels);
}

import { NextResponse } from "next/server";
import { getChannelData, YouTubeApiError, REVALIDATE_SECONDS } from "@/lib/youtube";

// Evaluated per request; the YouTube responses themselves are cached by fetch().
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getChannelData(6);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 2}`,
      },
    });
  } catch (error) {
    if (error instanceof YouTubeApiError) {
      // Log the detail on the server; send only a safe code to the browser.
      console.error(`[youtube] ${error.code}: ${error.message}`);
      return NextResponse.json(
        { error: error.code },
        { status: error.status, headers: { "Cache-Control": "no-store" } },
      );
    }
    console.error("[youtube] unexpected error", error);
    return NextResponse.json(
      { error: "upstream" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

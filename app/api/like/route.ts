import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { articleId } = (await request.json().catch(() => ({}))) as { articleId?: number };
  if (!articleId) {
    return NextResponse.json({ success: false, message: "Invalid article id" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const { data, error } = await supabase.rpc("increment_article_likes", {
    target_article_id: articleId,
    visitor_ip: ip,
    visitor_agent: request.headers.get("user-agent") || null
  });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, likes_count: data });
}

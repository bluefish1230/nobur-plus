import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart } from "lucide-react";
import PublicNav from "@/components/PublicNav";
import { formatDate } from "@/lib/format";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Article, Category } from "@/lib/types";
import LikeButton from "./LikeButton";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabaseAdmin();
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  const [{ data: categories }, { data: article }] = await Promise.all([
    supabase.from("categories").select("*").order("created_at", { ascending: true }),
    supabase
      .from("articles")
      .select("*, category:categories(id,name), author:users(id,username,nickname)")
      .eq("id", id)
      .single()
  ]);

  if (!article) notFound();

  const row = article as Article;
  const author = row.author?.nickname || row.author?.username || "管理者";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pt-24">
      <PublicNav categories={(categories || []) as Category[]} />
      <main className="container mx-auto flex-1 px-6 py-10">
        <article className="mx-auto max-w-3xl">
          <div className="mb-10">
            <span className="rounded bg-theme px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
              {row.category?.name || "未分類"}
            </span>
            <div className="mt-4 flex flex-wrap gap-2">
              {(row.tags || []).map((tag) => (
                <span key={tag} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-black text-gray-500 shadow-sm">
                  #{tag}
                </span>
              ))}
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight text-gray-900 md:text-5xl">{row.title}</h1>
            <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase italic text-gray-400">
              <span>{formatDate(row.created_at)}</span>
              <span className="text-theme">作者 / {author}</span>
            </div>
          </div>

          {row.image_url && (
            <div className="mb-12 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
              <img src={row.image_url} alt={row.title} className="w-full rounded-xl" />
            </div>
          )}

          <div
            className="content-area rounded-3xl border border-gray-200 bg-white p-8 text-lg shadow-sm md:p-12"
            dangerouslySetInnerHTML={{ __html: row.content }}
          />

          <div className="mt-10 flex flex-col items-center">
            <LikeButton articleId={row.id} initialLikes={row.likes_count} />
            <div className="mt-12 text-center">
              <Link href="/" className="font-bold text-theme hover:underline">
                回到文章列表
              </Link>
            </div>
          </div>
        </article>
      </main>
      <footer className="border-t border-gray-100 py-12 text-center text-sm text-gray-500">
        <Heart className="mr-1 inline h-4 w-4 fill-red-500 text-red-500" />
        Nobur Plus
      </footer>
    </div>
  );
}

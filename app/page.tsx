import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import PublicNav from "@/components/PublicNav";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Article, Category } from "@/lib/types";

export const dynamic = "force-dynamic";

const perPage = 12;

export default async function Home({
  searchParams
}: {
  searchParams: { cat?: string; page?: string };
}) {
  const supabase = getSupabaseAdmin();
  const activeCategory = Number(searchParams.cat || 0);
  const page = Math.max(Number(searchParams.page || 1), 1);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const [{ data: categories }, articlesResult] = await Promise.all([
    supabase.from("categories").select("*").order("created_at", { ascending: true }),
    (() => {
      let query = supabase
        .from("articles")
        .select("*, category:categories(id,name)", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (activeCategory > 0) {
        query = query.eq("category_id", activeCategory);
      }

      return query;
    })()
  ]);

  const articleRows = (articlesResult.data || []) as Article[];
  const totalPages = Math.max(Math.ceil((articlesResult.count || 0) / perPage), 1);

  return (
    <div className="min-h-screen bg-gray-100 pt-24">
      <PublicNav categories={(categories || []) as Category[]} activeCategory={activeCategory} />

      <section className="theme-gradient relative mb-10 overflow-hidden py-14">
        <div className="container relative z-10 mx-auto px-6">
          <h1 className="max-w-3xl text-4xl font-black italic text-white md:text-6xl">AI 梗圖與靈感文章收藏站</h1>
          <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-white/82">
            集中整理 AI 工具、迷因梗圖、創作筆記與有趣案例，讓好玩的東西不要散落在聊天室裡。
          </p>
        </div>
        <img
          data-theme-avatar
          src="/assets/avatar_gojo.png"
          alt=""
          className="absolute bottom-0 right-0 h-72 w-72 translate-x-1/4 translate-y-1/4 object-contain opacity-10 grayscale invert"
        />
      </section>

      <main className="container mx-auto px-6 pb-20">
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-gray-200 pb-8 md:flex-row md:items-center">
          <h2 className="flex items-center text-2xl font-black">
            <span className="mr-3 h-8 w-2 rounded-full bg-theme" />
            最新文章
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className={`rounded-full px-5 py-2 text-sm font-black transition ${
                !activeCategory ? "bg-theme text-white shadow-lg" : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              全部
            </Link>
            {(categories || []).map((category) => (
              <Link
                key={category.id}
                href={`/?cat=${category.id}`}
                className={`rounded-full px-5 py-2 text-sm font-black transition ${
                  activeCategory === category.id
                    ? "bg-theme text-white shadow-lg"
                    : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {articleRows.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articleRows.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <h3 className="text-xl font-black text-gray-900">目前還沒有文章</h3>
            <p className="mt-2 text-sm text-gray-500">到後台新增第一篇內容後，這裡就會開始熱鬧起來。</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-16 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
              <Link
                key={item}
                href={`/?${activeCategory ? `cat=${activeCategory}&` : ""}page=${item}`}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl font-black shadow-sm transition ${
                  item === page ? "scale-110 bg-theme text-white" : "border border-gray-100 bg-white text-gray-400 hover:text-theme"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white py-12 text-center text-sm text-gray-400">
        © 2026 Nobur Plus
      </footer>
    </div>
  );
}

import AdminShell from "@/components/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const [{ count: categoryCount }, { count: articleCount }, { data: latest }] = await Promise.all([
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase
      .from("articles")
      .select("*, category:categories(id,name)")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-3xl font-black italic text-gray-900">後台總覽</h1>
        <p className="mt-2 text-sm text-gray-500">管理 Nobur Plus 的內容、分類與作者。</p>
      </div>
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-gray-400">分類數</div>
          <div className="mt-2 text-4xl font-black text-indigo-600">{categoryCount || 0}</div>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-bold text-gray-400">文章數</div>
          <div className="mt-2 text-4xl font-black text-indigo-600">{articleCount || 0}</div>
        </div>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-black">最新文章</h2>
        <div className="divide-y divide-gray-100">
          {((latest || []) as Article[]).map((article) => (
            <div key={article.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <div className="font-black text-gray-900">{article.title}</div>
                <div className="mt-1 text-xs text-gray-400">{formatDate(article.created_at)}</div>
              </div>
              <div className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-black text-indigo-600">
                {article.category?.name || "未分類"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

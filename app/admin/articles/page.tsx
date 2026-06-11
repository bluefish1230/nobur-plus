import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import { formatDate } from "@/lib/format";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Article } from "@/lib/types";
import { deleteArticle } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  await requireAdmin();
  const { data } = await getSupabaseAdmin()
    .from("articles")
    .select("*, category:categories(id,name)")
    .order("created_at", { ascending: false });
  const articles = (data || []) as Article[];

  return (
    <AdminShell>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-black italic text-gray-900">文章管理</h1>
        <Link href="/admin/articles/new" className="rounded-xl bg-indigo-600 px-6 py-3 text-center font-black text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">
          + 新增文章
        </Link>
      </div>
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full min-w-[860px] text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4">分類</th>
              <th className="px-6 py-4">作者</th>
              <th className="px-6 py-4">標題</th>
              <th className="px-6 py-4">圖片</th>
              <th className="px-6 py-4">時間</th>
              <th className="px-6 py-4">讚數</th>
              <th className="px-6 py-4">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-6 py-4">
                  <span className="rounded bg-indigo-50 px-2 py-1 text-xs font-black text-indigo-600">{article.category?.name}</span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-500">{process.env.ADMIN_NICKNAME || "管理者"}</td>
                <td className="px-6 py-4 font-black text-gray-900">{article.title}</td>
                <td className="px-6 py-4">
                  {article.image_url ? (
                    <img src={article.image_url} alt="" className="h-10 w-16 rounded object-cover" />
                  ) : (
                    <div className="flex h-10 w-16 items-center justify-center rounded bg-gray-100 text-[10px] text-gray-400">NO IMG</div>
                  )}
                </td>
                <td className="px-6 py-4 text-xs text-gray-400">{formatDate(article.created_at)}</td>
                <td className="px-6 py-4 text-sm font-black text-gray-600">{article.likes_count}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-3 text-sm">
                    <Link href={`/admin/articles/${article.id}/edit`} className="font-bold text-indigo-600">編輯</Link>
                    <form action={deleteArticle}>
                      <input type="hidden" name="id" value={article.id} />
                      <button className="font-bold text-red-500">刪除</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

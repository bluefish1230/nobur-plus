import AdminShell from "@/components/AdminShell";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Category } from "@/lib/types";
import { createCategory, deleteCategory, updateCategory } from "../actions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  await requireAdmin();
  const { data } = await getSupabaseAdmin().from("categories").select("*").order("created_at", { ascending: true });
  const categories = (data || []) as Category[];

  return (
    <AdminShell>
      <h1 className="mb-8 text-3xl font-black italic text-gray-900">分類管理</h1>
      <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-black">新增分類</h2>
        <form action={createCategory} className="flex gap-4">
          <input name="name" placeholder="分類名稱" className="flex-1 rounded-xl border p-3 outline-none focus:border-indigo-600" required />
          <button className="rounded-xl bg-indigo-600 px-8 font-black text-white hover:bg-indigo-700">新增</button>
        </form>
      </div>
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">名稱</th>
              <th className="px-6 py-4">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 text-sm text-gray-400">#{category.id}</td>
                <td className="px-6 py-4">
                  <form action={updateCategory} className="flex max-w-md gap-2">
                    <input type="hidden" name="id" value={category.id} />
                    <input name="name" defaultValue={category.name} className="flex-1 rounded-lg border p-2 outline-none focus:border-indigo-600" />
                    <button className="rounded-lg bg-gray-900 px-4 text-sm font-black text-white">儲存</button>
                  </form>
                </td>
                <td className="px-6 py-4">
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={category.id} />
                    <button className="text-sm font-bold text-red-500">刪除</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

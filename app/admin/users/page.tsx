import AdminShell from "@/components/AdminShell";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireAdmin();
  const username = process.env.ADMIN_USERNAME || "admin";
  const nickname = process.env.ADMIN_NICKNAME || "管理者";

  return (
    <AdminShell>
      <h1 className="mb-8 text-3xl font-black italic text-gray-900">使用者管理</h1>
      <div className="mb-8 rounded-3xl border bg-white p-8 shadow-sm">
        <h2 className="mb-3 font-black text-indigo-600">單一管理員模式</h2>
        <p className="max-w-2xl text-sm leading-6 text-gray-500">
          為了避免後台密碼雜湊透過 Supabase Data API 曝露，管理員帳號改由 Vercel 環境變數控制。
          如需修改帳號、暱稱或密碼，請更新 `ADMIN_USERNAME`、`ADMIN_NICKNAME`、`ADMIN_PASSWORD_HASH`。
        </p>
      </div>
      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">帳號</th>
              <th className="px-6 py-4">暱稱</th>
              <th className="px-6 py-4">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-6 py-4 text-sm text-gray-400">#1</td>
              <td className="px-6 py-4 text-lg font-black text-indigo-900">{username}</td>
              <td className="px-6 py-4 font-bold text-gray-600">{nickname}</td>
              <td className="px-6 py-4 text-sm text-gray-400">環境變數</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

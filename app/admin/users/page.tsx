import AdminShell from "@/components/AdminShell";
import { formatDate } from "@/lib/format";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { UserProfile } from "@/lib/types";
import { createUser, deleteUser, updateUser } from "../actions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await requireAdmin();
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("users").select("id, username, nickname, created_at").order("created_at", { ascending: true });
  const users = (data || []) as UserProfile[];

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-3xl font-black italic text-gray-900">後台帳號管理</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
          可以在這裡新增登入帳號、修改帳號名稱、暱稱和密碼。密碼留空時，儲存不會變更原本密碼。
        </p>
      </div>

      <div className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-black text-indigo-600">新增帳號</h2>
        <form action={createUser} className="grid gap-4 md:grid-cols-4">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">帳號</span>
            <input name="username" className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-indigo-600" required />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">暱稱</span>
            <input name="nickname" className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-indigo-600" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">密碼</span>
            <input name="password" type="password" className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-indigo-600" required />
          </label>
          <div className="flex items-end">
            <button className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-black text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">
              新增帳號
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-4">
        {users.map((user) => {
          const isCurrent = user.id === session.id;

          return (
            <div key={user.id} className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-gray-400">#{user.id}</div>
                  <div className="mt-1 text-lg font-black text-gray-900">{user.username}</div>
                  <div className="mt-1 text-sm text-gray-500">{user.nickname || "未設定暱稱"}</div>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <div>{formatDate(user.created_at)}</div>
                  {isCurrent && <div className="mt-1 font-black text-indigo-600">目前登入</div>}
                </div>
              </div>

              <form action={updateUser} className="grid gap-4 md:grid-cols-4">
                <input type="hidden" name="id" value={user.id} />
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">帳號</span>
                  <input
                    name="username"
                    defaultValue={user.username}
                    className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-indigo-600"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">暱稱</span>
                  <input
                    name="nickname"
                    defaultValue={user.nickname || ""}
                    className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-indigo-600"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">新密碼</span>
                  <input
                    name="password"
                    type="password"
                    placeholder="留空不變更"
                    className="w-full rounded-2xl border border-gray-200 p-3 outline-none focus:border-indigo-600"
                  />
                </label>
                <div className="flex items-end gap-2">
                  <button className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-black text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">
                    儲存
                  </button>
                </div>
              </form>

              <div className="mt-4 flex justify-end">
                <form action={deleteUser}>
                  <input type="hidden" name="id" value={user.id} />
                  <button
                    className="rounded-2xl border border-red-200 px-4 py-2 font-black text-red-500 hover:bg-red-50 disabled:opacity-50"
                    disabled={isCurrent}
                  >
                    {isCurrent ? "目前登入中" : "刪除"}
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}

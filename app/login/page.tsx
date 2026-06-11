import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { loginAction } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await readSession()) redirect("/admin");
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
        <div className="theme-gradient p-10 text-center text-white">
          <img src="/assets/avatar_jujutsu.png" alt="" className="mx-auto mb-4 h-20 w-20 rounded-full border-2 border-white/25" />
          <h1 className="text-2xl font-black">Nobur Plus 後台</h1>
          <p className="mt-1 text-sm text-indigo-100">登入後即可管理文章、分類與圖片。</p>
        </div>
        <div className="p-10">
          {params.error && (
            <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-600">
              帳號或密碼不正確。
            </div>
          )}
          <form action={loginAction} className="space-y-6">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">帳號</span>
              <input name="username" className="w-full rounded-2xl border-2 border-gray-100 p-4 outline-none transition focus:border-indigo-600" required />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-widest text-gray-400">密碼</span>
              <input name="password" type="password" className="w-full rounded-2xl border-2 border-gray-100 p-4 outline-none transition focus:border-indigo-600" required />
            </label>
            <button className="w-full rounded-2xl bg-indigo-600 py-5 text-lg font-black text-white shadow-xl shadow-indigo-200 transition hover:bg-indigo-700 active:scale-95">
              登入
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

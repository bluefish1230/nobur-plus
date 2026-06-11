import Link from "next/link";
import { BarChart3, FileText, Folder, LogOut, Users } from "lucide-react";
import { readSession } from "@/lib/auth";

const links = [
  { href: "/admin", label: "總覽", icon: BarChart3 },
  { href: "/admin/categories", label: "分類管理", icon: Folder },
  { href: "/admin/articles", label: "文章管理", icon: FileText },
  { href: "/admin/users", label: "使用者", icon: Users }
];

export default async function AdminShell({ children }: { children: React.ReactNode }) {
  const session = await readSession();

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      <aside className="hidden w-64 shrink-0 bg-neutral-950 text-white lg:block">
        <div className="border-b border-white/10 p-6 text-center">
          <img src="/assets/avatar_jujutsu.png" alt="" className="mx-auto mb-3 h-16 w-16 rounded-full border-2 border-indigo-500" />
          <div className="font-black">Nobur Plus 後台</div>
          <div className="mt-1 text-xs text-white/45">{session?.nickname || session?.username}</div>
        </div>
        <nav className="space-y-2 p-4 text-sm text-white/70">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg p-3 transition hover:bg-white/10 hover:text-white">
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <a href="/" target="_blank" className="mt-4 block rounded-lg border border-white/10 bg-white/5 p-3 text-center text-xs transition hover:bg-white/10">
            查看前台
          </a>
          <form action="/login/logout" method="post">
            <button className="flex w-full items-center gap-3 rounded-lg p-3 text-red-300 transition hover:bg-red-500/10">
              <LogOut className="h-4 w-4" />
              登出
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}

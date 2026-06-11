import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import type { Category } from "@/lib/types";

export default function PublicNav({
  categories,
  activeCategory
}: {
  categories: Category[];
  activeCategory?: number;
}) {
  return (
    <nav className="fixed top-0 z-50 flex w-full flex-col gap-2 border-b border-gray-200 bg-white/90 px-4 py-2 backdrop-blur">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            data-theme-avatar
            src="/assets/avatar_gojo.png"
            alt="Nobur Plus"
            className="h-14 w-14 rounded-full border-2 border-theme object-cover shadow-sm"
          />
          <span className="text-xl font-black tracking-tight text-theme">Nobur Plus</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Link
            href="/login"
            className="rounded-full bg-theme px-4 py-2 text-xs font-black text-white transition hover:opacity-90"
          >
            後台
          </Link>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto border-t border-gray-100 pt-2 text-sm font-bold text-gray-500">
        <Link href="/" className={!activeCategory ? "text-theme" : "transition hover:text-theme"}>
          全部
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/?cat=${category.id}`}
            className={activeCategory === category.id ? "text-theme" : "transition hover:text-theme"}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

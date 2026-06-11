"use client";

import { useEffect } from "react";

const themes = [
  { id: "gojo", color: "bg-indigo-600", avatar: "/assets/avatar_gojo.png", label: "五條" },
  { id: "itadori", color: "bg-pink-600", avatar: "/assets/avatar_itadori.png", label: "虎杖" },
  { id: "nobara", color: "bg-orange-600", avatar: "/assets/avatar_nobara.png", label: "釘崎" },
  { id: "sukuna", color: "bg-red-900", avatar: "/assets/avatar_sukuna.png", label: "宿儺" },
  { id: "jogo", color: "bg-yellow-500", avatar: "/assets/avatar_jogo.png", label: "漏瑚" }
];

function applyTheme(theme: string) {
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
  localStorage.setItem("nobur-theme", theme);
  const avatar = themes.find((item) => item.id === theme)?.avatar || themes[0].avatar;
  document.querySelectorAll<HTMLImageElement>("[data-theme-avatar]").forEach((img) => {
    img.src = avatar;
  });
}

export default function ThemeSwitcher() {
  useEffect(() => {
    applyTheme(localStorage.getItem("nobur-theme") || "gojo");
  }, []);

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 p-1">
      {themes.map((theme) => (
        <button
          key={theme.id}
          type="button"
          aria-label={theme.label}
          title={theme.label}
          onClick={() => applyTheme(theme.id)}
          className={`h-8 w-8 rounded-full border-2 border-white transition hover:scale-110 ${theme.color}`}
        />
      ))}
    </div>
  );
}

"use server";

import { redirect } from "next/navigation";
import { clearSession, login, setSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const cookie = await login(username, password);

  if (!cookie) {
    redirect("/login?error=1");
  }

  await setSession(cookie);
  redirect("/admin");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

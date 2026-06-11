"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hashPassword, requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

function tagsFromForm(formData: FormData) {
  return formData.getAll("tags").map(String).filter(Boolean);
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  if (name) {
    await getSupabaseAdmin().from("categories").insert({ name });
  }
  revalidatePath("/admin/categories");
}

export async function updateCategory(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") || "").trim();
  if (id && name) {
    await getSupabaseAdmin().from("categories").update({ name }).eq("id", id);
  }
  revalidatePath("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) {
    await getSupabaseAdmin().from("categories").delete().eq("id", id);
  }
  revalidatePath("/admin/categories");
}

export async function saveArticle(formData: FormData) {
  const session = await requireAdmin();
  const supabase = getSupabaseAdmin();
  const id = Number(formData.get("id") || 0);
  const payload = {
    title: String(formData.get("title") || "").trim(),
    category_id: Number(formData.get("category_id")),
    content: String(formData.get("content") || ""),
    image_url: String(formData.get("image_url") || "").trim() || null,
    tags: tagsFromForm(formData),
    user_id: session.id
  };

  if (id) {
    await supabase.from("articles").update(payload).eq("id", id);
  } else {
    await supabase.from("articles").insert(payload);
  }

  revalidatePath("/");
  revalidatePath("/admin/articles");
  redirect("/admin/articles");
}

export async function deleteArticle(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (id) {
    await getSupabaseAdmin().from("articles").delete().eq("id", id);
  }
  revalidatePath("/");
  revalidatePath("/admin/articles");
}

export async function createUser(formData: FormData) {
  await requireAdmin();
  const username = String(formData.get("username") || "").trim();
  const nickname = String(formData.get("nickname") || "").trim();
  const password = String(formData.get("password") || "");
  if (username && password) {
    await getSupabaseAdmin().from("users").insert({
      username,
      nickname,
      password_hash: await hashPassword(password)
    });
  }
  revalidatePath("/admin/users");
}

export async function updateUser(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const username = String(formData.get("username") || "").trim();
  const nickname = String(formData.get("nickname") || "").trim();
  const password = String(formData.get("password") || "");
  if (!id) return;

  const payload: { username: string; nickname: string; password_hash?: string } = {
    username,
    nickname
  };
  if (password) {
    payload.password_hash = await hashPassword(password);
  }

  await getSupabaseAdmin().from("users").update(payload).eq("id", id);
  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  const session = await requireAdmin();
  const id = Number(formData.get("id"));
  if (id && id !== session.id) {
    await getSupabaseAdmin().from("users").delete().eq("id", id);
  }
  revalidatePath("/admin/users");
}

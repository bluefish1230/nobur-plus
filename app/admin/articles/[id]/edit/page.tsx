import { notFound } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import ArticleForm from "@/components/ArticleForm";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Article, Category } from "@/lib/types";
import { saveArticle } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const [{ data: categories }, { data: article }] = await Promise.all([
    supabase.from("categories").select("*").order("created_at", { ascending: true }),
    supabase.from("articles").select("*").eq("id", Number(params.id)).single()
  ]);

  if (!article) notFound();

  return (
    <AdminShell>
      <h1 className="mb-8 text-3xl font-black italic text-gray-900">編輯文章</h1>
      <ArticleForm categories={(categories || []) as Category[]} article={article as Article} action={saveArticle} />
    </AdminShell>
  );
}

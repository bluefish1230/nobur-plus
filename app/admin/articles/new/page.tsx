import AdminShell from "@/components/AdminShell";
import ArticleForm from "@/components/ArticleForm";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Category } from "@/lib/types";
import { saveArticle } from "../../actions";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  await requireAdmin();
  const { data } = await getSupabaseAdmin().from("categories").select("*").order("created_at", { ascending: true });

  return (
    <AdminShell>
      <h1 className="mb-8 text-3xl font-black italic text-gray-900">新增文章</h1>
      <ArticleForm categories={(data || []) as Category[]} action={saveArticle} />
    </AdminShell>
  );
}

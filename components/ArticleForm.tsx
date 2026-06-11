"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { tagOptions, type Article, type Category } from "@/lib/types";

export default function ArticleForm({
  categories,
  article,
  action
}: {
  categories: Category[];
  article?: Article;
  action: (formData: FormData) => void;
}) {
  const [imageUrl, setImageUrl] = useState(article?.image_url || "");
  const [content, setContent] = useState(article?.content || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentTags = new Set(article?.tags || []);

  async function uploadFile(file: File, mode: "cover" | "content") {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const result = await response.json();
    setUploading(false);

    if (!result.url) {
      alert(result.message || "上傳失敗");
      return;
    }

    if (mode === "cover") {
      setImageUrl(result.url);
    } else {
      setContent((value) => `${value}\n<p><img src="${result.url}" alt="" /></p>`);
    }
  }

  return (
    <form action={action} className="space-y-6">
      {article?.id && <input type="hidden" name="id" value={article.id} />}
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-black text-gray-500">標題</span>
          <input
            name="title"
            defaultValue={article?.title || ""}
            className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:border-indigo-600"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-black text-gray-500">分類</span>
          <select
            name="category_id"
            defaultValue={article?.category_id || ""}
            className="w-full rounded-xl border border-gray-200 bg-white p-3 outline-none focus:border-indigo-600"
            required
          >
            <option value="">請選擇分類</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <span className="mb-2 block text-sm font-black text-gray-500">AI 標籤</span>
        <div className="grid gap-2 rounded-xl border border-gray-100 bg-white p-4 sm:grid-cols-3">
          {tagOptions.map((tag) => (
            <label key={tag} className="flex items-center gap-2 rounded-lg p-2 text-sm font-bold hover:bg-gray-50">
              <input type="checkbox" name="tags" value={tag} defaultChecked={currentTags.has(tag)} />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-black text-gray-500">封面圖片</span>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-black text-white transition hover:bg-indigo-700">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            上傳圖片
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadFile(file, "cover");
              }}
            />
          </label>
        </div>
        <input
          name="image_url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="或貼上圖片 URL"
          className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-indigo-600"
        />
        {imageUrl && <img src={imageUrl} alt="" className="mt-4 h-48 w-full rounded-xl object-cover" />}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-black text-gray-500">文章內容 HTML</span>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-black text-gray-600 transition hover:bg-gray-100">
            <ImagePlus className="h-4 w-4" />
            插入圖片
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadFile(file, "content");
              }}
            />
          </label>
        </div>
        <textarea
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={14}
          className="w-full rounded-xl border border-gray-200 p-4 font-mono text-sm leading-6 outline-none focus:border-indigo-600"
          required
        />
      </div>

      <div className="flex justify-end">
        <button className="rounded-xl bg-indigo-600 px-8 py-4 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
          儲存文章
        </button>
      </div>
    </form>
  );
}

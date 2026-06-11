import Link from "next/link";
import { Heart } from "lucide-react";
import type { Article } from "@/lib/types";
import { excerpt } from "@/lib/format";

export default function ArticleCard({ article }: { article: Article }) {
  const tags = article.tags || [];
  const author = article.author?.nickname || article.author?.username || "Nobur";

  return (
    <article className="group flex overflow-hidden rounded-[2rem] border-2 border-transparent bg-white shadow-sm transition hover:-translate-y-1 hover:border-theme hover:shadow-soft">
      <div className="flex w-full flex-col">
        {article.image_url ? (
          <div className="h-56 overflow-hidden">
            <img
              src={article.image_url}
              alt={article.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="theme-gradient flex h-56 items-center justify-center text-3xl font-black text-white/35">
            MEME
          </div>
        )}
        <div className="flex flex-1 flex-col p-7">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wide text-theme">
                {article.category?.name || "未分類"}
              </div>
              <div className="mt-1 text-[11px] font-bold text-gray-400">By {author}</div>
            </div>
            <div className="flex flex-wrap justify-end gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-gray-100 bg-gray-50 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <h2 className="mb-3 text-xl font-black leading-tight text-gray-900 transition group-hover:text-theme">
            {article.title}
          </h2>
          <div className="mb-5 inline-flex w-fit items-center rounded-lg border border-gray-100 bg-gray-50 px-2 py-1 text-xs font-black text-gray-500">
            <Heart className="mr-1 h-3.5 w-3.5 fill-red-500 text-red-500" />
            {article.likes_count}
          </div>
          <p className="mb-8 line-clamp-3 flex-1 text-sm leading-6 text-gray-500">{excerpt(article.content)}</p>
          <Link
            href={`/articles/${article.id}`}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 py-4 text-sm font-black uppercase tracking-widest text-theme transition hover:border-theme hover:bg-theme hover:text-white"
          >
            閱讀文章
          </Link>
        </div>
      </div>
    </article>
  );
}

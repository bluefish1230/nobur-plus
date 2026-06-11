"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({
  articleId,
  initialLikes
}: {
  articleId: number;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleLike() {
    setPending(true);
    const response = await fetch("/api/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId })
    });
    const result = await response.json();
    setPending(false);

    if (result.success) {
      setLikes(result.likes_count);
      setMessage("+1");
      setTimeout(() => setMessage(""), 1200);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={handleLike}
        className="group flex items-center gap-3 rounded-full border-2 border-gray-100 bg-white px-8 py-4 shadow-lg transition hover:border-theme active:scale-95 disabled:opacity-60"
      >
        <Heart className="h-8 w-8 fill-current text-theme" />
        <span className="text-2xl font-black text-gray-700">{likes}</span>
        <span className="text-sm font-bold text-gray-400">LIKES</span>
      </button>
      <p className={`mt-3 text-xs font-black text-theme transition ${message ? "opacity-100" : "opacity-0"}`}>
        {message || "liked"}
      </p>
    </>
  );
}

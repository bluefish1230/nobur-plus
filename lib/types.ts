export type Category = {
  id: number;
  name: string;
  created_at: string;
};

export type UserProfile = {
  id: number;
  username: string;
  nickname: string | null;
  created_at: string;
};

export type Article = {
  id: number;
  category_id: number;
  user_id: number | null;
  title: string;
  content: string;
  image_url: string | null;
  tags: string[] | null;
  likes_count: number;
  created_at: string;
  category?: Pick<Category, "id" | "name"> | null;
  author?: Pick<UserProfile, "id" | "username" | "nickname"> | null;
};

export const tagOptions = ["ChatGPT", "Gemini", "Claude", "Grok", "Manus", "其他"];

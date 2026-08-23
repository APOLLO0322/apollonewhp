import { z } from "zod";

// ご相談内容のチップ（README §3.4）。/contact も同一項目とする。
export const topicOptions = [
  { key: "movie", label: "映像・写真制作" },
  { key: "sns", label: "SNS運用支援" },
  { key: "other", label: "その他 / 相談" },
] as const;

export type TopicKey = (typeof topicOptions)[number]["key"];

export const contactSchema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください").max(100),
  organization: z.string().trim().max(100).optional().default(""),
  email: z.string().trim().email("メールアドレスの形式が正しくありません").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  topics: z.array(z.string()).min(1, "ご相談内容を1つ以上選択してください"),
  schedule: z.string().trim().max(100).optional().default(""),
  budget: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().max(4000).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

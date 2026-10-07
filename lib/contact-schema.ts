import { z } from "zod";

// ご相談内容のチップ（README §3.4）。/contact も同一項目とする。
/* ご相談内容。

   先頭の「構想から相談したい」は APPROACH の段01に対応する受け皿。
   これが無いと、段01の「何も決まっていない段階で、どうぞ」を読んで
   相談ボタンを押した人が、着いた先で自分の用件を選べない。
   順番も段01が先。まだ何も決まっていない人を最初に受ける。 */
export const topicOptions = [
  { key: "idea", label: "構想から相談したい" },
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

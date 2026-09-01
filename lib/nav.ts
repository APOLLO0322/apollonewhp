// メニューの順番と表記はここだけで定義する。
// TOPのヘッダー / フルページのヘッダー / フッターが同じ定義を見ることで、
// 片方だけ順番や表記がずれるのを防ぐ。

export type NavKey = "vision" | "works" | "service" | "company" | "contact";

// お問合せは下線付きのCTAとして別扱いにするため、末尾固定。
export const navOrder: NavKey[] = ["vision", "works", "service", "company"];

export const navLabel: Record<NavKey, string> = {
  vision: "VISION",
  works: "WORKS",
  service: "SERVICE",
  company: "COMPANY",
  contact: "CONTACT",
};

// フルページから辿るときの遷移先。事業内容は独立ページを持たず、
// TOPのパネルを開く（README §0）。
export const navHref: Record<NavKey, string> = {
  vision: "/about#vision",
  works: "/works",
  service: "/?panel=service",
  company: "/about",
  contact: "/contact",
};

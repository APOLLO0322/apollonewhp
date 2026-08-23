// 制作実績。microCMS（API ID: works）が設定されていればそこから、
// 未設定なら下の静的データ（現行サイトからの移植・仮素材）を返す。

export type WorkCategory = "MOVIE" | "SNS" | "BRANDING" | "PHOTO";

export const workCategories: WorkCategory[] = ["MOVIE", "SNS", "BRANDING", "PHOTO"];

export type Work = {
  slug: string;
  title: string;
  category: WorkCategory;
  year?: string;
  thumbnail: string;
  lead?: string;
  overview?: string;
  videoUrl?: string;
  stills?: string[];
  client?: string;
  scope?: string;
  featured?: boolean;
};

const IMG = "https://apollone.jp/wp-content/uploads";

// 画像・本文は現行サイトからの仮移植。microCMS 移行後はそちらが正。
const staticWorks: Work[] = [
  {
    slug: "katayama-kaikei",
    title: "税理士法人 片山会計｜SNS運用",
    category: "SNS",
    year: "2026",
    thumbnail: `${IMG}/2025/03/katayama.jpg`,
    client: "税理士法人 片山会計",
    scope: "アカウント設計 / コンテンツ制作 / 運用",
    featured: true,
  },
  {
    slug: "passion-leaders",
    title: "一般社団法人 パッションリーダーズ",
    category: "MOVIE",
    year: "2026",
    thumbnail: `${IMG}/2025/03/passsion.jpg`,
    lead: "「情熱でつながる」という理念を、人の表情と言葉から立ち上げるブランディングムービー。",
    overview:
      "「情熱でつながる経営者コミュニティ」というブランドの核を、参加者一人ひとりの表情と言葉から描き出しました。数字や実績を語る前に、まず「人」を映すこと。それが、共感の入り口になると考えたからです。\n\nヒアリングを重ね、登場する経営者の“素の瞬間”を丁寧に拾い上げ、静かな熱量の宿る一本に仕上げました。",
    client: "パッションリーダーズ",
    scope: "企画 / 撮影 / 編集",
    stills: [`${IMG}/2025/03/passsion.jpg`, `${IMG}/2025/03/mana.jpg`],
  },
  {
    slug: "mana-yamasaki",
    title: "フリーアナウンサー 山崎愛",
    category: "BRANDING",
    year: "2026",
    thumbnail: `${IMG}/2025/03/mana.jpg`,
  },
  {
    slug: "color-knot",
    title: "松山のリペア業者「COLOR KNOT」",
    category: "MOVIE",
    year: "2025",
    thumbnail: `${IMG}/2025/03/colornot.jpg`,
  },
  {
    slug: "matsuyama-symposium-40",
    title: "第40回 まつやま市民シンポジウム",
    category: "MOVIE",
    year: "2024",
    thumbnail: `${IMG}/2024/11/12.jpg`,
  },
  {
    slug: "inbound-summit-setouchi",
    title: "インバウンドサミットin瀬戸内",
    category: "MOVIE",
    year: "2024",
    thumbnail: `${IMG}/2024/11/10.jpg`,
  },
  {
    slug: "matsuyama-iju-tour",
    title: "まつやま移住体感ツアー",
    category: "MOVIE",
    year: "2024",
    thumbnail: `${IMG}/2024/11/9.jpg`,
  },
  {
    slug: "sol-et-luna",
    title: "イタリアンダイニングバー「SOL ET LUNA」",
    category: "PHOTO",
    year: "2024",
    thumbnail: `${IMG}/2024/09/6-740x520.jpg`,
  },
  {
    slug: "fc-manticore",
    title: "サッカーチーム「FCマンチコア」",
    category: "BRANDING",
    year: "2024",
    thumbnail: `${IMG}/2024/11/8.jpg`,
  },
  {
    slug: "furugino-festa",
    title: "ニューレトロ フルギノフェスタ × ノミノイチ",
    category: "MOVIE",
    year: "2024",
    thumbnail: `${IMG}/2024/11/11.jpg`,
  },
  {
    slug: "ehime-im-service",
    title: "エヒメアイムサービス｜SNS運用",
    category: "SNS",
    year: "2024",
    thumbnail: `${IMG}/2024/11/2-1-740x520.jpg`,
  },
  {
    slug: "iwayaji",
    title: "四国八十八ヶ所 第四十五番札所「岩屋寺」",
    category: "MOVIE",
    year: "2024",
    thumbnail: `${IMG}/2024/09/8efa322da0f5c24135b9bf522d34760f-1-740x520.jpg`,
  },
];

const SERVICE_DOMAIN = process.env.MICROCMS_SERVICE_DOMAIN;
const API_KEY = process.env.MICROCMS_API_KEY;

type MicroCmsImage = { url: string };
type MicroCmsWork = {
  slug: string;
  title: string;
  category: WorkCategory | WorkCategory[];
  year?: string;
  thumbnail: MicroCmsImage;
  lead?: string;
  overview?: string;
  videoUrl?: string;
  stills?: MicroCmsImage[];
  client?: string;
  scope?: string;
  featured?: boolean;
};

// microCMS 側の値は小文字（movie / sns …）で入っているため大文字に寄せる。
// 表示・絞り込みの両方がこの正規化に依存している。
function normalizeCategory(value: WorkCategory | WorkCategory[] | undefined): WorkCategory {
  const raw = Array.isArray(value) ? value[0] : value;
  const upper = String(raw ?? "").toUpperCase();
  return (workCategories as string[]).includes(upper) ? (upper as WorkCategory) : "MOVIE";
}

function normalize(item: MicroCmsWork): Work {
  return {
    slug: item.slug,
    title: item.title,
    category: normalizeCategory(item.category),
    year: item.year,
    thumbnail: item.thumbnail.url,
    lead: item.lead,
    overview: item.overview,
    videoUrl: item.videoUrl,
    stills: item.stills?.map((s) => s.url),
    client: item.client,
    scope: item.scope,
    featured: item.featured,
  };
}

// featured を先頭、以降 year 降順（README §5）
function sortWorks(list: Work[]): Work[] {
  return [...list].sort((a, b) => {
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
    return (b.year ?? "").localeCompare(a.year ?? "");
  });
}

export async function getWorks(): Promise<Work[]> {
  if (!SERVICE_DOMAIN || !API_KEY) return sortWorks(staticWorks);

  try {
    const res = await fetch(
      `https://${SERVICE_DOMAIN}.microcms.io/api/v1/works?limit=100`,
      { headers: { "X-MICROCMS-API-KEY": API_KEY }, next: { revalidate: 60 } },
    );
    if (!res.ok) throw new Error(`microCMS responded ${res.status}`);
    const data = (await res.json()) as { contents: MicroCmsWork[] };
    return sortWorks(data.contents.map(normalize));
  } catch (err) {
    console.error("[works] microCMS fetch failed, falling back to static data:", err);
    return sortWorks(staticWorks);
  }
}

export async function getWork(slug: string): Promise<Work | undefined> {
  const list = await getWorks();
  return list.find((w) => w.slug === slug);
}

export async function getWorkNeighbours(slug: string) {
  const list = await getWorks();
  const i = list.findIndex((w) => w.slug === slug);
  return { prev: i > 0 ? list[i - 1] : undefined, next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined };
}

// 年が未入力のレコードがあるため、区切りの中黒を出し分ける
export function workMeta(work: Work): string {
  return work.year ? `${work.category} · ${work.year}` : work.category;
}

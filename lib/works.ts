// 制作実績。microCMS（API ID: works）が設定されていればそこから、
// 未設定なら下の静的データ（現行サイトからの移植・仮素材）を返す。

/* カテゴリは「何を作ったか」＝成果物。目的はタグ側で持つ。

   EVENT は映像やSNSと違い、成果物がイベントそのもの。ただし
   「イベントを撮った映像」は MOVIE + タグ「イベント」であって別物なので、
   取り違えないよう表示名は EVENT PLANNING とする（CMSの値は event のまま）。 */
export type WorkCategory = "MOVIE" | "SNS" | "PHOTO" | "EVENT";

export const workCategories: WorkCategory[] = ["MOVIE", "SNS", "PHOTO", "EVENT"];

export const categoryLabel: Record<WorkCategory, string> = {
  MOVIE: "MOVIE",
  SNS: "SNS",
  PHOTO: "PHOTO",
  EVENT: "EVENT PLANNING",
};

export type Work = {
  slug: string;
  title: string;
  category: WorkCategory;
  year?: string;
  thumbnail: string;
  // lead は詳細ページの導入文とメタディスクリプション用
  lead?: string;
  // summary はカードに出る一行説明。未入力なら lead で代用する
  summary?: string;
  overview?: string;
  videoUrl?: string;
  stills?: string[];
  client?: string;
  // microCMS では複数選択なので配列で持つ
  scope?: string[];
  featured?: boolean;
  // 事業内容のメニューと同じ文字列。/works?tag=... の絞り込みに使う
  tags?: string[];
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
    scope: ["アカウント設計", "コンテンツ制作", "運用"],
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
    scope: ["企画", "撮影", "編集"],
    stills: [`${IMG}/2025/03/passsion.jpg`, `${IMG}/2025/03/mana.jpg`],
  },
  {
    slug: "mana-yamasaki",
    title: "フリーアナウンサー 山崎愛",
    category: "MOVIE",
    year: "2026",
    thumbnail: `${IMG}/2025/03/mana.jpg`,
    tags: ["ブランディング"],
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
    category: "MOVIE",
    year: "2024",
    thumbnail: `${IMG}/2024/11/8.jpg`,
    tags: ["ブランディング"],
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
  summary?: string;
  overview?: string;
  videoUrl?: string;
  stills?: MicroCmsImage[];
  client?: string;
  scope?: string | string[];
  featured?: boolean;
  tags?: string | string[];
};

// microCMS 側の値は小文字（movie / sns …）で入っているため大文字に寄せる。
// 表示・絞り込みの両方がこの正規化に依存している。
function normalizeCategory(value: WorkCategory | WorkCategory[] | undefined): WorkCategory {
  const raw = Array.isArray(value) ? value[0] : value;
  const upper = String(raw ?? "").toUpperCase();
  if ((workCategories as string[]).includes(upper)) return upper as WorkCategory;
  // 整理前の branding / promotion が残っていても落とさない。
  if (upper) console.warn(`[works] 未知のカテゴリ「${upper}」。MOVIE として扱う`);
  return "MOVIE";
}

/* microCMS の複数選択は配列で返るが、テキストで運用されている場合もある。
   どちらで来ても配列に揃える。空要素は落とす。 */
function toList(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined;
  const list = Array.isArray(value) ? value : value.split(/[/、,]/);
  const out = list.map((v) => v.trim()).filter(Boolean);
  return out.length > 0 ? out : undefined;
}

function normalize(item: MicroCmsWork): Work {
  return {
    slug: item.slug,
    title: item.title,
    category: normalizeCategory(item.category),
    year: item.year,
    thumbnail: item.thumbnail.url,
    lead: item.lead,
    summary: item.summary,
    overview: item.overview,
    videoUrl: item.videoUrl,
    stills: item.stills?.map((s) => s.url),
    client: item.client,
    scope: toList(item.scope),
    featured: item.featured,
    tags: toList(item.tags),
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

// 「MOVIE · プロモーション · 2024」の並び。
// 年やタグが未入力のレコードがあるため、無い要素は区切りごと落とす。
export function workMeta(work: Work, opts?: { withTag?: boolean }): string {
  const parts: string[] = [categoryLabel[work.category]];
  if (opts?.withTag && work.tags?.length) parts.push(work.tags[0]);
  if (work.year) parts.push(work.year);
  return parts.join(" · ");
}

// カードで見出しに使う名前。クライアント名があればそれを、無ければ実績名を。
export function workHeading(work: Work): string {
  return work.client?.trim() || work.title;
}

// カードの一行説明。専用の summary を優先し、無ければ詳細ページの lead を使う。
export function workSummary(work: Work): string | undefined {
  return work.summary?.trim() || work.lead?.trim() || undefined;
}

/* ホバー中だけ流す背景再生用の埋め込みURL。
   Vimeo は background=1 が用意されていてUIも出ない。
   YouTube は同等の指定を並べるが、タイトルとロゴが一瞬出る。
   Instagram には背景再生の手段がないので null を返す（静止画のまま）。 */
export function previewEmbedUrl(work: Work): string | null {
  const url = work.videoUrl?.trim();
  if (!url) return null;

  const vimeo = url.match(/vimeo\.com\/(\d+)(?:\/([0-9a-zA-Z]+))?/);
  if (vimeo) {
    const [, id, hash] = vimeo;
    const params = new URLSearchParams({
      background: "1",
      autoplay: "1",
      loop: "1",
      muted: "1",
      autopause: "0",
    });
    if (hash) params.set("h", hash);
    return `https://player.vimeo.com/video/${id}?${params}`;
  }

  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (yt) {
    const id = yt[1];
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      loop: "1",
      playlist: id,
      controls: "0",
      // modestbranding は 2023/8/15 に廃止済みで効かない。
      // rel=0 も 2018 以降「関連動画を同一チャンネルに限定」の意味しかない。
      // タイトルとチャンネル名の帯を消すパラメータは存在しない。
      rel: "0",
      playsinline: "1",
      disablekb: "1",
    });
    return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
  }

  return null;
}

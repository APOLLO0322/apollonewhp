// 掲載コンテンツの正典。design/Home.dc.html と handoff README §6 から転記。
// 文言の変更は代表確認が必要。実装都合で書き換えないこと。

export const company = {
  name: "株式会社APOLLO",
  nameEn: "APOLLO Inc.",
  concept: "まだ、誰も見ていない景色へ。",
  mail: "contact@apollone.jp",
  hours: "平日 10:00 – 19:00",
  privacyUrl: "https://apollone.jp/privacy-policy/",
} as const;

export type Row = { k: string; v: string };

export const companyRows: Row[] = [
  { k: "会社名", v: "株式会社APOLLO" },
  { k: "代表取締役", v: "池口祐太" },
  { k: "所在地", v: "愛媛県松山市鴨川1-6-15" },
  { k: "設立", v: "2023年3月22日" },
  { k: "事業内容", v: "映像制作 / 写真撮影 / 出張撮影サービス\nSNS運用支援 / イベント企画・運営" },
  { k: "個人情報保護方針", v: "apollone.jp/privacy-policy" },
];

export const profileBio =
  "1987年3月7日 徳島県海部郡宍喰町生まれ、愛媛県松山市育ち。\n15歳より独学でダンスをはじめ、LOCK・HOUSE・BREAKINGを習得。19歳で大阪ダンス＆アクターズ専門学校の一期生として入学、21歳で東京ディズニーリゾートのダンサーに合格。26歳でJAZZダンスに転向、以後数々の舞台・コンサートに出演し、振付師としても活躍。\n2023年、愛媛へUターンし株式会社APOLLOを創業。地域と地方の発信力強化を命題とし活動する傍ら地域振興の一環として、20代を中心としたダンスグループ「Growth」を主宰。次世代を担う若者とエンタメを通したまちづくりを行う。";

export const profileRows: Row[] = [
  {
    k: "舞台出演",
    v: "Club SLAZYシリーズ（Jasper役・Juke役）\nうたの☆プリンスさまっ♪ マジ LOVE LIVE 4th〜6th STAGE\n2.5次元ダンスライブ「ツキウタ。」ステージ\nあんさんぶるスターズ！Starry Stage 2nd 〜in 日本武道館〜\nGACKT『MOON SAGA -義経秘伝- 第二章』ほか多数",
  },
  {
    k: "メディア出演",
    v: "2017年 日本テレビ『ウチの夫は仕事ができない』第8話\n2018年 TBS『有田哲平の夢なら醒めないで』再現VTR",
  },
  {
    k: "振付",
    v: "2.5次元ダンスライブ「ALIVESTAGE」Episode 1〜7\n『声優紅白歌合戦2023』振付・ダンサー ほか",
  },
  {
    k: "主宰団体公演",
    v: "Dance Company HOME『HOME』（2019・2021）\nGrowth『Growth Dance Live vol.1』（2025）\nGrowth『Is. M』（2026）\n※企画・脚本・演出・振付・衣裳制作・照明プラン・舞台監督",
  },
];

// menuItems は制作実績のタグ名と完全に一致させること。
// この文字列で microCMS の works.tags を絞り込む。
export type Service = {
  num: string;
  name: string;
  // 各事業の一行キャッチ。名前と本文の間に置く
  tagline: string;
  desc: string;
  menuItems: string[];
};

// WEB制作は会社概要にのみ記載し、事業内容では紹介しない（README §6）。
export const services: Service[] = [
  {
    num: "01",
    name: "映像・写真制作",
    tagline: "想いを、カタチに。",
    desc: "ブランディング、プロモーション、採用。企画から撮影・編集まで一貫して手がけます。伝えたい人に、ちゃんと届く一本を。",
    menuItems: ["ブランディング", "プロモーション", "広告", "採用", "イベント", "ドキュメンタリー", "スチール"],
  },
  {
    num: "02",
    name: "SNS運用支援",
    tagline: "曇ったガラスを透明に。",
    desc: "共感が続くコンセプトを定め、作り手のエネルギーが絶えず溢れるブランドへ。日々の投稿から中長期の設計まで、社外広報として伴走。",
    menuItems: ["アカウント設計・戦略", "コンテンツ企画・制作"],
  },
  {
    num: "03",
    name: "イベント企画・運営",
    tagline: "人が集まり、愛される理由を知っている。",
    desc: "集客の施策づくりから、リアルイベントの企画・運営まで。都内学童施設の運営をサポートし、利用者数増加の実績。あなたの想いから、また来たくなる仕掛け作りを。",
    // タグは未設定。実績と紐づけるときに menuItems を足す
    menuItems: [],
  },
];

export const vision = {
  label: "VISION",
  title: "夢を創る。",
  body: "初めからゴールが見えているものは一つもありません。どれだけ目を凝らしたところで見ることもできません。\n\n株式会社APOLLOは、時代の変化と丁寧に向き合いながら、人と人が心で繋がる心地よさ、充足感を喜びの真ん中に置き、心を尽くす経営を通して地域課題の解決に取り組みます。",
};

export const repMessage =
  "人の温かさと豊かな自然に囲まれた愛媛を、そして四国を高度経済成長期のような活気ある町にしたい。\n\n自然を壊したいわけではなくきれいなものは出来るだけきれいなまま、地元企業様との連携で全世界の人々に魅力を発信していきたいと思っています。";

// 空行を段落の区切りとして扱う。原稿の改行は幅に依存するので流し込みに任せる。
export function paragraphs(text: string): string[] {
  return text.split(/\n{2,}/).map((block) => block.split("\n").join(""));
}

// TOPのヒーロー下部に流すクライアントロゴ。public/clients/ に置く。
// 映像の上なので brightness(0) invert(1) で白一色に潰している。単色の
// ロゴならそのまま入れてよい（多色・グラデーションは白抜き版が必要）。
// 実ロゴが揃うまでの仮置きが2種類まざっている。公開前に全部外すこと。
//   apollo-logo.png … 自社ロゴ。並びの見え方を確かめるためのサンプル
//   01〜08.svg      … 番号だけの枠
export type Client = { name: string; logo: string };

export const clients: Client[] = [
  { name: "愛媛県", logo: "/clients/ehime-pref.webp" },
  { name: "アイホーム", logo: "/clients/ihome.png" },
  { name: "月心グループ", logo: "/clients/gesshin.png" },
  { name: "クライアントロゴ（仮）", logo: "/clients/apollo-logo.png" },
  ...Array.from({ length: 8 }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return { name: `クライアントロゴ ${num}（仮）`, logo: `/clients/${num}.svg` };
  }),
];

export const contactCopy = {
  label: "CONTACT",
  // 見出しは置かない。CONTACT のラベルだけで用は足りる
  title: "",
  lead: "まだ形になっていなくても大丈夫です、お気軽にご相談ください。",
};

// 事業内容のメニュー＝制作実績のタグ。microCMS の works.tags の選択肢は
// この一覧とまったく同じ文字列にすること（表記が1文字でも違うと拾えない）。
export const serviceTags: string[] = services.flatMap((s) => s.menuItems);

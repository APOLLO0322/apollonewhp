// 掲載コンテンツの正典。design/Home.dc.html と handoff README §6 から転記。
// 文言の変更は代表確認が必要。実装都合で書き換えないこと。
//
// 用語ルール（改修指示書 v1.0 §1）
//   構想 … つくると決まる前。課題整理・発案・戦略設計
//   構成 … つくると決まった後。絵コンテ・演出・尺の設計
//   「企画」はサイト上で使わない。レイヤーが違う2つの意味を1語で
//   背負っていて、APOLLOの強みである「構想から関われること」が
//   制作工程の一部に見えてしまうため。
//   （イベントだけは慣用に合わせて「設計」を使う）

export const company = {
  name: "株式会社APOLLO",
  nameEn: "APOLLO Inc.",
  concept: "まだ、誰も見ていない景色へ。",
  mail: "info@apollone.jp",
  hours: "平日 10:00 – 19:00",
  // サイト内ページ。本ドメインを新サイトに向けると WordPress 側の
  // /privacy-policy/ は消えるため、こちらを正とする。
  privacyUrl: "/privacy",
} as const;

export type Row = { k: string; v: string };

export const companyRows: Row[] = [
  { k: "会社名", v: "株式会社APOLLO" },
  { k: "代表取締役", v: "池口祐太" },
  { k: "所在地", v: "愛媛県松山市鴨川1-6-15" },
  { k: "設立", v: "2023年3月22日" },
  { k: "事業内容", v: "映像制作 / 写真撮影 / 出張撮影サービス\nSNS運用支援 / イベント設計・運営" },
  { k: "個人情報保護方針", v: "apollone.jp/privacy" },
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

/* 事業内容のメニュー。押すと制作実績を絞り込む。

   実績の絞り込みは2軸で、役割が違う。
     category … 何を作ったか（MOVIE / SNS / PHOTO）
     tags     … 何のために作ったか（ブランディング / 採用 …）
   メニューはどちらにも紐づけられるようにしてある。
   tag の文字列は microCMS の works.tags の選択肢と完全一致させること。 */
export type ServiceLink = { label: string; tag?: string; category?: string };

export type Service = {
  name: string;
  // 各事業の一行キャッチ。名前と本文の間に置く
  tagline: string;
  desc: string;
  links: ServiceLink[];
};

/* APPROACH。2段構成（改修指示書 §2）。

   APOLLOの差別化は「映像がつくれること」ではなく、つくると決まる前の
   構想から関われること。これが3つのサービスと横並びになっていると
   「メニューの1つ」にしか見えない。段を分けて上下関係にする。

   段には連番を付け（考える→つくる、という順序が実際にあるため）、
   段02の中の3サービスには付けない（並列で順序がないため）。 */
export const approach = {
  label: "APPROACH",
  title: "私たちのしごと",

  think: {
    num: "01",
    name: "考える",
    lead: "正解がないところから、始める。",
    /* 問いは畳まず1行ずつ立てる。並んだ問いそのものが「一緒に考える」の
       図になる。説明の文章を増やすより、問いの形のまま見せたほうが早い。 */
    questions: ["何を伝えるのか。", "誰に届けるのか。", "何から決めるのか。"],
    body: "決まっていないほど、話す価値があります。\n一緒に悩んで、判断の基準からつくります。",
  },

  make: {
    num: "02",
    name: "つくる・届ける",
  },
} as const;

// WEB制作は会社概要にのみ記載し、事業内容では紹介しない（README §6）。
export const services: Service[] = [
  {
    name: "映像・写真制作",
    tagline: "想いを、カタチに。",
    desc: "ブランディング、プロモーション、採用。構成から撮影・編集まで一貫して手がけます。伝わる一本を伝えたい人に届けます。",
    links: [
      { label: "ブランディング", tag: "ブランディング" },
      { label: "プロモーション", tag: "プロモーション" },
      { label: "採用", tag: "採用" },
      { label: "広告", tag: "広告" },
      { label: "イベント", tag: "イベント" },
      { label: "ドキュメンタリー", tag: "ドキュメンタリー" },
      { label: "写真", category: "PHOTO" },
    ],
  },
  {
    name: "社外広報",
    tagline: "曇ったガラスを透明に。",
    desc: "ありのままの姿が、共感が続くはじめの一歩。一番身近な第三者として、伴走を見据えた設計をご提案します。",
    links: [{ label: "実績", category: "SNS" }],
  },
  {
    name: "イベント設計・運営",
    tagline: "人が集まり、愛される理由を知っている。",
    // 上の2つが「伝える」仕事なのに対し、こちらは「集める」仕事。
    // 文脈が違うことが読んで分かるよう、対比から入る（代表確認中）。
    desc: "伝える仕事ではなく、集める仕事。設計から当日の運営まで、人が動く理由をつくります。都内の学童施設では運営をサポートし、利用者数の増加につなげました。",
    links: [{ label: "実績", category: "EVENT" }],
  },
];

// 一覧のタグ絞り込みに出す順番。microCMS の works.tags の選択肢と揃える。
export const serviceTags: string[] = [
  "ブランディング",
  "プロモーション",
  "採用",
  "広告",
  "イベント",
  "ドキュメンタリー",
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

/* TOPのヒーロー下部に流すクライアントロゴ。public/clients/ に置く。

   色も比率も改変しない（各社の利用規定に触れるため）。白抜きにもしない。
   w / h は元画像の実寸。next/image はこの値で縦横比を決めるので、
   実寸とずれているとロゴが横に潰れる。追加するときは必ず実寸を書く。

   高さを揃えて並べるが、横長すぎるロゴだけは幅で頭打ちにする
   （max-w。揃えるのが高さだけだと、細長いロゴが帯を占領する）。 */
export type Client = { name: string; logo: string; w: number; h: number };

export const clients: Client[] = [
  { name: "愛媛県", logo: "/clients/ehime-pref.webp", w: 500, h: 500 },
  { name: "ギノー味噌株式会社", logo: "/clients/ginomiso.svg", w: 154, h: 135 },
  { name: "株式会社アイホーム", logo: "/clients/ihome.png", w: 1495, h: 496 },
  { name: "月心グループ", logo: "/clients/gesshin.png", w: 894, h: 424 },
  { name: "株式会社愛新鉄工所", logo: "/clients/aishin.svg", w: 160, h: 111 },
  { name: "税理士法人 片山会計", logo: "/clients/katayama-kaikei.png", w: 1095, h: 228 },
  { name: "フジトラベルサービス", logo: "/clients/fujitravelservice.png", w: 208, h: 26 },
  { name: "株式会社AIC", logo: "/clients/aiclogo.svg", w: 1600, h: 242 },
  { name: "株式会社SPC", logo: "/clients/spc_logo.svg", w: 200, h: 37 },
  { name: "koe+", logo: "/clients/koe.png", w: 567, h: 395 },
];
export const contactCopy = {
  label: "CONTACT",
  // 見出しもリード文も置かない。CONTACT のラベルだけで用は足りる
  title: "",
};


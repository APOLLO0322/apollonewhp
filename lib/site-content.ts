// 掲載コンテンツの正典。design/Home.dc.html と handoff README §6 から転記。
// 文言の変更は代表確認が必要。実装都合で書き換えないこと。

export const company = {
  name: "株式会社APOLLO",
  nameEn: "APOLLO Inc.",
  tagline: "写真動画で、地域を元気に。",
  concept: "まだ、誰も見ていない景色へ。",
  location: "松山, 愛媛",
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
  { k: "事業内容", v: "映像制作 / 写真撮影 / 出張撮影サービス\nSNS運用支援 / WEB制作" },
  { k: "個人情報保護方針", v: "apollone.jp/privacy-policy" },
];

export const profileRows: Row[] = [
  {
    k: "経歴",
    v: "1987年3月7日 愛媛県松山市生まれ。\n15歳より独学でダンスをはじめ、LOCK・HOUSE・BREAKINGを習得。\n19歳で大阪ダンス＆アクターズ専門学校の一期生として入学、\n21歳で東京ディズニーリゾートのダンサーに合格。\n26歳でJAZZダンスに転向、以後数々の舞台・コンサートに出演し、\n振付師としても活躍。",
  },
  {
    k: "舞台出演",
    v: "Club SLAZYシリーズ（Jasper役・Juke役）\nうたの☆プリンスさまっ♪ マジLOVELIVE 4th〜6th STAGE\nツキステ。シリーズ、あんさんぶるスターズ！Starry Stage 2nd\nGACKT『MOON SAGA -義経秘伝-』ほか多数",
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

export type Service = { num: string; name: string; desc: string; menuItems: string[] };

// WEB制作は会社概要にのみ記載し、事業内容では紹介しない（README §6）。
export const services: Service[] = [
  {
    num: "01",
    name: "映像・写真制作",
    desc: "PR・採用・ドキュメンタリー。企画から撮影・編集まで一貫して手がけます。伝えたい人に、ちゃんと届く一本を。",
    menuItems: ["ブランディングムービー", "採用・リクルート動画", "ドキュメンタリー", "写真撮影・スチール"],
  },
  {
    num: "02",
    name: "SNS運用支援",
    desc: "共感が続くコンセプトを定め、作り手のエネルギーが絶えず溢れるブランドへ。日々の投稿から中長期の設計まで、伴走して育てます。",
    menuItems: ["アカウント設計・戦略", "コンテンツ企画・制作", "運用代行・分析"],
  },
];

export const flow = ["ヒアリング・課題整理", "企画・構成", "撮影・制作", "納品・運用サポート"];

export const vision = {
  label: "VISION",
  title: "夢を創る。",
  body: "初めからゴールが見えているものは一つもありません。\nどれだけ目を凝らしたところで見ることもできません。\nだから、一歩ずつ。\n\n株式会社APOLLOは、時代の変化と丁寧に向き合いながら、\n人と人が心で繋がる心地よさ、充足感を喜びの真ん中に置き、\n心を尽くす経営を通して地域課題の解決に取り組みます。",
};

export const repMessage =
  "人の温かさと豊かな自然に囲まれた愛媛を、そして四国を\n高度経済成長期のような活気ある町にしたい。\n\nただ私は、四国の自然を壊したいわけではありません。\nきれいなものは出来るだけきれいなまま、\n地元企業様との連携で全世界の人々に魅力を発信していきたいと思っています。";

// /about の代表メッセージ（About.dc.html より）
export const aboutMessage = {
  heading: "人の温かさと豊かな自然に囲まれた愛媛を、\nそして四国を、活気ある町にしたい。",
  body: "ただ私は、四国の自然を壊したいわけではありません。きれいなものは出来るだけきれいなまま、地元企業様との連携で全世界の人々に魅力を発信していきたいと思っています。\n\n私たちは、実績や数字よりも先に「人」を映したいと考えています。かたちのない想いや情熱を、丁寧に汲み取り、写真と動画というかたちにしていく。その一本を見た誰かが「なんかいいな」と感じてくれたら——それこそが、私たちのつくりたい価値です。",
};

// 実ロゴは未支給。public/clients/ の SAMPLE 入りSVGを仮置きしている（README §7-4）。
// 支給されたら同じファイル名で差し替えるだけでよい。SVG推奨、なければPNG（透過・高さ76px相当）。
export type Client = { name: string; logo: string };

export const clients: Client[] = [
  { name: "税理士法人 片山会計", logo: "/clients/katayama-kaikei.svg" },
  { name: "Passion Leaders", logo: "/clients/passion-leaders.svg" },
  { name: "岩屋寺", logo: "/clients/iwayaji.svg" },
  { name: "FC MANTICORE", logo: "/clients/fc-manticore.svg" },
  { name: "NINE STORIES", logo: "/clients/nine-stories.svg" },
  { name: "エヒメアイムサービス", logo: "/clients/ehime-im-service.svg" },
  { name: "SOL ET LUNA", logo: "/clients/sol-et-luna.svg" },
];

export const contactCopy = {
  label: "CONTACT",
  title: "まだ見ぬ景色の話を、\n聞かせてください。",
  lead: "採用のこと、集客のこと、まだ形になっていない相談でも。",
};

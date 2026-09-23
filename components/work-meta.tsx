import { categoryLabel, type Work, type WorkCategory } from "@/lib/works";

/* 実績カードの種別とタグ。

   文字だけで「MOVIE · ブランディング」と置くと説明文と地続きに見えて
   読み飛ばされる。記号を添えて、読む文章ではなく分類の札として
   一目で分かるようにする。

   アイコンは線画のみ・1em・currentColor。塗りを持たせると明朝の
   見出しに対して重くなるので、線幅は 1.3 で統一している。 */

const ICON_PROPS = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

const categoryIcon: Record<WorkCategory, React.ReactNode> = {
  // 再生ボタン
  MOVIE: (
    <>
      <circle cx="8" cy="8" r="5.9" />
      <path d="M6.7 5.5 10.6 8l-3.9 2.5z" />
    </>
  ),
  // 吹き出し
  SNS: (
    <path d="M13.6 8.1c0 2.7-2.5 4.9-5.6 4.9-.7 0-1.3-.1-1.9-.3l-3.7 1 1.1-2.6C2.8 10.3 2.4 9.3 2.4 8.1c0-2.7 2.5-4.9 5.6-4.9s5.6 2.2 5.6 4.9Z" />
  ),
  // カメラ
  PHOTO: (
    <>
      <rect x="1.9" y="4.7" width="12.2" height="8.4" rx="1.5" />
      <path d="M5.6 4.7 6.5 2.9h3l.9 1.8" />
      <circle cx="8" cy="9" r="2.4" />
    </>
  ),
  // 旗
  EVENT: (
    <>
      <path d="M4 13.6V2.6" />
      <path d="M4 3.3h7.6L10 5.7l1.6 2.4H4" />
    </>
  ),
};

// タグ札
const tagIcon = (
  <>
    <path d="M2.5 7.8 7.8 2.5h5.7v5.7L8.2 13.5z" />
    <circle cx="10.6" cy="5.4" r="0.95" />
  </>
);

/* 札の塗り。枠線だけだと背景に溶けて、文字に線が付いただけに見える。
   かといって塗り潰すとカードの中で一番強い要素になってしまうので、
   下地が透ける程度に留める。パネルでは背後が映像なので、
   霧色ではなく淡霧を敷いて文字の下を明るくする。 */
const chipTone = {
  page: {
    category: "border-fog bg-mist/12 text-mist",
    tag: "border-logo-blue/30 bg-logo-blue/12 text-logo-blue",
  },
  panel: {
    category: "border-mist-panel/25 bg-pale/55 text-mist-panel",
    tag: "border-logo-blue/30 bg-pale/55 text-logo-blue",
  },
} as const;

function Chip({
  icon,
  children,
  className,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 leading-none shadow-[0_1px_2px_rgba(22,25,26,0.07)] ${className}`}
    >
      <svg {...ICON_PROPS} className="size-3 shrink-0">
        {icon}
      </svg>
      {children}
    </span>
  );
}

/* tone は文字色の切り替え。半透明パネルの上では通常の霞だと
   コントラストが足りないため、パネル用の濃い色に差し替える。 */
export default function WorkMeta({
  work,
  size = "sm",
  tone = "page",
  withTag = true,
}: {
  work: Work;
  size?: "md" | "sm";
  tone?: "page" | "panel";
  withTag?: boolean;
}) {
  const tag = withTag ? work.tags?.[0] : undefined;

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 font-label tracking-[0.1em] ${
        tone === "panel" ? "text-mist-panel" : "text-mist"
      } ${size === "md" ? "text-[11px]" : "text-[10px]"}`}
    >
      <Chip icon={categoryIcon[work.category]} className={chipTone[tone].category}>
        {categoryLabel[work.category]}
      </Chip>
      {tag && (
        <Chip icon={tagIcon} className={chipTone[tone].tag}>
          {tag}
        </Chip>
      )}
    </div>
  );
}

import Link from "next/link";
import WorkMeta from "@/components/work-meta";
import WorkThumb from "@/components/work-thumb";
import { workHeading, workSummary, type Work } from "@/lib/works";

/* 実績カード。

   並びは 説明 → 社名 → サムネイル → 札。

   説明が未入力のレコードでは社名が主役に繰り上がる。
   社名も未入力なら実績名を使う（workHeading）。

   tone は文字色の切り替え。半透明パネルの上では通常の霞だと
   コントラストが足りないため、パネル用の濃い色に差し替える。 */
export default function WorkCard({
  work,
  size,
  tone = "page",
  sizes,
}: {
  work: Work;
  size: "md" | "sm";
  tone?: "page" | "panel";
  sizes: string;
}) {
  const quiet = tone === "panel" ? "text-mist-panel" : "text-mist";
  const summary = workSummary(work);
  const client = workHeading(work);

  const lead = summary ?? client;
  const byline = summary ? client : undefined;

  return (
    <Link href={`/works/${work.slug}`} className="group ap-media block">
      {/* 文字の塊は「説明2行＋社名1行」ぶんの高さで固定する。
          説明が1行で済む案件でも高さが変わらないので、横に並べた
          サムネイルの頭が揃う。

          余りは justify-end で上に逃がす。文字はいつでも自分の画像の
          真上にいて、空いたぶんはカード間の余白に紛れる。
          下に逃がすと文字と画像が離れ、どちらの画像の話か読めなくなる。

          説明は line-clamp-2、社名は line-clamp-1 で打ち切っているので、
          この高さが必ず最大になる。 */}
      <div
        className={`flex flex-col justify-end ${
          size === "md" ? "min-h-[80px]" : "min-h-[70px]"
        }`}
      >
        <p
          className={`line-clamp-2 text-ink transition-colors duration-300 group-hover:text-logo-blue ${
            size === "md" ? "text-base leading-[1.7]" : "text-sm leading-[1.7]"
          }`}
        >
          {lead}
        </p>

        {byline && (
          <p className={`mt-1.5 line-clamp-1 text-xs ${quiet}`}>{byline}</p>
        )}
      </div>

      <div className={size === "md" ? "mt-4" : "mt-3.5"}>
        <WorkThumb work={work} aspect="video" sizes={sizes} />
      </div>

      {/* 札は画像の下。次のカードとの間は 80px あるので、
          この札が上の画像のものであることは間隔で分かる。 */}
      <div className={size === "md" ? "mt-3.5" : "mt-3"}>
        <WorkMeta work={work} size={size} tone={tone} />
      </div>
    </Link>
  );
}

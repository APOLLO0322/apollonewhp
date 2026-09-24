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
      {/* 文字の塊は「説明2行＋社名1行」で高さを決め打ちする。

          説明そのものにも2行ぶんの高さを持たせているので、1行で済む
          案件でも書き出しの位置は変わらない。行数によって頭が上下に
          動くと、横に並べたときに視線の高さが揃わない。

          説明は line-clamp-2、社名は line-clamp-1 で打ち切っているので、
          この高さが必ず最大になる。余りが出るのは社名が未入力の
          レコードだけで、そのぶんは社名の行として下に残る。 */}
      <div className={size === "md" ? "min-h-[81px]" : "min-h-[70px]"}>
        <p
          className={`line-clamp-2 text-ink transition-colors duration-300 group-hover:text-logo-blue ${
            size === "md"
              ? "min-h-[55px] text-base leading-[1.7]"
              : "min-h-[48px] text-sm leading-[1.7]"
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

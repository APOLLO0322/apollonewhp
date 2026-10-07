import Link from "next/link";
import WorkMeta from "@/components/work-meta";
import WorkPhaseScale from "@/components/work-phase";
import WorkThumb from "@/components/work-thumb";
import { workHeading, workSummary, type Work } from "@/lib/works";

/* 実績カード。

   並びは 説明 → 社名 → サムネイル → 関与範囲 → 札。

   関与範囲を札より先に置く。札（MOVIE / ブランディング）は塗りと影が
   あって目立つが、伝えているのは他社と差がつかない情報。
   「どこから関わったか」のほうが先に目に入るようにする。

   パネルでは社名を出さない。覗き見せなので、まず何の仕事かだけ
   分かればよく、誰の仕事かはフルページで読ませる。

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
  const byline = tone === "panel" ? undefined : summary ? client : undefined;

  /* 文字の塊は最大の組み合わせぶんの高さで固定する。説明そのものにも
     2行ぶんを持たせているので、1行で済む案件でも書き出しの位置は
     変わらない。行数で頭が上下すると、横に並べたとき視線の高さが揃わない。

     説明は line-clamp-2、社名は line-clamp-1 で打ち切っているので、
     この高さが必ず最大になる。社名を出さないパネルはそのぶん低い。 */
  const textBlock =
    tone === "panel"
      ? size === "md"
        ? "min-h-[55px]"
        : "min-h-[48px]"
      : size === "md"
        ? "min-h-[81px]"
        : "min-h-[70px]";

  return (
    <Link href={`/works/${work.slug}`} className="group ap-media block">
      <div className={textBlock}>
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

      <div className="mt-3.5">
        <WorkPhaseScale work={work} tone={tone} />
      </div>

      <div className="mt-3">
        <WorkMeta work={work} size={size} tone={tone} />
      </div>
    </Link>
  );
}

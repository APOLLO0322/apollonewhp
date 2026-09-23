import Link from "next/link";
import WorkMeta from "@/components/work-meta";
import WorkThumb from "@/components/work-thumb";
import { workHeading, workSummary, type Work } from "@/lib/works";

/* 実績カード。

   並びは、探している人が知りたい順。
     1. 種別とタグ … 何を・何のために作ったか。サムネイルの上に置く
     2. サムネイル … 実物
     3. 説明       … どんな仕事か。ここが一番クリックの動機になるので主役
     4. 社名       … 誰の仕事か。信頼の裏付けとして添える

   札を画像の上に出すのは、グリッドを縦に見ていくときに
   「映像／SNS／写真」の当たりが画像より先に付くようにするため。

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
      <div className={size === "md" ? "mb-3.5" : "mb-3"}>
        <WorkMeta work={work} size={size} tone={tone} />
      </div>

      <WorkThumb work={work} aspect="video" sizes={sizes} />

      <p
        className={`line-clamp-2 text-ink transition-colors duration-300 group-hover:text-logo-blue ${
          size === "md" ? "mt-4 text-base leading-[1.7]" : "mt-3.5 text-sm leading-[1.7]"
        }`}
      >
        {lead}
      </p>

      {byline && (
        <p className={`mt-1.5 line-clamp-1 text-xs ${quiet}`}>{byline}</p>
      )}
    </Link>
  );
}

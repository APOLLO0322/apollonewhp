import Link from "next/link";
import WorkMeta from "@/components/work-meta";
import WorkThumb from "@/components/work-thumb";
import { workHeading, workSummary, type Work } from "@/lib/works";

/* 実績カード。

   並びは、探している人が知りたい順。
     1. 種別とタグ … 何を・何のために作ったか
     2. 説明       … どんな仕事か。ここが一番クリックの動機になるので主役
     3. 社名       … 誰の仕事か。信頼の裏付けとして添える
     4. サムネイル … 実物

   文字を先に、画像を後に置く。グリッドを縦に見ていくとき、
   写真の印象より先に「何の仕事か」が読めるようにするため。

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
      <WorkMeta work={work} size={size} tone={tone} />

      {/* 説明は2行、社名は1行で打ち切る。行数は案件によって変わるが、
          ここの高さを行数なりにすると画像の頭が1枚ずつずれて、
          横に並べたときに列が崩れる。最大の組み合わせ（2行＋社名）ぶんを
          確保して、サムネイルの開始位置を揃える。

          md は FEATURED の1枚だけで隣に並ぶものが無い。揃える相手が
          いないので、確保すると空白が出るだけ。 */}
      <div className={size === "md" ? "mt-3.5" : "mt-3 min-h-[70px]"}>
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

      <WorkThumb work={work} aspect="video" sizes={sizes} />
    </Link>
  );
}

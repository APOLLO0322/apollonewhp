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
      {/* 札から社名までを1つの塊として高さを決め打ちする。

          説明は2行、社名は1行で打ち切るが、案件によって行数は変わる。
          なりゆきにすると画像の頭が1枚ずつずれて、横に並べたときに
          列が崩れる。最大の組み合わせぶんを確保して余りは下に逃がし、
          サムネイルの開始位置を揃える。

          パネルは1列 193px しかなく、札が2つある案件だけ札が2段に
          折り返す。そのぶん高く取る。
          md は FEATURED の1枚だけで、隣に並ぶものが無いので確保しない。 */}
      <div
        className={
          size === "md"
            ? undefined
            : tone === "panel"
              ? "min-h-[140px]"
              : "min-h-[108px]"
        }
      >
        <WorkMeta work={work} size={size} tone={tone} />

        <p
          className={`line-clamp-2 text-ink transition-colors duration-300 group-hover:text-logo-blue ${
            size === "md"
              ? "mt-3.5 text-base leading-[1.7]"
              : "mt-3 text-sm leading-[1.7]"
          }`}
        >
          {lead}
        </p>

        {byline && (
          <p className={`mt-1.5 line-clamp-1 text-xs ${quiet}`}>{byline}</p>
        )}
      </div>

      {/* 社名とサムネイルの間。ここを詰めると文字が画像の
          キャプションのように見えてしまうので、札〜説明の間より
          はっきり広く取る。 */}
      <div className={size === "md" ? "mt-6" : "mt-5"}>
        <WorkThumb work={work} aspect="video" sizes={sizes} />
      </div>
    </Link>
  );
}

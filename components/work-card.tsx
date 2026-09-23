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
      {/* 札の段数ぶんの高さ。パネルは1列 193px しかなく、札が2つある
          案件だけ2段に折り返すので、そのぶん先に取っておく。 */}
      <div
        className={
          size === "md"
            ? undefined
            : tone === "panel"
              ? "min-h-[58px]"
              : "min-h-[26px]"
        }
      >
        <WorkMeta work={work} size={size} tone={tone} />
      </div>

      {/* 説明と社名。2行＋社名ぶんの高さを取って、余りは下ではなく
          上に逃がす（justify-end）。

          下に逃がすと、説明が1行の案件だけ文字とサムネイルが離れ、
          その文字が上下どちらの画像のものか分からなくなる。
          文字は必ず自分の画像の直上に置く。 */}
      <div
        className={`flex flex-col justify-end ${
          size === "md" ? "mt-3.5" : "mt-3 min-h-[70px]"
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

      {/* 文字とサムネイルの間。カード間（64px）よりずっと詰めることで、
          この文字がどの画像のものかを間隔だけで示す。 */}
      <div className={size === "md" ? "mt-4" : "mt-3.5"}>
        <WorkThumb work={work} aspect="video" sizes={sizes} />
      </div>
    </Link>
  );
}

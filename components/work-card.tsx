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
      {/* 高さを揃えるための下駄は履かせない。

          以前はサムネイルの頭を列で揃えるため、塊に最小の高さを
          持たせていた。案件ごとに文章量が違うので、その余りがどこかに
          空白として出る。上に逃がせば浮き、下に逃がせば文章が画像から
          離れる。どちらも「どの画像の話なのか」が読めなくなる。

          揃えるのはやめて詰めて積む。カード同士は 80px 空けてあるので、
          間隔の差だけで1枚の塊が分かる。 */}
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

import { workHeading, workMeta, workSummary, type Work } from "@/lib/works";

/* 実績カードのサムネイル下。

   探している人が知りたい順に並べる。
     1. メタ  … 何を・何のために・いつ（種別 / タグ / 年）
     2. 説明  … どんな仕事か。ここが一番クリックの動機になるので主役
     3. 社名  … 誰の仕事か。信頼の裏付けとして添える

   説明が未入力のレコードでは社名が主役に繰り上がる。
   社名も未入力なら実績名を使う（workHeading）。

   tone は文字色の切り替え。半透明パネルの上では通常の霞だとコントラストが
   足りないため、パネル用の濃い色に差し替える（globals.css 参照）。 */
export default function WorkCardBody({
  work,
  size,
  tone = "page",
}: {
  work: Work;
  size: "md" | "sm";
  tone?: "page" | "panel";
}) {
  const quiet = tone === "panel" ? "text-mist-panel" : "text-mist";
  const summary = workSummary(work);
  const client = workHeading(work);

  const lead = summary ?? client;
  const byline = summary ? client : undefined;

  return (
    <>
      <div
        className={`font-label tracking-[0.1em] ${quiet} ${
          size === "md" ? "mt-4 text-[11px]" : "mt-3.5 text-[10px]"
        }`}
      >
        {workMeta(work, { withTag: true })}
      </div>

      <p
        className={`mt-2 line-clamp-2 text-ink transition-colors duration-300 group-hover:text-logo-blue ${
          size === "md" ? "text-base leading-[1.7]" : "text-sm leading-[1.7]"
        }`}
      >
        {lead}
      </p>

      {byline && (
        <p className={`mt-1.5 line-clamp-1 text-xs ${quiet}`}>{byline}</p>
      )}
    </>
  );
}

import { workHeading, workMeta, workSummary, type Work } from "@/lib/works";

/* 実績カードのサムネイル下。上から メタ（種別・目的・年）/ クライアント / 一行説明。
   クライアントと説明は未入力のレコードがあるので、無ければ行ごと出さない。

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

  return (
    <>
      <div
        className={`font-label tracking-[0.1em] ${quiet} ${
          size === "md" ? "mt-4 text-[11px]" : "mt-3 text-[10px]"
        }`}
      >
        {workMeta(work, { withTag: true })}
      </div>
      <div
        className={`mt-1.5 leading-[1.6] text-ink ${size === "md" ? "text-base" : "text-sm"}`}
      >
        {workHeading(work)}
      </div>
      {workSummary(work) && (
        <p
          className={`mt-1.5 line-clamp-2 leading-[1.8] ${quiet} ${
            size === "md" ? "text-[13px]" : "text-xs"
          }`}
        >
          {workSummary(work)}
        </p>
      )}
    </>
  );
}

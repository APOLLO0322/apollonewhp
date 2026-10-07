import { workPhases, type Work } from "@/lib/works";

/* 関与範囲のインジケータ（改修指示書 §3.2）。

   構想 — 制作 — 運用
    ●      ●      ○

   該当する工程にだけ印を付けるのではなく、全案件に同じ3段階を出す。
   印のある案件にだけバッジを足す方式だと、印のない案件が「何かが
   欠けている」ように見える。そのクライアントが自社の掲載を見たときに
   不利益を感じるし、実際には欠けているわけでもない。
   同じ目盛りを全部に出せば、差は「格」ではなく「関わった範囲」として読める。

   色はロゴのグラデーションを使わない。グラデーションはロゴとTOPの
   1箇所だけに限っているので、ここで使うと希少性が落ちる。 */
export default function WorkPhaseScale({
  work,
  tone = "page",
}: {
  work: Work;
  tone?: "page" | "panel";
}) {
  /* 未入力のレコードでは何も見せない。空の目盛りだけが並ぶと、
     その案件では何もしていないように見えてしまう。

     ただし要素ごと消すと、未入力のカードだけ下の札がせり上がって
     列が崩れる。同じ組みを描いたまま visibility で隠し、高さは残す。
     全件に入力され次第、自然に現れる。 */
  const filled = (work.phase?.length ?? 0) > 0;

  const on = tone === "panel" ? "text-blue-panel" : "text-blue";
  const off = tone === "panel" ? "text-mist-panel" : "text-mist";

  return (
    <div
      className={`flex items-start gap-0 font-label text-[12px] tracking-[0.06em] ${
        filled ? "" : "invisible"
      }`}
      // 読み上げでは「構想 — 制作 — 運用」の羅列ではなく、
      // 該当するものだけを文として渡す
      {...(filled
        ? { role: "group", "aria-label": `関与範囲: ${work.phase!.join("・")}` }
        : { "aria-hidden": true })}
    >
      {workPhases.map((p, i) => {
        const active = work.phase?.includes(p);
        return (
          <div key={p} className="flex items-start" aria-hidden>
            {i > 0 && (
              /* 連結線はドットの高さに合わせる。ラベル1行ぶん下げた位置 */
              <span className="mt-[21px] block h-px w-3.5 shrink-0 bg-fog" />
            )}
            <div className="flex flex-col items-center gap-[6px]">
              <span className={active ? on : off}>{p}</span>
              <span
                className={`block size-[5px] rounded-full ${
                  active
                    ? tone === "panel"
                      ? "bg-blue-panel"
                      : "bg-blue"
                    : "border border-fog"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

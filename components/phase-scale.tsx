import { workPhases, type WorkPhase } from "@/lib/works";

/* 関与範囲の目盛り。

   構想 — 制作 — 運用
    ●      ○      ○

   実績カードと APPROACH の段01で同じものを使う。同じ印が同じ意味で
   2か所に出ることで、「構想から入れる」という主張（APPROACH）と、
   実際にどこから入ったか（実績）が、読み手の中で結びつく。
   説明の文章を足すより、同じ図が繰り返されるほうが早い。

   色はロゴのグラデーションを使わない。グラデーションはロゴとTOPの
   1箇所に限っているので、ここで使うと希少性が落ちる。

   size="lg" は APPROACH 用。文字と点を大きくし、線を長く取って
   「左端から入る」ことが図として読めるようにする。 */
export default function PhaseScale({
  active,
  size = "sm",
  tone = "page",
  hidden = false,
}: {
  active: readonly WorkPhase[];
  size?: "sm" | "lg";
  tone?: "page" | "panel";
  /* 高さだけ残して隠す。実績カードで未入力のレコードの要素ごと消すと、
     そのカードだけ下の札がせり上がって列が崩れるため。 */
  hidden?: boolean;
}) {
  const on = tone === "panel" ? "text-blue-panel" : "text-blue";
  const off = tone === "panel" ? "text-mist-panel" : "text-mist";
  const fill = tone === "panel" ? "bg-blue-panel" : "bg-blue";

  const lg = size === "lg";

  return (
    <div
      className={`flex items-start gap-0 font-label tracking-[0.06em] ${
        lg ? "text-[14px]" : "text-[12px]"
      } ${hidden ? "invisible" : ""}`}
      {...(hidden
        ? { "aria-hidden": true }
        : { role: "group", "aria-label": `関与範囲: ${active.join("・")}` })}
    >
      {workPhases.map((p, i) => {
        const isOn = active.includes(p);
        return (
          <div key={p} className="flex items-start" aria-hidden>
            {i > 0 && (
              /* 連結線はドットの高さに合わせる。ラベル1行ぶん下げた位置 */
              <span
                className={`block h-px shrink-0 bg-fog ${
                  lg ? "mt-[27px] w-12" : "mt-[21px] w-3.5"
                }`}
              />
            )}
            <div
              className={`flex flex-col items-center ${lg ? "gap-2.5" : "gap-[6px]"}`}
            >
              <span className={isOn ? on : off}>{p}</span>
              <span
                className={`block rounded-full ${lg ? "size-2" : "size-[5px]"} ${
                  isOn ? fill : "border border-fog"
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

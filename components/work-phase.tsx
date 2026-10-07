import PhaseScale from "@/components/phase-scale";
import type { Work } from "@/lib/works";

/* 実績カード用。目盛りそのものは PhaseScale（APPROACH と共用）。

   未入力のレコードでは何も見せない。空の目盛りだけが並ぶと、その案件では
   何もしていないように見えてしまう。ただし要素ごと消すと、未入力の
   カードだけ下の札がせり上がって列が崩れるので、高さは残す。 */
export default function WorkPhaseScale({
  work,
  tone = "page",
}: {
  work: Work;
  tone?: "page" | "panel";
}) {
  const active = work.phase ?? [];
  return <PhaseScale active={active} tone={tone} hidden={active.length === 0} />;
}

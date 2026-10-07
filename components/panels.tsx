import Link from "next/link";
import {
  approach,
  companyRows,
  paragraphs,
  profileBio,
  profileRows,
  repMessage,
  services,
  vision,
} from "@/lib/site-content";
import ConsultLink from "@/components/consult-link";
import PhaseScale from "@/components/phase-scale";
import WorkCard from "@/components/work-card";
import type { Work } from "@/lib/works";

/* 罫線1本 + ラベル/1fr の定義リスト。カード・角丸・影は使わない。
   パネルは画面幅の4割なので、ラベル列は詰めて本文の折り返しを避ける。 */
function TableRows({
  rows,
  size,
}: {
  rows: { k: string; v: string }[];
  size: "md" | "sm";
}) {
  return (
    <dl className="flex max-w-[560px] flex-col">
      {rows.map((row) => (
        <div
          key={row.k}
          className="grid grid-cols-[84px_1fr] items-baseline gap-4 border-t border-fog py-5 sm:grid-cols-[104px_1fr] sm:gap-5"
        >
          <dt className="text-xs leading-[1.9] tracking-[0.08em] text-mist-panel">
            {row.k}
          </dt>
          <dd
            className={`m-0 whitespace-pre-line text-ink ${
              size === "md"
                ? "text-[15px] leading-[1.9]"
                : "text-sm leading-[2]"
            }`}
          >
            {row.v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function VisionPanel() {
  // 理念と代表の言葉は地続きの一続きの文章として読ませる。
  // 罫線での分割や、色・サイズの出し分けはしない。
  const blocks = [...paragraphs(vision.body), ...paragraphs(repMessage)];

  return (
    <div className="mt-9 max-w-[520px] text-base leading-[2.1] text-body">
      {blocks.map((t) => (
        <p key={t} className="mt-6 first:mt-0">
          {t}
        </p>
      ))}
    </div>
  );
}

export function CompanyPanel() {
  return (
    <>
      <div className="mt-10">
        <TableRows rows={companyRows} size="md" />
      </div>

      <div className="mt-14 border-t border-fog pt-9">
        <div className="font-label text-[11px] tracking-[0.16em] text-blue-panel">
          PROFILE / 代表プロフィール
        </div>
        <div className="mt-5 flex flex-wrap items-baseline gap-4">
          <span className="font-display text-2xl tracking-[0.08em]">
            池口祐太
          </span>
          <span className="font-label text-[11px] tracking-[0.1em] text-mist-panel">
            YUTA IKEGUCHI
          </span>
        </div>
        {/* 経歴は本文なのでラベルを持たせず、パネル幅いっぱいに流す。
            ブロック間は余白で区切る。 */}
        <div className="mt-6 border-t border-fog pt-5 text-sm leading-[2] text-ink">
          {profileBio.split("\n").map((block) => (
            <p key={block} className="mt-5 first:mt-0">
              {block}
            </p>
          ))}
        </div>

        <div className="mt-5">
          <TableRows rows={profileRows} size="sm" />
        </div>
      </div>
    </>
  );
}

export function ApproachPanel({ works }: { works: Work[] }) {
  /* 該当が1件も無いボタンは出さない。押した先が「まだありません」だと
     行き止まりになる。/works の絞り込みと同じ考え方。 */
  const hasWorks = (link: { tag?: string; category?: string }) =>
    works.some((w) =>
      link.tag ? !!w.tags?.includes(link.tag) : w.category === link.category,
    );

  return (
    <div className="mt-10 flex flex-col">
      {/* ── 段01 考える ──────────────────────────────────
          カードにしない。枠で囲うと「3つのサービスと並ぶ4つ目」に
          見えてしまう。罫線も持たせず、余白と文字の大きさだけで
          段02より上のレイヤーだと示す。 */}
      <section>
        <div className="flex items-baseline gap-4">
          <span className="font-label text-[12px] tracking-[0.2em] text-blue-panel">
            {approach.think.num}
          </span>
          <h3 className="font-display text-[22px] leading-[1.5] font-medium tracking-[0.08em] md:text-[26px]">
            {approach.think.name}
          </h3>
        </div>

        <p className="mt-4 font-display text-[17px] leading-[1.8] tracking-[0.06em] text-blue-panel md:text-[19px]">
          {approach.think.lead}
        </p>

        {/* 問いを1行ずつ立てる。畳んで1文にすると説明になってしまい、
            「一緒に考える」が絵にならない。 */}
        <ul className="mt-8 flex list-none flex-col gap-4 p-0">
          {approach.think.questions.map((q) => (
            <li
              key={q}
              className="font-display text-[19px] leading-[1.6] tracking-[0.06em] text-ink md:text-[21px]"
            >
              {q}
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-[460px] text-[15px] leading-[2] whitespace-pre-line text-ink">
          {approach.think.body}
        </p>

        {/* 実績カードと同じ目盛り。構想だけを灯して、どこから入れるかを
            図で示す。同じ印が実績側にも出るので、主張と裏づけが結びつく。

            図だけを単独で置く。横に何かを並べると、それが目盛りの
            4つ目の点に見えてしまう。 */}
        <div className="mt-10">
          <PhaseScale active={["構想"]} size="lg" tone="panel" />
        </div>

        {/* 行き先は2つとも「次にすること」。図とは分けて下にまとめる。 */}
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
          <ConsultLink tone="panel" />
          {/* 段02のメニューと同じ文言。すぐ上の図が構想を灯しているので、
              文脈で構想の実績だと分かる。 */}
          <Link
            href="/works?phase=%E6%A7%8B%E6%83%B3"
            className="group flex items-center gap-2 border-b border-blue-panel pb-[3px] text-[13px] tracking-[0.06em] text-blue-panel"
          >
            実績
            <span
              aria-hidden
              className="font-label text-[11px] transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ── 段02 つくる・届ける ───────────────────────────
          パネルは横 520〜720px しかないので、指示書の3カラムは組めない。
          縦に積み、見出しを段01より一段小さくして従属を示す。 */}
      <section className="mt-20 border-t border-fog pt-12">
        <div className="flex items-baseline gap-4">
          <span className="font-label text-[12px] tracking-[0.2em] text-blue-panel">
            {approach.make.num}
          </span>
          <h3 className="font-display text-[19px] leading-[1.5] font-medium tracking-[0.08em] md:text-[21px]">
            {approach.make.name}
          </h3>
        </div>

        {/* 3サービスは段02の中身。左に細い罫線を1本引いて、
            02 にぶら下がっていることを字下げで示す。 */}
        <div className="mt-7 ml-1 flex flex-col border-l border-fog pl-6">
          {services.map((s) => (
            <div key={s.name} className="border-t border-fog py-7 first:border-t-0 first:pt-0">
              <h4 className="font-display text-[16px] font-medium tracking-[0.06em] md:text-[17px]">
                {s.name}
              </h4>
              <p className="mt-2 font-display text-sm leading-[1.8] tracking-[0.06em] text-blue-panel">
                {s.tagline}
              </p>
              <p className="mt-3 max-w-[440px] text-sm leading-[1.9] text-mist-panel">
                {s.desc}
              </p>

              {/* メニューは実績のタグ。押すと該当する実績だけを一覧で見せる。 */}
              {(() => {
                const links = s.links.filter(hasWorks);
                return (
                  links.length > 0 && (
                    <ul className="mt-5 flex list-none flex-wrap gap-x-3 gap-y-2.5 p-0">
                      {links.map((m) => (
                        <li key={m.label}>
                          <Link
                            href={
                              m.tag
                                ? `/works?tag=${encodeURIComponent(m.tag)}`
                                : `/works?category=${encodeURIComponent(m.category ?? "")}`
                            }
                            className="group flex items-center gap-2 rounded-[2px] border border-ink/25 bg-pale/40 px-3.5 py-2 text-xs tracking-[0.04em] text-ink transition-all duration-300 hover:border-logo-blue hover:bg-logo-blue hover:text-pale"
                          >
                            {m.label}
                            <span
                              aria-hidden
                              className="font-label text-[10px] text-mist-panel transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-pale"
                            >
                              →
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )
                );
              })()}
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-fog pt-8">
          <ConsultLink tone="panel" />
        </div>
      </section>
    </div>
  );
}

export function WorksPanel({ works }: { works: Work[] }) {
  const featured = works[0];
  const rest = works.slice(1, 7);

  return (
    <>
      {featured && (
        <div className="mt-8 border-t border-fog py-8">
          <div className="font-label text-[10px] tracking-[0.16em] text-blue-panel">
            FEATURED
          </div>
          <div className="mt-4">
            <WorkCard
              work={featured}
              size="md"
              tone="panel"
              sizes="(max-width: 767px) 100vw, 62vw"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-7 gap-y-20 border-t border-fog py-8 sm:grid-cols-2">
        {rest.map((w) => (
          <WorkCard
            key={w.slug}
            work={w}
            size="sm"
            tone="panel"
            sizes="(max-width: 767px) 100vw, 31vw"
          />
        ))}
      </div>

      <Link
        href="/works"
        className="mt-3 mb-2 inline-block border-b border-blue-panel pb-[3px] text-[13px] tracking-[0.08em] text-blue-panel"
      >
        すべての実績を見る →
      </Link>
    </>
  );
}

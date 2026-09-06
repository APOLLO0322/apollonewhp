import Image from "next/image";
import Link from "next/link";
import {
  companyRows,
  paragraphs,
  profileBio,
  profileRows,
  repMessage,
  services,
  vision,
} from "@/lib/site-content";
import { workHeading, workMeta, workSummary, type Work } from "@/lib/works";

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

export function ServicePanel() {
  return (
    <div className="mt-11 flex flex-col">
      {services.map((s) => (
        <div
          key={s.num}
          className="relative overflow-hidden border-t border-fog py-9"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute top-1.5 right-0 font-label text-[64px] leading-none font-medium text-blue-panel/8 sm:text-[88px]"
          >
            {s.num}
          </span>
          <div className="relative">
            <h3 className="font-display text-2xl font-medium tracking-[0.06em]">
              {s.name}
            </h3>
            <p className="mt-3.5 max-w-[440px] text-sm leading-[1.9] text-mist-panel">
              {s.desc}
            </p>

            {/* メニューは実績のタグ。押すと該当する実績だけを一覧で見せる。
                塗りは淡霧40%だけでブラーはかけない。背後の映像が
                そのまま透けることで、板が平坦に見えなくなる。
                ホバーでロゴのドットの青に塗る。 */}
            {s.menuItems.length > 0 && (
              <ul className="mt-5 flex list-none flex-wrap gap-x-3 gap-y-2.5 p-0">
                {s.menuItems.map((m) => (
                  <li key={m}>
                    <Link
                      href={`/works?tag=${encodeURIComponent(m)}`}
                      className="group flex items-center gap-2 rounded-[2px] border border-ink/25 bg-pale/40 px-3.5 py-2 text-xs tracking-[0.04em] text-ink transition-all duration-300 hover:border-logo-blue hover:bg-logo-blue hover:text-pale"
                    >
                      {m}
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
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* 実績カードの中身。上から メタ（種別・目的・年）/ クライアント / 一行説明。
   クライアントと説明は未入力のレコードがあるので、無ければ行ごと出さない。 */
function WorkCardBody({ work, size }: { work: Work; size: "md" | "sm" }) {
  return (
    <>
      <div
        className={`font-label tracking-[0.1em] text-mist-panel ${
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
          className={`mt-1.5 line-clamp-2 leading-[1.8] text-mist-panel ${
            size === "md" ? "text-[13px]" : "text-xs"
          }`}
        >
          {workSummary(work)}
        </p>
      )}
    </>
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
          <Link href={`/works/${featured.slug}`} className="ap-media block">
            <div className="relative mt-4 aspect-video overflow-hidden">
              <Image
                src={featured.thumbnail}
                alt={featured.title}
                fill
                sizes="(max-width: 767px) 100vw, 62vw"
                className="object-cover"
              />
            </div>
            <WorkCardBody work={featured} size="md" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-7 gap-y-9 border-t border-fog py-8 sm:grid-cols-2">
        {rest.map((w) => (
          <Link key={w.slug} href={`/works/${w.slug}`} className="ap-media block">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={w.thumbnail}
                alt={w.title}
                fill
                sizes="(max-width: 767px) 100vw, 31vw"
                className="object-cover"
              />
            </div>
            <WorkCardBody work={w} size="sm" />
          </Link>
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

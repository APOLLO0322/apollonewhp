import Image from "next/image";
import Link from "next/link";
import {
  companyRows,
  flow,
  profileRows,
  repMessage,
  services,
  vision,
} from "@/lib/site-content";
import type { Work } from "@/lib/works";

/* 罫線1本 + 132px/1fr の定義リスト。カード・角丸・影は使わない。 */
function TableRows({ rows, size }: { rows: { k: string; v: string }[]; size: "md" | "sm" }) {
  return (
    <dl className="flex max-w-[560px] flex-col">
      {rows.map((row) => (
        <div
          key={row.k}
          className="grid grid-cols-[92px_1fr] gap-5 border-t border-fog py-5 sm:grid-cols-[132px_1fr]"
        >
          <dt className="text-xs leading-[1.9] tracking-[0.08em] text-mist">{row.k}</dt>
          <dd
            className={`m-0 whitespace-pre-line text-ink ${
              size === "md" ? "text-[15px] leading-[1.9]" : "text-sm leading-[2]"
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
  return (
    <>
      <div className="mt-9 max-w-[520px] whitespace-pre-line text-base leading-[2.1] text-mist">
        {vision.body}
      </div>
      <div className="mt-12 max-w-[520px] whitespace-pre-line border-t border-fog pt-8 font-serif-jp text-lg leading-[2.1] text-ink">
        {repMessage}
      </div>
    </>
  );
}

export function CompanyPanel() {
  return (
    <>
      <div className="mt-10">
        <TableRows rows={companyRows} size="md" />
      </div>

      <div className="mt-14 border-t border-fog pt-9">
        <div className="font-inter text-[11px] tracking-[0.16em] text-blue">
          PROFILE / 代表プロフィール
        </div>
        <div className="mt-5 flex flex-wrap items-baseline gap-4">
          <span className="font-serif-jp text-2xl tracking-[0.08em]">池口祐太</span>
          <span className="font-inter text-[11px] tracking-[0.1em] text-mist">YUTA IKEGUCHI</span>
        </div>
        <div className="mt-6">
          <TableRows rows={profileRows} size="sm" />
        </div>
      </div>
    </>
  );
}

export function ServicePanel() {
  return (
    <>
      <div className="mt-11 flex flex-col">
        {services.map((s) => (
          <div key={s.num} className="relative overflow-hidden border-t border-fog py-9">
            <span
              aria-hidden
              className="pointer-events-none absolute top-1.5 right-0 font-inter text-[64px] leading-none font-medium text-blue/8 sm:text-[88px]"
            >
              {s.num}
            </span>
            <div className="relative">
              <h3 className="font-serif-jp text-2xl font-medium tracking-[0.03em]">{s.name}</h3>
              <p className="mt-3.5 max-w-[440px] text-sm leading-[1.9] text-mist">{s.desc}</p>
              <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
                {s.menuItems.map((m) => (
                  <li
                    key={m}
                    className="border border-fog px-3.5 py-[7px] font-inter text-[11px] tracking-[0.03em] text-ink"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-fog pt-9">
        <div className="mb-6 font-inter text-[11px] tracking-[0.16em] text-mist">
          FLOW / 制作の流れ
        </div>
        <ol className="relative m-0 list-none p-0 pl-7">
          <span aria-hidden className="absolute top-2 bottom-2 left-[5px] w-px bg-fog" />
          {flow.map((f) => (
            <li key={f} className="relative flex items-baseline gap-5 py-3.5">
              <span
                aria-hidden
                className="absolute top-1/2 -left-7 size-[11px] -translate-y-1/2 rounded-full bg-blue"
              />
              <span className="text-[15px]">{f}</span>
            </li>
          ))}
        </ol>
      </div>
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
          <div className="font-inter text-[10px] tracking-[0.16em] text-blue">FEATURED</div>
          <Link
            href={`/works/${featured.slug}`}
            className="ap-media relative mt-4 block aspect-video overflow-hidden"
          >
            <Image
              src={featured.thumbnail}
              alt={featured.title}
              fill
              sizes="(max-width: 767px) 100vw, 62vw"
              className="object-cover"
            />
          </Link>
          <div className="mt-3.5 text-[15px] text-ink">{featured.title}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-7 border-t border-fog py-8 sm:grid-cols-2">
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
            <div className="mt-2.5 text-sm leading-[1.6]">{w.title}</div>
            <div className="mt-1.5 font-inter text-[10px] tracking-[0.06em] text-mist">
              {w.category} · {w.year}
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/works"
        className="mt-3 mb-2 inline-block border-b border-blue pb-[3px] text-[13px] tracking-[0.08em] text-blue"
      >
        すべての実績を見る →
      </Link>
    </>
  );
}

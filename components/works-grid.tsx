"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import WorkCardBody from "@/components/work-card";
import WorkThumb from "@/components/work-thumb";
import { serviceTags } from "@/lib/site-content";
import { categoryFilters, type Work, type WorkCategory } from "@/lib/works";

type Filter = "ALL" | WorkCategory;

/* 絞り込みは2軸ある。
   CATEGORY = 何を作ったか（映像 / SNS / 写真）
   TAG      = 何のために作ったか（事業内容パネルのメニューと同じ）
   軸が違うことが見た目で分かるよう、行を分けてラベルを付け、
   選択中の下線の色を変えている（カテゴリ＝墨、タグ＝ロゴの青）。

   枠付きのチップを13個並べるとフォームのように見えて、明朝の
   見出しと喧嘩する。正典の「ボタンは塗りか下線のみ、箱型の枠ボタンは
   最小限」に従って、枠をやめて下線で選択を示す。 */

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
      <div className="pt-2.5 font-label text-[10px] tracking-[0.2em] text-mist md:w-16 md:shrink-0">
        {label}
      </div>
      <div className="flex flex-wrap gap-x-7 gap-y-3">{children}</div>
    </div>
  );
}

export default function WorksGrid({ works }: { works: Work[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [tag, setTag] = useState<string | null>(null);

  // タグは事業内容パネルのメニューから /works?tag=... でも渡ってくる。
  //
  // useSearchParams を使うとこのツリーがクライアント専用になり、
  // 実績へのリンクが初期HTMLから消えてクローラが辿れなくなる。
  // URLはマウント後に自前で読み、サーバでは全件を描画しておく。
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 初回マウント時のURL読み取り
    setTag(new URLSearchParams(window.location.search).get("tag"));
  }, []);

  // 同じタグをもう一度押したら解除。共有できるようURLも書き換えるが、
  // Nextのナビゲーションは起こさない（再取得も再描画も不要なので）。
  function toggleTag(next: string) {
    const value = tag === next ? null : next;
    setTag(value);
    const url = value ? `/works?tag=${encodeURIComponent(value)}` : "/works";
    window.history.replaceState(null, "", url);
  }

  const visible = works.filter((w) => {
    if (filter !== "ALL" && w.category !== filter) return false;
    if (tag && !w.tags?.includes(tag)) return false;
    return true;
  });

  return (
    <>
      <div className="flex flex-col gap-6 px-5 pb-12 md:px-16">
        <FilterRow label="CATEGORY">
          {(["ALL", ...categoryFilters] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`border-b pb-1.5 font-label text-[11px] tracking-[0.14em] transition-colors ${
                filter === f
                  ? "border-ink text-ink"
                  : "border-transparent text-mist hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </FilterRow>

        <FilterRow label="TAG">
          {serviceTags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              aria-pressed={tag === t}
              className={`border-b pb-1.5 text-[13px] tracking-[0.04em] transition-colors duration-200 ${
                tag === t
                  ? "border-logo-blue text-ink"
                  : "border-transparent text-mist hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </FilterRow>
      </div>

      {/* 霧色を敷いてカードを淡霧で抜く組み方だと、3の倍数に満たない
          最終行の空きマスに下地の霧色が出てしまう。パネルと同じく
          罫線なし・余白だけで組む。 */}
      <div className="grid grid-cols-1 gap-x-7 gap-y-12 border-b border-fog px-5 pb-16 sm:grid-cols-2 md:px-16 lg:grid-cols-3">
        {visible.map((w) => (
          <Link key={w.slug} href={`/works/${w.slug}`} className="ap-media block">
            <WorkThumb
              work={w}
              aspect="43"
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            />
            <WorkCardBody work={w} size="sm" />
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="border-b border-fog px-5 py-20 text-center text-sm text-mist md:px-16">
          {tag
            ? `「${tag}」の実績はまだ登録されていません。`
            : "該当する実績はまだありません。"}
        </p>
      )}
    </>
  );
}

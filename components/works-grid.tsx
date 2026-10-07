"use client";

import { useEffect, useState } from "react";
import WorkCard from "@/components/work-card";
import { serviceTags } from "@/lib/site-content";
import {
  categoryLabel,
  workCategories,
  type Work,
  type WorkCategory,
} from "@/lib/works";

type Filter = "ALL" | WorkCategory;

/* 絞り込みは2軸ある。
   CATEGORY = 何を作ったか（映像 / SNS / 写真）
   TAG      = 何のために作ったか（事業内容パネルのメニューと同じ）
   軸が違うことが見た目で分かるよう、行を分けてラベルを付け、
   選択中の下線の色を変えている（カテゴリ＝墨、タグ＝ロゴの青）。

   枠付きのチップを13個並べるとフォームのように見えて、明朝の
   見出しと喧嘩する。正典の「ボタンは塗りか下線のみ、箱型の枠ボタンは
   最小限」に従って、枠をやめて下線で選択を示す。 */

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-6">
      <div className="font-label text-[10px] tracking-[0.2em] text-mist md:w-16 md:shrink-0">
        {label}
      </div>
      <div className="flex flex-wrap gap-x-7 gap-y-3">{children}</div>
    </div>
  );
}

export default function WorksGrid({ works }: { works: Work[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [tag, setTag] = useState<string | null>(null);
  // 「構想から」。種別・目的とは別の軸なので独立した状態で持つ
  const [fromIdea, setFromIdea] = useState(false);

  // 事業内容パネルのメニューから /works?tag=... と /works?category=... の
  // どちらでも渡ってくる。
  //
  // useSearchParams を使うとこのツリーがクライアント専用になり、
  // 実績へのリンクが初期HTMLから消えてクローラが辿れなくなる。
  // URLはマウント後に自前で読み、サーバでは全件を描画しておく。
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const c = (q.get("category") ?? "").toUpperCase();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 初回マウント時のURL読み取り
    setTag(q.get("tag"));
    if ((workCategories as string[]).includes(c)) setFilter(c as WorkCategory);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 同上
    if (q.get("phase") === "構想") setFromIdea(true);
  }, []);

  // 選んだ状態はURLにも残す。共有・リロードで再現できるようにするが、
  // Nextのナビゲーションは起こさない（再取得も再描画も不要なので）。
  function syncUrl(nextFilter: Filter, nextTag: string | null, nextIdea: boolean) {
    const q = new URLSearchParams();
    if (nextFilter !== "ALL") q.set("category", nextFilter);
    if (nextTag) q.set("tag", nextTag);
    if (nextIdea) q.set("phase", "構想");
    const qs = q.toString();
    window.history.replaceState(null, "", qs ? `/works?${qs}` : "/works");
  }

  function selectFilter(next: Filter) {
    setFilter(next);
    syncUrl(next, tag, fromIdea);
  }

  // 同じタグをもう一度押したら解除
  function toggleTag(next: string) {
    const value = tag === next ? null : next;
    setTag(value);
    syncUrl(filter, value, fromIdea);
  }

  function toggleFromIdea() {
    const value = !fromIdea;
    setFromIdea(value);
    syncUrl(filter, tag, value);
  }

  /* 該当が1件も無い選択肢は出さない。押しても「まだありません」に
     なるだけで、選べる場所が増えるほど何が有効なのか分からなくなる。

     判定は常に全件に対して行う（絞り込み後ではなく）。絞り込むたびに
     選択肢が増減すると、押した先で項目が消えて操作が迷子になるため。
     いま選ばれている値だけは、0件でも残す（消えると解除できない）。 */
  const has = (fn: (w: Work) => boolean) => works.some(fn);

  const shownCategories = workCategories.filter(
    (c) => has((w) => w.category === c) || filter === c,
  );
  const shownTags = serviceTags.filter(
    (t) => has((w) => !!w.tags?.includes(t)) || tag === t,
  );

  // 構想から入った案件が1件も無いうちはトグル自体を出さない
  const hasIdeaWorks = has((w) => !!w.phase?.includes("構想"));

  const visible = works.filter((w) => {
    if (filter !== "ALL" && w.category !== filter) return false;
    if (tag && !w.tags?.includes(tag)) return false;
    if (fromIdea && !w.phase?.includes("構想")) return false;
    return true;
  });

  return (
    <>
      <div className="flex flex-col gap-6 px-5 pb-12 md:px-16">
        <FilterRow label="CATEGORY">
          {(["ALL", ...shownCategories] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => selectFilter(f)}
              aria-pressed={filter === f}
              className={`border-b pb-1.5 font-label text-[11px] tracking-[0.14em] transition-colors ${
                filter === f
                  ? "border-ink text-ink"
                  : "border-transparent text-mist hover:text-logo-blue"
              }`}
            >
              {f === "ALL" ? "ALL" : categoryLabel[f]}
            </button>
          ))}
        </FilterRow>

        {shownTags.length > 0 && (
          <FilterRow label="TAG">
            {shownTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                aria-pressed={tag === t}
                className={`border-b pb-1.5 font-label text-xs tracking-[0.06em] transition-colors duration-200 ${
                  tag === t
                    ? "border-logo-blue text-ink"
                    : "border-transparent text-mist hover:text-logo-blue"
                }`}
              >
                {t}
              </button>
            ))}
          </FilterRow>
        )}

        {/* 「構想から」は種別・目的と別の軸。同じ列に並べると
            「種類の1つ」として読まれ、APPROACH で作った上下関係が
            打ち消される。区切りを挟んで一段下げ、別物だと配置で示す。 */}
        {hasIdeaWorks && (
          <div className="mt-2 border-t border-fog pt-6">
            <button
              type="button"
              onClick={toggleFromIdea}
              aria-pressed={fromIdea}
              className={`group inline-flex items-center gap-2.5 font-label text-xs tracking-[0.06em] transition-colors duration-200 ${
                fromIdea ? "text-blue" : "text-mist hover:text-blue"
              }`}
            >
              <span
                aria-hidden
                className={`flex size-3.5 shrink-0 items-center justify-center rounded-[2px] border transition-colors duration-200 ${
                  fromIdea
                    ? "border-blue bg-blue text-pale"
                    : "border-fog group-hover:border-blue"
                }`}
              >
                {fromIdea && (
                  <svg viewBox="0 0 10 10" className="size-2.5" aria-hidden>
                    <path
                      d="M1.6 5.2 3.9 7.4 8.4 2.7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              構想から
            </button>
          </div>
        )}
      </div>

      {/* 霧色を敷いてカードを淡霧で抜く組み方だと、3の倍数に満たない
          最終行の空きマスに下地の霧色が出てしまう。パネルと同じく
          罫線なし・余白だけで組む。 */}
      <div className="grid grid-cols-1 gap-x-7 gap-y-20 border-b border-fog px-5 pb-16 sm:grid-cols-2 md:px-16 lg:grid-cols-3">
        {visible.map((w) => (
          <WorkCard
            key={w.slug}
            work={w}
            size="sm"
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="border-b border-fog px-5 py-20 text-center text-sm text-mist md:px-16">
          {fromIdea
            ? "この条件で、構想から関わった実績はまだありません。"
            : tag
              ? `「${tag}」の実績はまだ登録されていません。`
              : "該当する実績はまだありません。"}
        </p>
      )}
    </>
  );
}

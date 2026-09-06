"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { workCategories, workMeta, type Work, type WorkCategory } from "@/lib/works";

type Filter = "ALL" | WorkCategory;

export default function WorksGrid({ works }: { works: Work[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");

  // タグは事業内容パネルのメニューから /works?tag=... で渡ってくる。
  // カテゴリの絞り込みとは併用できる（AND）。
  //
  // useSearchParams を使うとこのツリーがクライアント専用になり、
  // 実績へのリンクが初期HTMLから消えてクローラが辿れなくなる。
  // URLはマウント後に自前で読み、サーバでは全件を描画しておく。
  const router = useRouter();
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 初回マウント時のURL読み取り
    setTag(new URLSearchParams(window.location.search).get("tag"));
  }, []);

  const visible = works.filter((w) => {
    if (filter !== "ALL" && w.category !== filter) return false;
    if (tag && !w.tags?.includes(tag)) return false;
    return true;
  });

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5 px-5 pb-10 font-label text-[11px] tracking-[0.08em] md:px-16">
        {(["ALL", ...workCategories] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`px-5 py-[9px] transition-colors ${
              filter === f
                ? "bg-ink text-pale"
                : "border border-fog text-mist hover:border-mist"
            }`}
          >
            {f}
          </button>
        ))}

        {tag && (
          <button
            type="button"
            onClick={() => router.push("/works")}
            className="ml-1 flex items-center gap-2.5 border border-blue px-5 py-[9px] text-blue transition-colors hover:bg-blue hover:text-pale"
            aria-label={`タグ「${tag}」の絞り込みを解除`}
          >
            {tag}
            <span aria-hidden>×</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-px border-b border-fog bg-fog sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((w) => (
          <Link
            key={w.slug}
            href={`/works/${w.slug}`}
            className="ap-media bg-pale p-5 md:p-8"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={w.thumbnail}
                alt={w.title}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="mt-[18px] text-[15px] leading-[1.5]">{w.title}</div>
            <div className="mt-2 font-label text-[10px] tracking-[0.08em] text-mist">
              {workMeta(w)}
            </div>
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

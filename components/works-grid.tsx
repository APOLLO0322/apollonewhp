"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { workCategories, workMeta, type Work, type WorkCategory } from "@/lib/works";

type Filter = "ALL" | WorkCategory;

export default function WorksGrid({ works }: { works: Work[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");
  const visible = filter === "ALL" ? works : works.filter((w) => w.category === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2.5 px-5 pb-10 font-inter text-[11px] tracking-[0.08em] md:px-16">
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
            <div className="mt-2 font-inter text-[10px] tracking-[0.08em] text-mist">
              {workMeta(w)}
            </div>
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="border-b border-fog px-5 py-20 text-center text-sm text-mist md:px-16">
          該当する実績はまだありません。
        </p>
      )}
    </>
  );
}

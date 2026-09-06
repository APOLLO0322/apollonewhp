"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { previewEmbedUrl, type Work } from "@/lib/works";

/* 実績のサムネイル。ホバーしている間だけ埋め込みプレーヤーを載せる。

   パネルには最大7枚並ぶので、最初から全部のプレーヤーを読むと重い。
   ホバーしてから DELAY だけ待って初めて iframe を作り、離したら捨てる。
   カーソルが通り過ぎただけでは読み込まない。

   videoUrl が Instagram のものと未入力のレコードは静止画のまま。 */

const DELAY = 250;

type Props = {
  work: Work;
  aspect: "video" | "43";
  sizes: string;
};

export default function WorkThumb({ work, aspect, sizes }: Props) {
  const embed = previewEmbedUrl(work);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function start() {
    if (!embed || playing) return;
    // 動きを減らす設定の人には出さない
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setTimeout(() => setPlaying(true), DELAY);
  }

  function stop() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setPlaying(false);
  }

  return (
    <div
      onMouseEnter={start}
      onMouseLeave={stop}
      className={`relative overflow-hidden ${aspect === "video" ? "aspect-video" : "aspect-[4/3]"}`}
    >
      <Image src={work.thumbnail} alt={work.title} fill sizes={sizes} className="object-cover" />

      {playing && embed && (
        <iframe
          src={embed}
          title={`${work.title} のプレビュー`}
          allow="autoplay; encrypted-media"
          loading="lazy"
          /* 16:9 の映像で 4:3 の枠を覆うには幅を 133% 取る。
             クリックはカード側のリンクに通したいので pointer-events は殺す。 */
          className={`pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0 ${
            aspect === "video" ? "size-full" : "h-full w-[134%]"
          }`}
        />
      )}
    </div>
  );
}

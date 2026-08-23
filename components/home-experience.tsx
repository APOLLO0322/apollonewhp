"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ContactForm from "@/components/contact-form";
import { CompanyPanel, ServicePanel, VisionPanel, WorksPanel } from "@/components/panels";
import { company, contactCopy, vision } from "@/lib/site-content";
import type { Work } from "@/lib/works";

/* ── ヒーロー素材 ─────────────────────────────────────────────
   読み込みごとに1本をランダムで再生する。poster は各動画の先頭フレーム
   （読み込み中の数百msだけ出る。静止画そのものは表示しない）。

   足すとき: H.264 / 音声なし / 1920x1080 / 3.5Mbps 程度に変換して
   public/hero/ に置き、この配列に1行足す。変換手順は README を参照。
   時間帯で出し分けたくなったら、この配列を朝夕でフィルタすればよい。  */
type HeroClip = { video: string; poster: string; alt: string };

const HERO_CLIPS: HeroClip[] = [
  { video: "/hero/hero-01.mp4", poster: "/hero/hero-01.jpg", alt: "瀬戸内の入江" },
  { video: "/hero/hero-02.mp4", poster: "/hero/hero-02.jpg", alt: "車窓から愛媛の町を撮る" },
  { video: "/hero/hero-03.mp4", poster: "/hero/hero-03.jpg", alt: "木漏れ日の庭" },
];

// 仮素材の注記。本番素材が確定したら false のままでよい
const HERO_IS_PLACEHOLDER = false;

type PanelKey = "vision" | "company" | "service" | "works" | "contact";

const panelMeta: Record<PanelKey, { label: string; title: string }> = {
  vision: { label: vision.label, title: vision.title },
  company: { label: "COMPANY", title: "会社概要" },
  service: { label: "SERVICE", title: "事業内容" },
  works: { label: "WORKS", title: "制作実績" },
  contact: { label: contactCopy.label, title: contactCopy.title },
};

// パネルの内容に対応するフルページ。TOPからしか辿れない情報を作らないための導線で、
// パネル右上の「↗ フルページ」に出る。お問合せはパネル内で完結させるので持たない。
const fullPageOf: Partial<Record<PanelKey, string>> = {
  works: "/works",
  vision: "/about#vision",
  company: "/about",
};

const navItems: { key: PanelKey; label: string }[] = [
  { key: "service", label: "事業内容" },
  { key: "works", label: "制作実績" },
  { key: "vision", label: "理念" },
  { key: "company", label: "会社概要" },
];

type OpenKey = PanelKey | "menu";

function isPanelKey(value: string | null): value is PanelKey {
  return value !== null && value in panelMeta;
}

export default function HomeExperience({ works }: { works: Work[] }) {
  const [open, setOpen] = useState<OpenKey | null>(null);
  const [clip, setClip] = useState<HeroClip | null>(null);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 再生するクリップは読み込みごとにランダム。サーバとクライアントで
  // 結果が食い違わないよう、マウント後に決めて1本だけ取りに行く。
  useEffect(() => {
    const pick = HERO_CLIPS[Math.floor(Math.random() * HERO_CLIPS.length)];
    // eslint-disable-next-line react-hooks/set-state-in-effect -- クライアント固有の値をマウント時に一度だけ決める
    setClip(pick);
  }, []);

  // 映像そのものがこのサイトの主役なので、prefers-reduced-motion でも
  // 自動再生は止めない。代わりに止める手段を必ず用意する。
  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  // UI（CLOSE / 暗幕 / Esc）で閉じたのか、パネルを開いたままページ遷移して
  // アンマウントされたのかを区別する。後者で history.back() すると遷移が潰れる。
  const closedByUi = useRef(false);
  const close = useCallback(() => {
    closedByUi.current = true;
    setOpen(null);
  }, []);

  // 他ページのヘッダーから ?panel=service のように指定して開く。
  // パネルは遷移ではないので、Home 内での開閉では URL を書き換えない。
  // URL という外部状態をマウント時に一度だけ読む用途なので、
  // searchParams で動的レンダリングにせず effect で拾う（TOPは静的配信を維持する）。
  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get("panel");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 初回マウント時のURL読み取り。連鎖レンダリングにはならない
    if (isPanelKey(key)) setOpen(key);
  }, []);

  const panelOpen = open !== null;

  // 開いている間だけ Esc とスクロールロック
  useEffect(() => {
    if (!panelOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [panelOpen, close]);

  // 戻る操作でパネルを閉じる（モバイルで必須の逃げ道）。
  // パネル間の切り替えでは panelOpen が変わらないので履歴は増えない。
  useEffect(() => {
    if (!panelOpen) return;

    closedByUi.current = false;
    window.history.pushState({ apPanel: true }, "");
    const onPop = () => setOpen(null);
    window.addEventListener("popstate", onPop);

    return () => {
      window.removeEventListener("popstate", onPop);
      if (closedByUi.current && window.history.state?.apPanel) window.history.back();
      closedByUi.current = false;
    };
  }, [panelOpen]);

  const meta = open && open !== "menu" ? panelMeta[open] : null;
  const fullPageHref = open && open !== "menu" ? fullPageOf[open] : undefined;

  const logoColor = panelOpen ? "text-ink" : "text-pale";
  const navColor = panelOpen ? "text-mist" : "text-pale/88";
  const ctaColor = panelOpen ? "text-ink border-ink" : "text-pale border-pale/60";

  return (
    <div className="relative mx-auto max-w-[1600px] overflow-hidden bg-ink">
      {/* ── ヘッダー：ヒーロー上の透過オーバーレイ ── */}
      <header className="absolute top-0 right-0 left-0 z-[8] flex items-center justify-between px-5 py-7 transition-colors duration-500 md:px-16 md:py-10">
        <button
          type="button"
          onClick={close}
          aria-label="ホームへ"
          className={`font-inter text-[13px] font-normal tracking-[0.36em] transition-colors duration-500 md:text-[15px] ${logoColor}`}
        >
          APOLLO
        </button>

        <nav className="hidden items-center gap-11 font-inter text-[11px] tracking-[0.18em] md:flex">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setOpen(item.key)}
              className={`whitespace-nowrap transition-colors duration-500 ${navColor}`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOpen("contact")}
            className={`border-b pb-1 whitespace-nowrap transition-colors duration-500 ${ctaColor}`}
          >
            お問合せ
          </button>
        </nav>

        {/* モバイルはナビが収まらないので MENU で開く。開いている間は
            パネル側の CLOSE に任せる（同じ役目のボタンを2つ出さない）。 */}
        {!panelOpen && (
          <button
            type="button"
            onClick={() => setOpen("menu")}
            className="font-inter text-[11px] tracking-[0.24em] text-pale md:hidden"
          >
            MENU
          </button>
        )}
      </header>

      {/* ── ヒーロー：ここから動かさない ── */}
      <div className="relative h-[100svh] min-h-[560px] overflow-hidden md:min-h-[760px]">
        {/* 動画は自前の動きを持つので apZoom はかけない。
            poster が即座に出るのでフェードインは挟まない（非表示タブで
            トランジションが止まると真っ黒のままになるため）。 */}
        {clip && (
          <video
            key={clip.video}
            ref={videoRef}
            className="absolute inset-0 size-full object-cover"
            src={clip.video}
            poster={clip.poster}
            aria-label={clip.alt}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        )}

        {/* 上下は文字（ヘッダー・実績を見る）の可読性、中央はロゴの可読性のため。
            映像全体を暗くすると「きれいなものはきれいなまま」に反するので、
            中央は spec §3.6 の墨40%を円形に置くだけに留める。 */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-ink/35 via-ink/5 to-ink/55"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 38% 34% at 50% 48%, rgba(22,25,26,0.40), rgba(22,25,26,0) 72%)",
          }}
        />

        {HERO_IS_PLACEHOLDER && (
          <div className="absolute top-24 right-6 z-[2] font-inter text-[9px] tracking-[0.1em] text-pale/60">
            PLACEHOLDER — 差し替え予定
          </div>
        )}

        <div className="ap-fade absolute inset-0 flex flex-col items-center justify-center gap-6">
          {/* 映像の上なので白抜き版を使う（spec §3.6）。黒版は明色背景用に温存 */}
          <Image
            src="/logo/apollo-logo-white.png"
            alt={company.name}
            width={3123}
            height={3416}
            priority
            className="h-auto w-[150px] drop-shadow-[0_6px_30px_rgba(0,0,0,0.45)] md:w-[220px]"
          />
        </div>

        {/* 自動再生を止める手段。動きを減らしたい人のための逃げ道なので、
            装飾を足さず文字だけで置く。 */}
        {clip && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute bottom-9 left-5 font-inter text-[11px] tracking-[0.24em] text-pale/70 transition-colors hover:text-pale md:bottom-11 md:left-16"
          >
            {playing ? "PAUSE" : "PLAY"}
          </button>
        )}

        <div className="absolute right-5 bottom-9 flex gap-9 font-inter text-[11px] tracking-[0.12em] md:right-16 md:bottom-11">
          <Link href="/works" className="border-b border-pale/50 pb-1 text-pale">
            実績を見る
          </Link>
        </div>

        {/* ── スライドインパネル ── */}
        {panelOpen && (
          <>
            <div
              onClick={close}
              aria-hidden
              className="absolute inset-0 z-[6] bg-ink/40"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={meta ? `${meta.label} パネル` : "メニュー"}
              className="ap-panel-in ap-scroll absolute inset-y-0 right-0 z-[7] w-full overflow-y-auto bg-pale/78 text-ink backdrop-blur-[22px] backdrop-saturate-[1.3] md:w-[min(62vw,880px)]"
            >
              <div className="flex items-center justify-between px-5 pt-28 md:px-18 md:pt-33">
                <div className="font-inter text-[11px] tracking-[0.28em] text-blue">
                  {meta ? meta.label : "MENU"}
                </div>
                <div className="flex items-center gap-5">
                  {fullPageHref && (
                    <Link
                      href={fullPageHref}
                      title="フルページで見る"
                      className="flex shrink-0 items-center gap-1.5 border-b border-mist pb-[3px] font-inter text-[11px] tracking-[0.1em] whitespace-nowrap text-mist"
                    >
                      ↗ フルページ
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={close}
                    className="border-b border-mist pb-[3px] font-inter text-[11px] tracking-[0.1em] text-mist"
                  >
                    CLOSE
                  </button>
                </div>
              </div>

              <div className="px-5 pt-8 pb-24 md:px-18">
                {open === "menu" ? (
                  <nav className="flex flex-col">
                    {navItems.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setOpen(item.key)}
                        className="border-t border-fog py-6 text-left font-serif-jp text-[28px] font-medium tracking-[0.03em]"
                      >
                        {item.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setOpen("contact")}
                      className="border-t border-b border-fog py-6 text-left font-serif-jp text-[28px] font-medium tracking-[0.03em] text-blue"
                    >
                      お問合せ
                    </button>
                  </nav>
                ) : (
                  <>
                    <h2 className="ap-fade-q font-serif-jp text-[30px] leading-[1.5] font-medium tracking-[0.03em] whitespace-pre-line md:text-[42px]">
                      {meta?.title}
                    </h2>

                    {open === "vision" && <VisionPanel />}
                    {open === "company" && <CompanyPanel />}
                    {open === "service" && <ServicePanel />}
                    {open === "works" && <WorksPanel works={works} />}
                    {open === "contact" && (
                      <div className="mt-6">
                        <p className="text-[15px] leading-[2] text-mist">{contactCopy.lead}</p>
                        <div className="mt-8">
                          <ContactForm variant="panel" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

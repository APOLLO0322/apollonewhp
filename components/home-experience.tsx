"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ContactForm from "@/components/contact-form";
import { ApproachPanel, CompanyPanel, VisionPanel, WorksPanel } from "@/components/panels";
import { navLabel, navOrder } from "@/lib/nav";
import { approach, clients, company, contactCopy, vision } from "@/lib/site-content";
import type { Work } from "@/lib/works";

/* ── ヒーロー素材 ─────────────────────────────────────────────
   読み込みごとに1本をランダムで再生する。poster は各動画の先頭フレーム
   （読み込み中の数百msだけ出る。静止画そのものは表示しない）。

   足すとき: H.264 / 音声なし / 1920x1080 / 3.5Mbps 程度に変換して
   public/hero/ に置き、この配列に1行足す。変換手順は README を参照。
   時間帯で出し分けたくなったら、この配列を朝夕でフィルタすればよい。  */
type HeroClip = { video: string; poster: string; alt: string };

/* 初めてこのサイトに着いた人には、必ずこの1本を見せる。
   第一印象を運まかせにしない。 */
const HERO_INTRO: HeroClip = {
  video: "/hero/main.mp4",
  poster: "/hero/main.jpg",
  alt: "株式会社APOLLOの紹介映像",
};

/* 2回目以降に戻ってきたときに流す短尺。ループはせず、終わるたびに
   次の1本をランダムに選ぶ。 */
const HERO_SHORTS: HeroClip[] = Array.from({ length: 13 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { video: `/hero/short-${n}.mp4`, poster: `/hero/short-${n}.jpg`, alt: "" };
});

/* 直前と同じものは選ばない。13本あっても偶然2回続くと
   「1本しか無いサイト」に見えてしまう。 */
function pickShort(previous?: string): HeroClip {
  const pool = previous
    ? HERO_SHORTS.filter((c) => c.video !== previous)
    : HERO_SHORTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/* 紹介映像を見せたかどうか。タブを閉じるまで覚えておく。
   同じ滞在の中で /works などから戻ってきたときは短尺に切り替わり、
   日を改めて来たときはまた紹介映像から始まる。 */
const INTRO_SHOWN_KEY = "ap-hero-intro-shown";

// 仮素材の注記。本番素材が確定したら false のままでよい
const HERO_IS_PLACEHOLDER = false;

/* ロゴを並べる本数。ap-marquee は -50% 動くので、継ぎ目が出ないよう
   セット数は必ず偶数にする。社数が少ないうちは繰り返しを増やして
   帯の途中で列が途切れないようにする。 */
const marqueeLogos = Array.from(
  { length: Math.max(2, Math.ceil(12 / clients.length / 2) * 2) },
  () => clients,
).flat();

type PanelKey = "vision" | "company" | "approach" | "works" | "contact";

const panelMeta: Record<PanelKey, { label: string; title: string }> = {
  vision: { label: vision.label, title: vision.title },
  company: { label: "COMPANY", title: "会社概要" },
  approach: { label: approach.label, title: approach.title },
  works: { label: "WORKS", title: "制作実績" },
  contact: { label: contactCopy.label, title: contactCopy.title },
};

// フルページを持つのは制作実績だけ。理念・会社概要・お問合せはパネル内で完結する。
// パネル右上の「↗ フルページ」はこの表にあるものにだけ出る。
const fullPageOf: Partial<Record<PanelKey, string>> = {
  works: "/works",
};

/* 常に描く見出し。お問合せだけは見出しを持たない（CONTACT のラベルで足りる）。 */
const panelTitles = (Object.entries(panelMeta) as [PanelKey, { title: string }][])
  .filter(([, m]) => m.title)
  .map(([key, m]) => [key, m.title] as const);

// 順番・表記は lib/nav.ts が正。PanelKey と NavKey は同じキー体系。
const navItems = navOrder;

type OpenKey = PanelKey | "menu";

function isPanelKey(value: string | null): value is PanelKey {
  return value !== null && value in panelMeta;
}

export default function HomeExperience({ works }: { works: Work[] }) {
  const [open, setOpen] = useState<OpenKey | null>(null);
  const [clip, setClip] = useState<HeroClip | null>(null);
  // 次に流す1本。先に決めておいて裏で読ませる（切り替わりで止まらないように）
  const [nextClip, setNextClip] = useState<HeroClip | null>(null);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /* 何を流すかはブラウザ側の事情（初回かどうか・乱数）で決まるので、
     サーバとクライアントで食い違わないようマウント後に決める。 */
  /* この判定は「初回かどうか」を記録しながら読むので、二度走ると
     1回目の記録を2回目が読んでしまい、初回の人にも短尺が出る。
     開発時は効果が2回呼ばれるため、必ず1回で止める。 */
  const heroDecided = useRef(false);

  useEffect(() => {
    if (heroDecided.current) return;
    heroDecided.current = true;

    let shown = false;
    try {
      shown = sessionStorage.getItem(INTRO_SHOWN_KEY) === "1";
      sessionStorage.setItem(INTRO_SHOWN_KEY, "1");
    } catch {
      // プライベートモードなどで触れないことがある。毎回「初回」でよい
    }
    const first = shown ? pickShort() : HERO_INTRO;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- クライアント固有の値をマウント時に一度だけ決める
    setClip(first);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 同上
    setNextClip(pickShort(first.video));
  }, []);

  /* 1本終わったら次へ。紹介映像のあともここを通るので、初回の人も
     30秒後からは短尺が流れ続ける。 */
  const advance = useCallback(() => {
    setClip(nextClip);
    setNextClip(pickShort(nextClip?.video));
  }, [nextClip]);

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
    const raw = new URLSearchParams(window.location.search).get("panel");
    // SERVICE から APPROACH に改名した。旧いリンクが外に出ている
    // （旧サイトの /service/ からの転送を含む）ので、旧キーも受ける。
    const key = raw === "service" ? "approach" : raw;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 初回マウント時のURL読み取り。連鎖レンダリングにはならない
    if (isPanelKey(key)) setOpen(key);
  }, []);

  const panelOpen = open !== null;

  /* 開いたままにして hidden で隠す作りなので、閉じてもスクロール位置が
     残る。別のパネルを開いたときに途中から始まって見えるので、
     開くたびに先頭へ戻す。 */
  const panelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (panelOpen && panelRef.current) panelRef.current.scrollTop = 0;
  }, [open, panelOpen]);

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
  const navColor = panelOpen ? "text-mist-panel" : "text-pale/88";
  const ctaColor = panelOpen ? "text-ink border-ink" : "text-pale border-pale/60";
  // 明色のパネルの上に来たら影は邪魔になるので外す
  const onMedia = panelOpen ? "" : "ap-on-media";

  return (
    <div className="relative mx-auto max-w-[1600px] overflow-hidden bg-ink">
      {/* ── ヘッダー：ヒーロー上の透過オーバーレイ ── */}
      {/* スマホではパネルが全幅なので、開いている間はこの帯の裏を
          パネルの中身が流れていき、ロゴやメニューが読みにくくなる。
          開いている間だけ淡霧を敷いて塞ぐ。PCではパネルが右4割に
          収まっていて、左にはヒーローの映像が見えているので敷かない。 */}
      <header className={`absolute top-0 right-0 left-0 z-[8] flex items-center justify-between px-5 py-7 transition-colors duration-500 md:py-10 ${
          panelOpen ? "bg-pale md:bg-transparent md:pr-12 md:pl-16" : "md:px-16"
        }`}>
        <button
          type="button"
          onClick={close}
          aria-label="ホームへ"
          className={`font-label text-[13px] font-normal tracking-[0.36em] transition-colors duration-500 md:text-[15px] ${logoColor} ${onMedia}`}
        >
          APOLLO
        </button>

        <nav className={`hidden items-center gap-7 font-label text-[11px] tracking-[0.18em] md:flex ${onMedia}`}>
          {navItems.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setOpen(key)}
              className={`whitespace-nowrap transition-colors duration-500 ${navColor}`}
            >
              {navLabel[key]}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOpen("contact")}
            className={`border-b pb-1 whitespace-nowrap transition-colors duration-500 ${ctaColor}`}
          >
            {navLabel.contact}
          </button>
        </nav>

        {/* モバイルはナビが収まらないので MENU で開く。開いている間は
            パネル側の CLOSE に任せる（同じ役目のボタンを2つ出さない）。 */}
        {!panelOpen && (
          <button
            type="button"
            onClick={() => setOpen("menu")}
            className="ap-on-media font-label text-[11px] tracking-[0.24em] text-pale md:hidden"
          >
            MENU
          </button>
        )}
      </header>

      {/* ── ヒーロー：ここから動かさない ── */}
      {/* 正典は min-height 760px だが、下端にロゴの帯を置いた以上、
          ヒーローがビューポートより高いと帯が画面外に落ちる。
          100svh を基本にして、極端に低い窓だけ min で受ける。 */}
      <div className="relative h-[100svh] min-h-[420px] overflow-hidden">
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
            playsInline
            preload="auto"
            onEnded={advance}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        )}

        {/* 次の1本を裏で読ませておく。display:none だと読み込みが
            始まらないブラウザがあるので、透明にして端に逃がす。 */}
        {nextClip && (
          <video
            key={`pre-${nextClip.video}`}
            src={nextClip.video}
            preload="auto"
            muted
            playsInline
            aria-hidden
            tabIndex={-1}
            className="pointer-events-none absolute top-0 left-0 size-px opacity-0"
          />
        )}

        {/* 映像には一切色を乗せない。撮って出しの色をそのまま見せる。
            上に載る文字とロゴは ap-on-media の影だけで読ませる。 */}

        {HERO_IS_PLACEHOLDER && (
          <div className="absolute top-24 right-6 z-[2] font-label text-[9px] tracking-[0.1em] text-pale/60">
            PLACEHOLDER — 差し替え予定
          </div>
        )}

        <div className="ap-fade absolute inset-0 flex flex-col items-center justify-center gap-6">
          {/* 映像の上なので白抜き版を使う（spec §3.6）。
              横組みのため、縦に高い旧マークより小さめの見え方になる。 */}
          <Image
            src="/logo/whitecoltdlogo.png"
            alt={company.name}
            width={1800}
            height={604}
            priority
            className="h-auto w-[200px] [filter:drop-shadow(0_2px_6px_rgba(22,25,26,0.55))_drop-shadow(0_8px_40px_rgba(22,25,26,0.45))] md:w-[300px]"
          />
        </div>

        {/* 自動再生を止める手段。動きを減らしたい人のための逃げ道なので、
            装飾を足さず文字だけで置く。 */}
        {clip && (
          <button
            type="button"
            onClick={togglePlay}
            className="ap-on-media absolute bottom-24 left-5 font-label text-[11px] tracking-[0.24em] text-pale/85 transition-colors hover:text-pale md:bottom-28 md:left-16"
          >
            {playing ? "PAUSE" : "PLAY"}
          </button>
        )}

        {/* クライアントロゴ。ロゴの色は改変しない（利用規定に触れるため）。
            そのぶん暗い映像の上では濃色のロゴが沈むので、淡霧の帯を
            敷いてその上に置く。2セット並べて半分ぶん動かし継ぎ目を消す。
            パネル（z-7）より下の z-2 なので、開くと右側は隠れる。 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden bg-pale/70 py-5">
          <div className="ap-marquee flex w-max items-center gap-14 md:gap-20">
            {marqueeLogos.map((c, i) => (
              <Image
                key={`${c.logo}-${i}`}
                src={c.logo}
                alt={i < clients.length ? c.name : ""}
                aria-hidden={i >= clients.length}
                width={c.w}
                height={c.h}
                /* SVG は画像最適化を通すと 400 が返る。生のまま配信する。 */
                unoptimized={c.logo.endsWith(".svg")}
                /* sizes を書かないと最大幅（3840px）で焼かれる。
                   実寸は 180px 止まりなので、そのぶんだけ取る。 */
                sizes="200px"
                /* 帯はヒーローと同時に見えている。遅延させると
                   読み込み中だけ帯が空になる。1周目だけ先に読む。 */
                loading={i < clients.length ? "eager" : "lazy"}
                /* 高さで揃え、横長のものだけ幅で頭打ちにする。縦横比は
                   object-contain が守るので、潰れずに背だけ低くなる。 */
                className="h-10 w-auto max-w-[140px] object-contain md:h-14 md:max-w-[180px]"
              />
            ))}
          </div>
        </div>

        {/* 映像の上なので塗りは敷かず、文字の影だけで読ませる（ap-on-media）。
            実績が先、相談が後。まだ何も見ていない人にいきなり相談を
            迫らない順番にする。 */}
        <div className="ap-on-media absolute right-5 bottom-24 flex gap-7 font-label text-[11px] tracking-[0.12em] md:right-16 md:bottom-28">
          <Link
            href="/works"
            className="group flex items-center gap-1.5 border-b border-pale/50 pb-1 text-pale"
          >
            実績を見る
            <span
              aria-hidden
              className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
          <Link
            href="/contact"
            className="group flex items-center gap-1.5 border-b border-pale/50 pb-1 text-pale"
          >
            相談する
            <span
              aria-hidden
              className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>

        {/* ── スライドインパネル ──

            閉じている間も DOM に置いたままにして hidden で隠す。
            開いたときに初めて生成する作りだと、理念・事業内容・会社概要の
            文章が HTML に一文字も載らない。検索エンジンはページを開いても
            クリックはしないので、企画の話が検索結果に出ない。リンクを
            共有した相手が最初に見るのもヘッダーの数語だけになる。

            見た目と動きは変えない。hidden が外れるのと同時に ap-panel-in が
            付くので、スライドインもこれまでどおり走る。 */}
        {panelOpen && (
          <div
            onClick={close}
            aria-hidden
            className="absolute inset-0 z-[6] bg-ink/20"
          />
        )}
        <div hidden={!panelOpen}>
            <div
              role="dialog"
              aria-modal="true"
              aria-label={meta ? `${meta.label} パネル` : "メニュー"}
              ref={panelRef}
              className={`ap-scroll absolute inset-y-0 right-0 z-[7] w-full overflow-y-auto bg-pale/55 text-ink backdrop-blur-[8px] backdrop-saturate-[1.3] md:w-[clamp(520px,40vw,720px)] ${
                panelOpen ? "ap-panel-in" : ""
              }`}
            >
              {/* 上に浮いているヘッダー（APOLLO / メニュー）と重ならない
                  ぶんの余白。貼り付ける行とは分けておく。 */}
              <div aria-hidden className="h-25 md:h-30" />

              {/* 見出しと CLOSE は上に貼り付ける。実績パネルは縦に
                  3000px 以上あり、下まで行くと閉じる手段が画面から
                  消えてしまう。止まる位置は浮いているヘッダーの真下
                  （スマホ76px / PC103px）。

                  塗りは濃いめにする。パネルと同じ55%だと、下を流れる
                  カードの写真や文字が透けて見出しが読めなくなる。 */}
              <div className="sticky top-[76px] z-10 flex items-center justify-between bg-pale/90 px-5 py-3 backdrop-blur-[8px] md:top-[103px] md:px-12">
                <div className="font-label text-[11px] tracking-[0.28em] text-blue-panel">
                  {meta ? meta.label : "MENU"}
                </div>
                <div className="flex items-center gap-5">
                  {fullPageHref && (
                    <Link
                      href={fullPageHref}
                      title="フルページで見る"
                      className="flex shrink-0 items-center gap-1.5 border-b border-mist-panel pb-[3px] font-label text-[11px] tracking-[0.1em] whitespace-nowrap text-mist-panel"
                    >
                      ↗ フルページ
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={close}
                    className="border-b border-mist-panel pb-[3px] font-label text-[11px] tracking-[0.1em] text-mist-panel"
                  >
                    CLOSE
                  </button>
                </div>
              </div>

              <div className="px-5 pt-8 pb-24 md:px-12">
                {open === "menu" ? (
                  <nav className="flex flex-col">
                    {navItems.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setOpen(key)}
                        className="border-t border-fog py-6 text-left font-label text-[22px] font-normal tracking-[0.2em]"
                      >
                        {navLabel[key]}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setOpen("contact")}
                      className="border-t border-b border-fog py-6 text-left font-label text-[22px] font-normal tracking-[0.2em] text-blue-panel"
                    >
                      {navLabel.contact}
                    </button>
                  </nav>
                ) : (
                  <>
                    {/* お問合せは見出しを持たない。CONTACT のラベルで足りる */}
                    {panelTitles.map(([key, title]) => (
                      <h2
                        key={key}
                        hidden={open !== key}
                        className="ap-fade-q font-display text-[26px] leading-[1.5] font-medium tracking-[0.06em] whitespace-pre-line md:text-[34px]"
                      >
                        {title}
                      </h2>
                    ))}

                    {/* 文章だけの3つは常に描いて表示のみ切り替える。
                        HTML に載せるのが目的なので、重い実績（画像）と
                        お問合せ（フォーム）は従来どおり開いたときだけ作る。 */}
                    <div hidden={open !== "vision"}>
                      <VisionPanel />
                    </div>
                    <div hidden={open !== "company"}>
                      <CompanyPanel />
                    </div>
                    <div hidden={open !== "approach"}>
                      <ApproachPanel works={works} />
                    </div>

                    {open === "works" && <WorksPanel works={works} />}
                    {open === "contact" && (
                      <div className="mt-6">
                        <div className="mt-8">
                          <ContactForm variant="panel" />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

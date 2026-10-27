"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ContactForm from "@/components/contact-form";
import { ApproachPanel, CompanyPanel, VisionPanel, WorksPanel } from "@/components/panels";
import { navLabel, navOrder } from "@/lib/nav";
import {
  approach,
  clients,
  company,
  contactCopy,
  paragraphs,
  vision,
} from "@/lib/site-content";
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

/* 2回目以降に戻ってきたときに流す短尺。ループはせず、01→13 の順に
   流していき、13の次は01に戻る。並び順は組んだとおりに保つ。 */
const HERO_SHORTS: HeroClip[] = Array.from({ length: 13 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { video: `/hero/short-${n}.mp4`, poster: `/hero/short-${n}.jpg`, alt: "" };
});

/* 来訪ごとに変わるのは入り口の番号だけ。8から入れば
   8,9,…,13,1,…,7 と回る。毎回1本目から始まると
   「いつも同じサイト」に見えてしまうため、入り口はずらす。 */
function randomStart(): number {
  return Math.floor(Math.random() * HERO_SHORTS.length);
}

const nextIndex = (i: number) => (i + 1) % HERO_SHORTS.length;

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

/* ── スマホの下段で使うもの ──

   スマホは映像を横幅ぴったりの 16:9 で見せるので、画面の下4分の3が余る。
   そこを地の色で埋めると「終わっているページ」に見えるため、MENU の裏に
   隠れている行き先を表に出し、既定で理念を置く。
   新しい文章は一切書かない。すべて既存の原稿を借りる。 */

/* 既定で出す理念。原稿はパネルと同じもので、ここに置くのは2段落目。
   1段落目は「ゴールは見えない」という前置きで、単独で読むと何をする
   会社か分からない。続きはパネルで読む。 */
const visionLead = paragraphs(vision.body)[1];

// 並べる行き先。理念は本文として上に出しているので外す。
const mobileMenu: PanelKey[] = [...navItems.filter((k) => k !== "vision"), "contact"];

/* 英字ラベルに添える日本語。パネルの見出しをそのまま使う。
   お問合せだけは見出しを持たないので、ヒーローのリンクで使っている
   「相談する」を借りる（PCでは出ているが、スマホでは隠すため）。 */
const mobileMenuTitle: Record<string, string> = {
  works: panelMeta.works.title,
  approach: panelMeta.approach.title,
  company: panelMeta.company.title,
  contact: "相談する",
};

type OpenKey = PanelKey | "menu";

function isPanelKey(value: string | null): value is PanelKey {
  return value !== null && value in panelMeta;
}

export default function HomeExperience({ works }: { works: Work[] }) {
  const [open, setOpen] = useState<OpenKey | null>(null);
  /* いま流している位置。intro のあいだは紹介映像を出していて、
     i は「紹介映像が終わったら入る番号」を押さえている。 */
  const [hero, setHero] = useState<{ intro: boolean; i: number } | null>(null);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const clip = hero ? (hero.intro ? HERO_INTRO : HERO_SHORTS[hero.i]) : null;
  // 次に流す1本。先に決めておいて裏で読ませる（切り替わりで止まらないように）
  const nextClip = hero
    ? HERO_SHORTS[hero.intro ? hero.i : nextIndex(hero.i)]
    : null;

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- クライアント固有の値をマウント時に一度だけ決める
    setHero({ intro: !shown, i: randomStart() });
  }, []);

  /* 1本終わったら次の番号へ。13まで行ったら01に戻るだけで、順番は
     入れ替えない。紹介映像のあともここを通るので、初回の人も
     30秒後からは短尺が流れ続ける。 */
  const advance = useCallback(() => {
    setHero((h) => (h ? { intro: false, i: h.intro ? h.i : nextIndex(h.i) } : h));
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
      {/* スマホは映像を画面上端の 16:9 の帯に収めるので、残りの下側に
          地の色が必要になる。墨にするのは白抜きロゴをそのまま使える
          唯一の色だから（ロゴの色は改変しない）。PCは全面が映像なので
          地は見えない。 */}
      {/* スマホは映像が上の帯だけなので、下段の地の色が必要になる。
          サイト全体と同じ淡霧にして、パネルを開いたときに地続きに見せる。
          PCは全面が映像なので地は見えない。 */}
      <div className="relative h-[100svh] min-h-[420px] overflow-hidden bg-pale md:bg-transparent">
        {/* 動画は自前の動きを持つので apZoom はかけない。
            poster が即座に出るのでフェードインは挟まない（非表示タブで
            トランジションが止まると真っ黒のままになるため）。 */}
        {clip && (
          <video
            key={clip.video}
            ref={videoRef}
            /* スマホは横幅に合わせた 16:9 の帯。縦長の画面に object-cover で
               敷くと中央の4分の1だけが残り、撮った画角が伝わらない。
               帯の比率は素材と同じなので、ここでは切り取りが起きない。
               PC（md以上）は従来どおり全面に敷く。 */
            className="absolute inset-x-0 top-0 aspect-video w-full object-cover md:inset-0 md:aspect-auto md:size-full"
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

        {/* ロゴは映像の上に重ねる。スマホでは映像が上の帯だけなので、
            その帯の中央に置く。大きさはPCと同じ比率にする
            （PCは画面幅1440に対して300px ＝ 約21%）。 */}
        <div className="ap-fade absolute inset-x-0 top-0 flex h-[56.25vw] flex-col items-center justify-center gap-6 md:h-full">
          {/* 映像の上なので白抜き版を使う（spec §3.6）。
              横組みのため、縦に高い旧マークより小さめの見え方になる。 */}
          <Image
            src="/logo/whitecoltdlogo.png"
            alt={company.name}
            width={1800}
            height={604}
            priority
            className="h-auto w-[42vw] max-w-[180px] [filter:drop-shadow(0_2px_6px_rgba(22,25,26,0.55))_drop-shadow(0_8px_40px_rgba(22,25,26,0.45))] md:w-[300px] md:max-w-none"
          />
        </div>

        {/* 自動再生を止める手段。動きを減らしたい人のための逃げ道なので、
            装飾を足さず文字だけで置く。 */}
        {clip && (
          <button
            type="button"
            onClick={togglePlay}
            /* 止める相手は映像なので、映像の上に置く。スマホの下段は
               淡霧なので、ここに置くと白文字が消える。 */
            className="ap-on-media absolute top-[calc(56.25vw-34px)] left-5 font-label text-[11px] tracking-[0.24em] text-pale/85 transition-colors hover:text-pale md:top-auto md:bottom-28 md:left-16"
          >
            {playing ? "PAUSE" : "PLAY"}
          </button>
        )}

        {/* クライアントロゴ。ロゴの色は改変しない（利用規定に触れるため）。
            そのぶん暗い映像の上では濃色のロゴが沈むので、淡霧の帯を
            敷いてその上に置く。2セット並べて半分ぶん動かし継ぎ目を消す。
            パネル（z-7）より下の z-2 なので、開くと右側は隠れる。 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] overflow-hidden border-t border-fog bg-pale/70 py-5 short:py-3 md:border-0">
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
                className="h-10 w-auto max-w-[140px] object-contain short:h-9 md:h-14 md:max-w-[180px]"
              />
            ))}
          </div>
        </div>

        {/* 映像の上なので塗りは敷かず、文字の影だけで読ませる（ap-on-media）。
            実績が先、相談が後。まだ何も見ていない人にいきなり相談を
            迫らない順番にする。 */}
        {/* スマホでは下段の一覧に WORKS と CONTACT が出るので、同じ行き先を
            2つ置かない。PCは下段を持たないのでこれまでどおり。 */}
        <div className="ap-on-media absolute right-5 bottom-24 hidden gap-7 font-label text-[11px] tracking-[0.12em] md:right-16 md:bottom-28 md:flex">
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

        {/* ── スマホの下段：既定の理念と、行き先の一覧 ──

            映像の帯とクライアントロゴの帯にはさまれた領域。左寄せにして
            余白を主役にする。PCは映像の上にロゴだけが載る構成なので出さない。 */}
        <div className="absolute inset-x-0 top-[56.25vw] bottom-20 z-[3] flex flex-col justify-between px-5 pt-10 pb-5 short:bottom-[60px] short:pt-4 short:pb-3 md:hidden">
          <div>
            <div className="font-label text-[10px] tracking-[0.28em] text-blue">
              {vision.label}
            </div>
            <h2 className="mt-3.5 text-[25px] leading-[1.45] tracking-[0.03em] text-ink short:mt-2 short:text-[21px]">
              {vision.title}
            </h2>
            <p className="mt-4 max-w-[46ch] text-[12.5px] leading-[2.1] text-body short:leading-[1.85]">
              {visionLead}
            </p>
            <button
              type="button"
              onClick={() => setOpen("vision")}
              /* 表記はパネルの「VIEW ALL」に揃える。矢印は ↗ ではなく →
                 にする。↗ は別ページへ出ることを指していて、ここは
                 その場でパネルが開くため。 */
              className="mt-5 inline-flex items-center gap-1.5 border-b border-fog pb-1 font-label text-[11px] tracking-[0.1em] text-ink short:mt-2"
            >
              VIEW ALL
              <span aria-hidden className="text-[10px]">
                →
              </span>
            </button>
          </div>

          <nav className="-mx-5">
            {mobileMenu.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setOpen(key)}
                className="flex w-full items-baseline justify-between border-t border-fog px-5 py-3.5 text-left short:py-3"
              >
                <span className="font-label text-[12px] tracking-[0.22em] text-ink">
                  {navLabel[key]}
                </span>
                <span className="text-[11px] tracking-[0.04em] text-mist">
                  {mobileMenuTitle[key]}
                </span>
              </button>
            ))}
          </nav>
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
                      /* このボタンが出るのは実績パネルだけ。7件の抜粋から
                         37件すべてへ、という動きをそのまま言う。
                         「フルページ」は作り手の言葉で、パネルとページの
                         区別を知らない人には何が起きるか伝わらない。 */
                      title="すべての実績を見る"
                      className="flex shrink-0 items-center gap-1.5 border-b border-mist-panel pb-[3px] font-label text-[11px] tracking-[0.1em] whitespace-nowrap text-mist-panel"
                    >
                      ↗ VIEW ALL
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

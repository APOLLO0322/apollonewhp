import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageCta from "@/components/page-cta";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import Linkify from "@/components/linkify";
import WorkMeta from "@/components/work-meta";
import {
  categoryLabel,
  getWork,
  getWorkNeighbours,
  getWorks,
  watchEmbedUrl,
  workMeta,
} from "@/lib/works";

// microCMS の更新を再デプロイなしで反映する
export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const works = await getWorks();
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWork(slug);
  if (!work) return { title: "実績が見つかりません" };
  return {
    title: work.title,
    description: work.lead ?? `${work.title}｜${workMeta(work)}`,
    alternates: { canonical: `/works/${work.slug}` },
    openGraph: { images: [work.thumbnail] },
  };
}

/* 値は文字列か配列。配列はスラッシュで区切って出す
   （配列をそのまま出すと「企画編集撮影」と繋がってしまう）。 */
function Credit({
  label,
  value,
}: {
  label: string;
  value?: string | string[];
}) {
  const text = Array.isArray(value) ? value.join(" / ") : value;
  if (!text) return null;
  return (
    <div className="flex items-center justify-between gap-6 border-t border-fog py-4 last:border-b">
      <span className="shrink-0 font-label text-[11px] text-mist">{label}</span>
      <span className="text-right text-sm leading-[1.9]">{text}</span>
    </div>
  );
}

export default async function WorkDetailPage({ params }: Params) {
  const { slug } = await params;
  const work = await getWork(slug);
  if (!work) notFound();

  const { prev, next } = await getWorkNeighbours(slug);
  const watchEmbed = watchEmbedUrl(work);
  const stills = work.stills ?? [];

  return (
    <>
      <SiteHeader current="works" />

      <article className="mx-auto max-w-[1440px]">
        <div className="border-b border-fog px-5 py-5 font-label text-[11px] tracking-[0.1em] text-mist md:px-16">
          <Link href="/works">WORKS</Link>
          <span className="px-2">/</span>
          <span className="text-ink">{work.title}</span>
        </div>

        <header className="border-b border-fog px-5 pt-14 pb-12 md:px-16 md:pt-22">
          <WorkMeta work={work} size="md" />
          <h1 className="mt-5 font-display text-[24px] leading-[1.6] font-medium tracking-[0.06em] md:text-[32px]">
            {work.title}
          </h1>
          {work.lead && (
            <p className="mt-5 max-w-[560px] text-base leading-[2.1] text-mist">
              {work.lead}
            </p>
          )}
        </header>

        {/* 埋め込める配信元（Vimeo / YouTube）なら開いた時点で1回再生する。
            自動再生はブラウザの規定で無音でないと止まるので muted で始め、
            操作パネルから音を出せるようにする。

            Instagram は埋め込みで再生できないので、静止画と外部リンク。
            写真だけの案件は静止画のみ。「準備中」のような文言は出さない
            （動画が存在しない案件にとっては誤解を招くため）。 */}
        {/* 映像は本文と同じ幅に収める。画面いっぱいに出すと、下の
            OVERVIEW と左端が揃わず、1枚だけ別の紙に載っているように見える。
            区切りの罫線だけは外側に出して、他の節と同じく端まで引く。 */}
        <div className="border-b border-fog px-5 py-12 md:px-16 md:py-14">
          {watchEmbed ? (
            <div className="relative aspect-video overflow-hidden bg-ink">
              <iframe
                src={watchEmbed}
                title={`${work.title} の映像`}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
                className="absolute inset-0 size-full border-0"
              />
            </div>
          ) : (
            <div className="relative aspect-video overflow-hidden bg-ink">
              <Image
                src={work.thumbnail}
                alt=""
                fill
                priority
                sizes="(max-width: 767px) 100vw, (max-width: 1440px) calc(100vw - 128px), 1312px"
                className="ap-ken object-cover"
              />
              {work.videoUrl && (
                <a
                  href={work.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ap-on-media absolute inset-0 flex flex-col items-center justify-center gap-4.5"
                >
                  <span className="flex size-[70px] items-center justify-center rounded-full border border-pale/85 text-[19px] text-pale [filter:drop-shadow(0_1px_3px_rgba(22,25,26,0.7))]">
                    ▶
                  </span>
                  <span className="font-label text-[11px] tracking-[0.24em] text-pale">
                    PLAY
                  </span>
                </a>
              )}
            </div>
          )}
        </div>

        <div className="grid border-b border-fog lg:grid-cols-[1.5fr_1fr]">
          {work.overview && (
            <div className="border-b border-fog px-5 py-14 md:px-16 md:py-20 lg:border-r lg:border-b-0">
              <div className="mb-7 font-label text-[11px] tracking-[0.16em] text-mist">
                OVERVIEW
              </div>
              <div className="whitespace-pre-line text-[15px] leading-[2.4] text-body">
                <Linkify text={work.overview} />
              </div>
            </div>
          )}
          <div className="px-5 py-14 md:px-16 md:py-20">
            <div className="mb-3.5 font-label text-[11px] tracking-[0.16em] text-mist">
              CREDITS
            </div>
            <div className="flex flex-col">
              <Credit label="CLIENT" value={work.client} />
              <Credit label="CATEGORY" value={categoryLabel[work.category]} />
              <Credit label="SCOPE" value={work.scope} />
            </div>
            {/* このページで一番押してほしいもの。サイト全体が寒色で
                通っているので、ここだけ熾火を置いて最後の一押しにする。
                他の節より1.5倍の高さを取る。 */}
            <Link
              href="/contact"
              className="mt-10 flex items-center justify-center gap-2.5 rounded-[3px] bg-ember px-6 py-6 text-[16px] tracking-[0.08em] text-pale shadow-[0_2px_10px_rgba(168,84,49,0.25)] transition-colors duration-300 hover:bg-ember-deep"
            >
              制作のご相談
              <span aria-hidden className="font-label text-xs">
                →
              </span>
            </Link>
          </div>
        </div>

        {stills.length > 0 && (
          <div className="border-b border-fog">
            <div className="px-5 pt-14 pb-7 font-label text-[11px] tracking-[0.16em] text-mist md:px-16">
              STILLS
            </div>
            {/* 本編の映像と同じく本文の幅に収める。ここだけ画面いっぱいだと
                1節だけ組みが変わって見える。 */}
            <div className="grid gap-5 px-5 pb-14 sm:grid-cols-2 md:px-16 md:pb-16">
              {stills.map((src) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1440px) calc((100vw - 148px) / 2), 646px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <nav className="grid border-b border-fog font-label text-xs tracking-[0.1em] text-mist sm:grid-cols-2">
          <Link
            href={prev ? `/works/${prev.slug}` : "/works"}
            className="border-b border-fog px-5 py-8 md:px-16 sm:border-r sm:border-b-0"
          >
            ← {prev ? "前の実績" : "一覧に戻る"}
          </Link>
          <Link
            href={next ? `/works/${next.slug}` : "/works"}
            className="px-5 py-8 sm:text-right md:px-16"
          >
            {next ? "次の実績" : "一覧に戻る"} →
          </Link>
        </nav>

        <PageCta heading="伝えたいのは、あなたの物語です。" />
      </article>

      <SiteFooter />
    </>
  );
}

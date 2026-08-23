import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageCta from "@/components/page-cta";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getWork, getWorkNeighbours, getWorks, workMeta } from "@/lib/works";

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

function Credit({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-6 border-t border-fog py-4 last:border-b">
      <span className="font-inter text-[11px] text-mist">{label}</span>
      <span className="text-right text-sm">{value}</span>
    </div>
  );
}

export default async function WorkDetailPage({ params }: Params) {
  const { slug } = await params;
  const work = await getWork(slug);
  if (!work) notFound();

  const { prev, next } = await getWorkNeighbours(slug);
  const stills = work.stills ?? [];

  return (
    <>
      <SiteHeader current="works" />

      <article className="mx-auto max-w-[1440px]">
        <div className="border-b border-fog px-5 py-5 font-inter text-[11px] tracking-[0.1em] text-mist md:px-16">
          <Link href="/works">WORKS</Link>
          <span className="px-2">/</span>
          <span className="text-ink">{work.title}</span>
        </div>

        <header className="border-b border-fog px-5 pt-14 pb-12 md:px-16 md:pt-22">
          <div className="font-inter text-[11px] tracking-[0.24em] text-blue">
            {workMeta(work)}
          </div>
          <h1 className="mt-5 font-serif-jp text-[30px] leading-[1.5] font-medium md:text-[44px]">
            {work.title}
          </h1>
          {work.lead && (
            <p className="mt-5 max-w-[560px] text-base leading-[2.1] text-mist">{work.lead}</p>
          )}
        </header>

        {/* 動画未支給のものはサムネイル + PLACEHOLDER 表示（README §7） */}
        <div className="relative aspect-video overflow-hidden border-b border-fog bg-ink">
          <Image
            src={work.thumbnail}
            alt=""
            fill
            priority
            sizes="100vw"
            className="ap-ken object-cover opacity-90"
          />
          <div aria-hidden className="absolute inset-0 bg-linear-to-b from-ink/10 to-ink/30" />
          {work.videoUrl ? (
            <a
              href={work.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex flex-col items-center justify-center gap-4.5"
            >
              <span className="flex size-[70px] items-center justify-center rounded-full border border-pale/85 text-[19px] text-pale">
                ▶
              </span>
              <span className="font-inter text-[11px] tracking-[0.24em] text-pale/85">PLAY</span>
            </a>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4.5">
              <span className="font-inter text-[11px] tracking-[0.24em] text-pale/85">
                MOVIE — 準備中
              </span>
            </div>
          )}
        </div>

        <div className="grid border-b border-fog lg:grid-cols-[1.5fr_1fr]">
          {work.overview && (
            <div className="border-b border-fog px-5 py-14 md:px-16 md:py-20 lg:border-r lg:border-b-0">
              <div className="mb-7 font-inter text-[11px] tracking-[0.16em] text-mist">OVERVIEW</div>
              <div className="whitespace-pre-line text-[15px] leading-[2.4] text-body">
                {work.overview}
              </div>
            </div>
          )}
          <div className="px-5 py-14 md:px-16 md:py-20">
            <div className="mb-3.5 font-inter text-[11px] tracking-[0.16em] text-mist">CREDITS</div>
            <div className="flex flex-col">
              <Credit label="CLIENT" value={work.client} />
              <Credit label="CATEGORY" value={work.category} />
              <Credit label="YEAR" value={work.year} />
              <Credit label="SCOPE" value={work.scope} />
            </div>
            <Link
              href="/contact"
              className="mt-8 block border border-blue p-4 text-center font-inter text-xs tracking-[0.1em] text-blue"
            >
              同じような制作を相談する →
            </Link>
          </div>
        </div>

        {stills.length > 0 && (
          <div className="border-b border-fog">
            <div className="px-5 pt-14 pb-7 font-inter text-[11px] tracking-[0.16em] text-mist md:px-16">
              STILLS
            </div>
            <div className="grid sm:grid-cols-2">
              {stills.map((src) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden">
                  <Image src={src} alt="" fill sizes="(max-width: 639px) 100vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        <nav className="grid border-b border-fog font-inter text-xs tracking-[0.1em] text-mist sm:grid-cols-2">
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

        <PageCta heading="あなたの想いも、一本に。" />
      </article>

      <SiteFooter />
    </>
  );
}

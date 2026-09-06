import type { Metadata } from "next";
import PageCta from "@/components/page-cta";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import WorksGrid from "@/components/works-grid";
import { getWorks } from "@/lib/works";

// microCMS の更新を再デプロイなしで反映する
export const revalidate = 60;

export const metadata: Metadata = {
  title: "制作実績",
  description:
    "株式会社APOLLOの制作実績。映像・写真制作、SNS運用支援、ブランディングの事例をご覧いただけます。",
  alternates: { canonical: "/works" },
};

export default async function WorksPage() {
  const works = await getWorks();

  return (
    <>
      <SiteHeader current="works" />

      <div className="mx-auto max-w-[1440px]">
        <div className="px-5 pt-16 pb-10 md:px-16 md:pt-24">
          <div className="font-label text-[11px] tracking-[0.24em] text-blue">WORKS</div>
          <h1 className="mt-5 font-display text-[36px] leading-[1.3] font-medium tracking-[0.06em] md:text-[52px]">
            制作実績
          </h1>
        </div>

        <WorksGrid works={works} />

        <PageCta heading="伝えたいのは、あなたの物語です。" />
      </div>

      <SiteFooter />
    </>
  );
}

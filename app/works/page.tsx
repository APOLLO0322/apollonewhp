import type { Metadata } from "next";
import PageCta from "@/components/page-cta";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import WorksGrid from "@/components/works-grid";
import { clients } from "@/lib/site-content";
import { getWorks } from "@/lib/works";

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
          <div className="font-inter text-[11px] tracking-[0.24em] text-blue">WORKS</div>
          <h1 className="mt-5 font-serif-jp text-[36px] leading-[1.3] font-medium md:text-[52px]">
            制作実績
          </h1>
        </div>

        {/* 実ロゴ未支給のため文字組みで仮置き（README §7-4） */}
        <div className="flex flex-wrap items-center gap-x-14 gap-y-9 border-b border-fog px-5 pb-12 md:px-16">
          <div className="w-full font-inter text-[11px] tracking-[0.2em] text-mist">CLIENTS</div>
          {clients.map((c) => (
            <div
              key={c.name}
              className={
                c.type === "serif"
                  ? "font-serif-jp text-[17px] md:text-[19px]"
                  : "font-inter text-[14px] font-medium md:text-[15px]"
              }
            >
              {c.name}
            </div>
          ))}
        </div>

        <div className="pt-10">
          <WorksGrid works={works} />
        </div>

        <PageCta heading="次は、あなたの物語をつくりに。" />
      </div>

      <SiteFooter />
    </>
  );
}

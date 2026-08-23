import type { Metadata } from "next";
import Image from "next/image";
import PageCta from "@/components/page-cta";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import WorksGrid from "@/components/works-grid";
import { clients } from "@/lib/site-content";
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
          <div className="font-inter text-[11px] tracking-[0.24em] text-blue">WORKS</div>
          <h1 className="mt-5 font-serif-jp text-[36px] leading-[1.3] font-medium md:text-[52px]">
            制作実績
          </h1>
        </div>

        {/* 実ロゴ未支給。public/clients/ の SAMPLE 入りSVGを仮置き（README §7-4） */}
        <div className="border-b border-fog px-5 pb-12 md:px-16">
          <div className="mb-7 font-inter text-[11px] tracking-[0.2em] text-mist">CLIENTS</div>
          <ul className="flex list-none flex-wrap items-center gap-x-10 gap-y-6 p-0">
            {clients.map((c) => (
              <li key={c.name}>
                <Image
                  src={c.logo}
                  alt={c.name}
                  width={260}
                  height={76}
                  className="h-[60px] w-auto opacity-80 md:h-[76px]"
                />
              </li>
            ))}
          </ul>
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

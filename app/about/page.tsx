import type { Metadata } from "next";
import PageCta from "@/components/page-cta";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { aboutMessage, company, companyRows, vision } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "理念・会社概要",
  description:
    "株式会社APOLLOの理念と会社概要。愛媛・松山を拠点に、映像・写真制作とSNS運用支援で地域課題の解決に取り組みます。",
  alternates: { canonical: "/about" },
};

// 会社概要は lib/site-content.ts の companyRows を正とし、ページ間で食い違わせない。
const rows = [...companyRows, { k: "連絡先", v: company.mail }];

export default function AboutPage() {
  return (
    <>
      <SiteHeader current="about" />

      <div className="mx-auto max-w-[1440px]">
        <div className="border-b border-fog px-5 pt-16 pb-14 md:px-16 md:pt-24 md:pb-18">
          <div className="font-inter text-[11px] tracking-[0.24em] text-blue">ABOUT</div>
          <h1 className="mt-5 font-serif-jp text-[38px] leading-[1.3] font-medium md:text-[56px]">
            会社概要
          </h1>
        </div>

        {/* 理念。旧サイトの見出し画像は文字が焼き込まれていて使えないため、
            差し替え素材が出るまでは写植主体で組む（ラベル左 / 本文右） */}
        <section
          id="vision"
          className="grid scroll-mt-20 gap-y-6 border-b border-fog px-5 py-16 md:px-16 md:py-24 lg:grid-cols-[220px_1fr] lg:gap-x-16"
        >
          <div className="font-inter text-[11px] tracking-[0.16em] text-mist">VISION / 理念</div>
          <div>
            <h2 className="font-serif-jp text-[28px] leading-[1.7] font-medium tracking-[0.04em] md:text-[38px]">
              {vision.title}
            </h2>
            <p className="mt-7 max-w-[560px] whitespace-pre-line text-[15px] leading-[2.3] text-mist">
              {vision.body}
            </p>
          </div>
        </section>

        {/* 代表メッセージ */}
        <section
          id="message"
          className="grid scroll-mt-20 gap-y-6 border-b border-fog px-5 py-16 md:px-16 md:py-24 lg:grid-cols-[220px_1fr] lg:gap-x-16"
        >
          <div className="font-inter text-[11px] tracking-[0.16em] text-blue">
            MESSAGE / 代表メッセージ
          </div>
          <div>
            <h2 className="whitespace-pre-line font-serif-jp text-[21px] leading-[1.9] font-medium tracking-[0.04em] md:text-[26px]">
              {aboutMessage.heading}
            </h2>
            <p className="mt-7 max-w-[620px] whitespace-pre-line text-[15px] leading-[2.4] tracking-[0.02em] text-body">
              {aboutMessage.body}
            </p>
            <div className="mt-9 flex items-baseline gap-4">
              <span className="font-inter text-[11px] tracking-[0.1em] text-mist">代表取締役</span>
              <span className="font-serif-jp text-xl tracking-[0.1em]">池口祐太</span>
            </div>
          </div>
        </section>

        {/* 会社概要 */}
        <section className="grid gap-y-6 border-b border-fog px-5 py-16 md:px-16 md:py-24 lg:grid-cols-[220px_1fr] lg:gap-x-16">
          <div className="font-inter text-[11px] tracking-[0.16em] text-mist">
            COMPANY / 会社概要
          </div>
          <dl className="flex max-w-[680px] flex-col">
            {rows.map((row) => (
              <div
                key={row.k}
                className="grid grid-cols-[100px_1fr] gap-4 border-t border-fog py-5 last:border-b md:grid-cols-[180px_1fr]"
              >
                <dt className="text-sm text-mist">{row.k}</dt>
                <dd className="m-0 whitespace-pre-line text-[15px] leading-[1.9]">{row.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <PageCta heading="まずは、会ってみませんか。" />
      </div>

      <SiteFooter />
    </>
  );
}

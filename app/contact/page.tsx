import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { company, contactCopy } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "お問合せ",
  description:
    "株式会社APOLLOへのお問合せ。映像・写真制作、SNS運用支援のご相談を承ります。愛媛・松山。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <SiteHeader current="contact" />

      <div className="mx-auto max-w-[1440px]">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-between bg-ink px-5 py-16 text-pale md:px-16 md:py-24">
            <div>
              <div className="font-inter text-[11px] tracking-[0.24em] text-blue">
                {contactCopy.label}
              </div>
              <h1 className="mt-6 whitespace-pre-line font-serif-jp text-[28px] leading-[1.6] font-medium tracking-[0.04em] md:text-[36px]">
                {contactCopy.title}
              </h1>
              <p className="mt-6 max-w-[340px] text-sm leading-[2.2] text-pale/72">
                {contactCopy.lead}
              </p>
            </div>
            <div className="mt-14 flex flex-col gap-5 font-inter text-xs tracking-[0.06em]">
              <div className="border-t border-pale/20 pt-4">
                <span className="text-pale/50">MAIL</span>
                <br />
                <a href={`mailto:${company.mail}`} className="text-sm">
                  {company.mail}
                </a>
              </div>
              <div className="border-t border-pale/20 pt-4">
                <span className="text-pale/50">HOURS</span>
                <br />
                <span className="text-sm">{company.hours}</span>
              </div>
            </div>
          </div>

          <div className="px-5 py-16 md:px-16 md:py-24">
            <ContactForm variant="page" />
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}

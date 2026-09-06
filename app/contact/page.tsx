import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { contactCopy } from "@/lib/site-content";

/* 左の列に流す縦動画。public/contact/ に置いてここにパスを書くと、
   墨のべた塗りから映像に切り替わる。未設定なら従来どおり墨のまま。
   ヒーローと同じく H.264 / 音声なし / 3.5Mbps 程度に変換してから置く
   （tools/transcode.swift を使う）。縦位置は 9:16 を想定。 */
const CONTACT_VIDEO: string | null = "/contact/contact.mp4";

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
          <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-ink px-5 py-16 text-pale md:px-16 md:py-24 lg:min-h-0">
            {CONTACT_VIDEO && (
              <>
                <video
                  className="absolute inset-0 size-full object-cover"
                  src={CONTACT_VIDEO}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
                {/* 映像の上でも文字が読めるよう、上下を締める */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-b from-ink/60 via-ink/25 to-ink/70"
                />
              </>
            )}
            <div className="relative">
              <div className="ap-on-media font-label text-[11px] tracking-[0.24em] text-pale">
                {contactCopy.label}
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

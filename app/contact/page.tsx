import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

/* 左の列に流す縦動画。public/contact/ に置いてここにパスを書く。
   未設定なら墨のべた塗りになる。ヒーローと同じく H.264 / 音声なし /
   3.5Mbps 程度に変換してから置く（tools/transcode.swift を使う）。
   映像には色を乗せない。文字も載せないので暗幕も要らない。 */
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
        {/* 左の列は右の列の高さに合わせて伸び縮みする。送信後は右が
            「受け付けました」の一言になって短くなるので、何もしないと
            左の枠が横長に潰れ、縦の映像が帯のように切り抜かれる。
            最低の高さを持たせて、どちらの状態でも縦の枠を保つ。
            フォーム表示中は右のほうが高いので、この指定は効かない。 */}
        <div className="grid lg:min-h-[760px] lg:grid-cols-[0.85fr_1.15fr]">
          {/* 素材は 1080x1920 の縦。スマホで高さ280pxの横長の枠に入れると、
              縦の映像を横長に切り抜くことになって、何が写っているか
              分からなくなる。枠のほうを縦にする。
              横並びになる lg 以上では、右の列と同じ高さまで伸ばす。 */}
          <div className="relative aspect-[3/4] overflow-hidden bg-ink sm:aspect-[4/5] lg:aspect-auto lg:min-h-0">
            {CONTACT_VIDEO && (
              <video
                className="absolute inset-0 size-full object-cover"
                src={CONTACT_VIDEO}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            )}
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

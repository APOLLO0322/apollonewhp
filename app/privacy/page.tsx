import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import {
  policyContact,
  policyIntro,
  policySections,
} from "@/lib/privacy-policy";

export const metadata: Metadata = {
  title: "個人情報保護方針",
  description:
    "株式会社APOLLOの個人情報保護方針。取得する個人情報の利用目的、第三者への提供、開示・訂正の手続についてご案内します。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />

      <div className="mx-auto max-w-[1440px]">
        <div className="px-5 pt-16 pb-10 md:px-16 md:pt-24">
          <div className="font-label text-[11px] tracking-[0.24em] text-blue">
            PRIVACY POLICY
          </div>
          <h1 className="mt-5 font-display text-[28px] leading-[1.35] font-medium tracking-[0.06em] md:text-[40px]">
            個人情報保護方針
          </h1>
        </div>

        {/* 法務文書なので1カラムで通し、行間を広めに取って読ませる。
            幅は 720px 前後で頭打ちにする（1行が長いと目が戻れない）。 */}
        <div className="border-t border-fog px-5 py-14 md:px-16 md:py-20">
          <p className="max-w-[720px] text-[15px] leading-[2.2] text-body">
            {policyIntro}
          </p>

          {policySections.map((s) => (
            <section key={s.heading} className="mt-12 max-w-[720px] first:mt-0">
              <h2 className="font-display text-base leading-[1.7] font-medium tracking-[0.06em] text-ink md:text-lg">
                {s.heading}
              </h2>

              {s.body?.map((p) => (
                <p key={p} className="mt-4 text-[15px] leading-[2.2] text-body">
                  {p}
                </p>
              ))}

              {s.items && (
                <ul className="mt-4 flex list-none flex-col gap-2.5 p-0">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[15px] leading-[2.1] text-body"
                    >
                      <span aria-hidden className="shrink-0 text-fog">
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="mt-16 max-w-[720px] border-t border-fog pt-10">
            <h2 className="font-display text-base leading-[1.7] font-medium tracking-[0.06em] text-ink md:text-lg">
              お問合せ
            </h2>
            <p className="mt-4 text-[15px] leading-[2.2] text-body">
              {policyContact.lead}
            </p>

            <dl className="mt-7 flex flex-col">
              {policyContact.rows.map((row) => (
                <div
                  key={row.k}
                  className="grid grid-cols-[120px_1fr] items-baseline gap-4 border-t border-fog py-4 sm:grid-cols-[160px_1fr]"
                >
                  <dt className="font-label text-[11px] tracking-[0.08em] text-mist">
                    {row.k}
                  </dt>
                  <dd className="m-0 text-sm leading-[1.9] text-ink">{row.v}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[120px_1fr] items-baseline gap-4 border-t border-b border-fog py-4 sm:grid-cols-[160px_1fr]">
                <dt className="font-label text-[11px] tracking-[0.08em] text-mist">
                  お問い合わせ先
                </dt>
                <dd className="m-0 text-sm leading-[1.9]">
                  <a href={`mailto:${policyContact.mail}`} className="text-blue">
                    {policyContact.mail}
                  </a>
                </dd>
              </div>
            </dl>

            <p className="mt-8 font-label text-[11px] tracking-[0.08em] text-mist">
              制定 {policyContact.established}
            </p>
          </section>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}

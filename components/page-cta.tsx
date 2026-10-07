import ConsultLink from "@/components/consult-link";

/* ページ末尾の相談導線。文言は「相談する」で全箇所そろえ、
   場所ごとに変えるのはリード文だけ（改修指示書 §5.1）。 */
export default function PageCta({ heading }: { heading: string }) {
  return (
    <section className="px-5 py-24 text-center md:px-16 md:py-30">
      <p className="font-display text-[22px] leading-[1.8] font-medium tracking-[0.06em] md:text-[30px]">
        {heading}
      </p>
      <div className="mt-9">
        <ConsultLink />
      </div>
    </section>
  );
}

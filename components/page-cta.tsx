import Link from "next/link";

export default function PageCta({ heading }: { heading: string }) {
  return (
    <section className="px-5 py-24 text-center md:px-16 md:py-30">
      <p className="font-serif-jp text-[22px] leading-[1.8] font-medium tracking-[0.04em] md:text-[30px]">
        {heading}
      </p>
      <Link
        href="/contact"
        className="mt-9 inline-block border-b border-blue pb-[5px] font-inter text-[13px] tracking-[0.14em] text-blue"
      >
        お問合せ →
      </Link>
    </section>
  );
}

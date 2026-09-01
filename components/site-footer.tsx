import Link from "next/link";
import { navHref, navLabel } from "@/lib/nav";
import { company } from "@/lib/site-content";

// Home にはフッターを置かない（README §3.5）。フルページのみ。
export default function SiteFooter() {
  return (
    <footer className="flex flex-col gap-10 border-t border-fog px-5 py-14 md:flex-row md:items-start md:justify-between md:px-16 md:py-16">
      <div>
        <div className="font-inter text-[15px] font-normal tracking-[0.36em]">APOLLO</div>
        <p className="mt-[18px] text-[13px] leading-[1.9] text-mist">
          {company.tagline}
          <br />© {company.name} — {company.location}
        </p>
      </div>
      <div className="flex gap-12 font-inter text-xs text-mist">
        <div className="flex flex-col gap-3.5">
          <Link href={navHref.vision}>{navLabel.vision}</Link>
          <Link href={navHref.works}>{navLabel.works}</Link>
        </div>
        <div className="flex flex-col gap-3.5">
          <Link href={navHref.service}>{navLabel.service}</Link>
          <Link href={navHref.company}>{navLabel.company}</Link>
        </div>
        <div className="flex flex-col gap-3.5">
          <Link href={navHref.contact}>{navLabel.contact}</Link>
          <a href={company.privacyUrl} target="_blank" rel="noopener noreferrer">
            個人情報保護方針
          </a>
        </div>
      </div>
    </footer>
  );
}

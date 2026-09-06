import Link from "next/link";
import { navHref, navLabel } from "@/lib/nav";
import { company } from "@/lib/site-content";

// Home にはフッターを置かない（README §3.5）。フルページのみ。
export default function SiteFooter() {
  return (
    <footer className="flex flex-col gap-10 border-t border-fog px-5 py-14 md:flex-row md:items-start md:justify-between md:px-16 md:py-16">
      <div className="font-label text-[15px] font-normal tracking-[0.36em]">APOLLO</div>

      <div className="flex gap-12 font-label text-xs text-mist">
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
          <a
            href={company.privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            POLICY
          </a>
        </div>
      </div>
    </footer>
  );
}

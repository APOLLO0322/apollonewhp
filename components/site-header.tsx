"use client";

import Link from "next/link";
import { useState } from "react";
import { navHref, navLabel, navOrder } from "@/lib/nav";

export type NavCurrent = "works" | "about" | "contact" | null;

// 順番・表記・遷移先は lib/nav.ts が正。
// 事業内容の独立ページは作らない。Home のパネルを開いて見せる（README §0）。
const currentOf: Record<string, NavCurrent> = {
  vision: "about",
  works: "works",
  service: null,
  company: "about",
};

const items = navOrder.map((key) => ({
  href: navHref[key],
  label: navLabel[key],
  key: currentOf[key],
}));

export default function SiteHeader({ current = null }: { current?: NavCurrent }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-fog bg-pale">
      <div className="flex items-center justify-between px-5 py-6 md:px-16 md:py-[30px]">
        <Link
          href="/"
          className="font-inter text-[13px] font-normal tracking-[0.36em] text-ink md:text-[15px]"
        >
          APOLLO
        </Link>

        <nav className="hidden items-center gap-10 font-inter text-[11px] tracking-[0.18em] text-mist md:flex">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`whitespace-nowrap ${current && item.key === current ? "text-ink" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={`border-b pb-1 whitespace-nowrap ${
              current === "contact" ? "border-ink text-ink" : "border-blue text-blue"
            }`}
          >
            {navLabel.contact}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="font-inter text-[11px] tracking-[0.24em] text-ink md:hidden"
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-fog px-5 pb-6 md:hidden">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-fog py-4 font-inter text-lg tracking-[0.2em]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="border-b border-fog py-4 font-inter text-lg tracking-[0.2em] text-blue"
          >
            {navLabel.contact}
          </Link>
        </nav>
      )}
    </header>
  );
}

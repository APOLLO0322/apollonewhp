"use client";

import Link from "next/link";
import { useState } from "react";

export type NavCurrent = "works" | "about" | "contact" | null;

// 事業内容の独立ページは作らない。Home のパネルを開いて見せる（README §0）。
const items: { href: string; label: string; key: NavCurrent }[] = [
  { href: "/?panel=service", label: "事業内容", key: null },
  { href: "/works", label: "制作実績", key: "works" },
  { href: "/about#vision", label: "理念", key: "about" },
  { href: "/about", label: "会社概要", key: "about" },
];

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
            お問合せ
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
              className="border-b border-fog py-4 font-serif-jp text-xl font-medium"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="border-b border-fog py-4 font-serif-jp text-xl font-medium text-blue"
          >
            お問合せ
          </Link>
        </nav>
      )}
    </header>
  );
}

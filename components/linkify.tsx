import { Fragment } from "react";

/* 本文中の URL をリンクにする。

   microCMS 側はテキストエリアなので、URLを書いてもただの文字列として
   届く。リッチエディタに変えてHTMLを流し込む手もあるが、CMSの入力を
   そのままHTMLとして描画することになるので、こちらで組み立てる。

   拾うのは http / https だけ。末尾の句読点や閉じ括弧はURLに含めない
   （「…（https://example.com）」のような書き方を拾えるようにする）。 */

const URL_PATTERN = /https?:\/\/[^\s<>"'）」、。]+/g;

export default function Linkify({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const url = match[0];
    const start = match.index;

    if (start > last) parts.push(text.slice(last, start));

    parts.push(
      <a
        key={`${start}-${url}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-logo-blue underline decoration-logo-blue/40 underline-offset-4 transition-colors hover:decoration-logo-blue"
      >
        {url.replace(/^https?:\/\//, "")}
      </a>,
    );
    last = start + url.length;
  }

  if (last < text.length) parts.push(text.slice(last));

  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}

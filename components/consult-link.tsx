import Link from "next/link";

/* 相談への導線（改修指示書 §5）。

   塗りボタンにはしない。サイト中で塗りを張るのは詳細ページの
   「制作のご相談」1つだけで、そこに意味を集中させている。
   ここで何度も塗ると、どれが一番押してほしいものか分からなくなる。

   文言は4箇所すべて「相談する」で揃える。「お問い合わせはこちら」
   「今すぐ無料相談」のような定型句は使わない。リード文だけ場所で変える。 */
export default function ConsultLink({
  tone = "page",
}: {
  tone?: "page" | "panel";
}) {
  const color = tone === "panel" ? "border-blue-panel text-blue-panel" : "border-blue text-blue";

  return (
    <Link
      href="/contact"
      className={`group inline-flex items-center gap-2 border-b pb-[5px] font-label text-[13px] tracking-[0.1em] ${color}`}
    >
      相談する
      <span
        aria-hidden
        className="text-[11px] transition-transform duration-300 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

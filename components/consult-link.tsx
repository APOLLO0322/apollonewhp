import Link from "next/link";

/* 相談への導線（改修指示書 §5）。

   塗りボタンにはしない。サイト中で塗りを張るのは実績詳細の
   「制作のご相談」1つだけで、そこに意味を集中させている。
   ここで何度も塗ると、どれが一番押してほしいものか分からなくなる。

   ただし下線のテキストリンクだと本文に紛れて見落とされる。
   線で囲い、ホバーで塗りが入る形にして、押せることを明示する。
   塗らずに「ボタンに見える」ところまでは持っていく。

   文言は4箇所すべて「相談する」で揃える。「お問い合わせはこちら」
   「今すぐ無料相談」のような定型句は使わない。リード文だけ場所で変える。 */
export default function ConsultLink({
  tone = "page",
}: {
  tone?: "page" | "panel";
}) {
  const color =
    tone === "panel"
      ? "border-blue-panel text-blue-panel hover:bg-blue-panel"
      : "border-blue text-blue hover:bg-blue";

  return (
    <Link
      href="/contact"
      className={`group inline-flex items-center gap-2.5 rounded-[2px] border px-6 py-3.5 font-label text-[14px] tracking-[0.1em] transition-colors duration-300 hover:text-pale ${color}`}
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

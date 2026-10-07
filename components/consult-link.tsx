import Link from "next/link";

/* 相談への導線（改修指示書 §5）。

   指示書は「塗りボタンにしない」だったが、線だけだと押せるものに
   見えなかったため、お問合せの「送信する」と同じ形にそろえる。
   同じ見た目のものは同じ意味、という方が迷わない。

   色は宙（ロゴの青）。朱はいまも実績詳細の「制作のご相談」1つだけで、
   そこが最後の一押しであることは保たれている。

   文言は4箇所すべて「相談する」。「お問い合わせはこちら」
   「今すぐ無料相談」のような定型句は使わない。 */
export default function ConsultLink({
  tone = "page",
}: {
  tone?: "page" | "panel";
}) {
  // 余白はお問合せフォームの送信ボタンと同じ出し分け（フルページは大きく）
  const pad = tone === "page" ? "px-[52px] py-[18px]" : "px-10 py-4";

  return (
    <Link
      href="/contact"
      className={`group inline-flex items-center gap-2.5 rounded-[2px] bg-logo-blue text-[13px] tracking-[0.06em] text-pale transition-colors duration-300 hover:bg-ink ${pad}`}
    >
      相談する
      <span
        aria-hidden
        className="font-label text-[11px] transition-transform duration-300 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

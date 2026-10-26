import { Fragment } from "react";

/* スラッシュ区切りの語を、語の途中で折り返さないように並べる。

   「出張撮影サ／ービス」「モデルアサイン / 企／画」のような切れ方は、
   幅の狭いスマホでよく起きる。CSS の word-break: auto-phrase でも
   かなり防げるが、対応していないブラウザが残っているので、
   区切りの語ごとに inline-block で包んで確実に止める。

   折り返してよいのは区切り（ / と改行）のところだけ。
   改行は原稿の意図した改行なので、そのまま段落として扱う。

   区切りと見なすのは前後に空白がある ` / ` だけ。空白なしの `/` は
   URL のパス（apollone.jp/privacy）なので、割ってはいけない。 */
export default function Segments({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line
            .split(/\s+\/\s+/)
            .filter(Boolean)
            .map((part, pi) => (
              <Fragment key={pi}>
                {pi > 0 && " / "}
                <span className="inline-block">{part}</span>
              </Fragment>
            ))}
        </Fragment>
      ))}
    </>
  );
}

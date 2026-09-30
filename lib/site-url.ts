/* サイトのURLと、検索エンジンに開放してよいかの判定。

   このサイトは公開までに3か所で動く。

     1. プレビュー  apollo-site-*.vercel.app     （NEXT_PUBLIC_SITE_URL 未設定）
     2. 仮公開      new.apollone.jp など          （NEXT_PUBLIC_SITE_URL = その URL）
     3. 本公開      apollone.jp                   （NEXT_PUBLIC_SITE_URL = 本番ドメイン）

   1 と 2 が検索結果に出ると、本番と同じ内容が複数のURLに存在することになり
   （重複コンテンツ）、どれを正とすべきかGoogleが判断できなくなる。
   仮公開の段階では旧WordPressがまだ本番として動いているので、なおさら出せない。

   そこで「NEXT_PUBLIC_SITE_URL が本番ドメインと完全に一致するときだけ開放」
   とする。フラグを別に持つと片方だけ切り替える事故が起きるため、
   判定材料はこの1つに寄せている。

   canonical と OGP には siteUrl をそのまま使う。仮公開中も
   new.apollone.jp が入るので、リンクを共有したときのカードは正しく出る。 */

export const PRODUCTION_ORIGIN = "https://apollone.jp";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_ORIGIN;

/* 本公開の日にやることは、Vercel の環境変数を本番ドメインに変えて
   再デプロイするだけ。これで robots.txt と noindex が同時に外れる。 */
export const isIndexable = process.env.NEXT_PUBLIC_SITE_URL === PRODUCTION_ORIGIN;

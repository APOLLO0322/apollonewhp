import type { MetadataRoute } from "next";

/* robots.txt。

   プレビュー（*.vercel.app）は検索結果に出したくない。本番ドメインと
   同じ内容が2か所に存在すると重複コンテンツになるため、
   NEXT_PUBLIC_SITE_URL が本番を指しているときだけクロールを許可する。 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default function robots(): MetadataRoute.Robots {
  if (!siteUrl) return { rules: { userAgent: "*", disallow: "/" } };

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

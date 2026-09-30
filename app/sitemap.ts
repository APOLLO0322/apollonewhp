import type { MetadataRoute } from "next";
import { getWorks } from "@/lib/works";

/* sitemap.xml。実績は microCMS 次第で増減するので都度組み立てる。
   URL は NEXT_PUBLIC_SITE_URL が正。未設定だと本番ドメインではなく
   プレビューの URL が載ってしまうので、Vercel 側に必ず入れておくこと。 */
export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://apollone.jp";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const works = await getWorks();

  const fixed: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/works`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.1 },
  ];

  return [
    ...fixed,
    ...works.map((w) => ({
      url: `${siteUrl}/works/${encodeURIComponent(w.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

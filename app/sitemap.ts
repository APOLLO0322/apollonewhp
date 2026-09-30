import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { getWorks } from "@/lib/works";

/* sitemap.xml。実績は microCMS 次第で増減するので都度組み立てる。 */
export const revalidate = 60;

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

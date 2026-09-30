import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/site-url";

/* robots.txt。開放の条件は lib/site-url.ts を参照。 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) return { rules: { userAgent: "*", disallow: "/" } };

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

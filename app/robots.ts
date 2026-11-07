import type { MetadataRoute } from "next";
import { URL_PUBLICA } from "@/lib/metadados";

export const dynamic = "force-static";

/** robots.txt: libera tudo e aponta o sitemap. A prévia com rascunhos não deve ser indexada. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_RASCUNHOS === "1") return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${URL_PUBLICA}/sitemap.xml` };
}

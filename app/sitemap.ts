import type { MetadataRoute } from "next";
import { brincadeirasNoSite } from "@/lib/conteudo";
import { URL_PUBLICA } from "@/lib/metadados";

/**
 * Lista de páginas para o Google (sitemap.xml). A página inicial depende do que está guardado no
 * aparelho, então quem traz as fichas para a busca é este arquivo. Gerado no build.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixas = ["/", "/explorar/", "/sobre/", "/termos/", "/privacidade/"].map((caminho) => ({
    url: `${URL_PUBLICA}${caminho}`,
  }));
  const fichas = brincadeirasNoSite().map((b) => ({ url: `${URL_PUBLICA}/brincadeira/${b.id}/` }));
  return [...fixas, ...fichas];
}

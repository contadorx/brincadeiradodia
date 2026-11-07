import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { brincadeirasNoSite } from "@/lib/conteudo";
import { URL_PUBLICA } from "@/lib/metadados";

export const dynamic = "force-static";

/** sitemap.xml: as páginas públicas e todas as fichas (o modo "brincando" fica de fora: não é para busca). */
export default function sitemap(): MetadataRoute.Sitemap {
  const paginas = ["/", "/explorar/", "/sobre/", "/apoiar/", "/instalar/", "/termos/", "/privacidade/"];
  if (SITE.revisao.convidar && SITE.contato) paginas.push("/revisar/");
  return [
    ...paginas.map((p) => ({ url: `${URL_PUBLICA}${p}` })),
    ...brincadeirasNoSite().map((b) => ({ url: `${URL_PUBLICA}/brincadeira/${b.id}/` })),
  ];
}

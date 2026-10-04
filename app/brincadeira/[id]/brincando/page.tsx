import type { Metadata } from "next";
import { Brincando } from "@/components/Brincando";
import { brincadeiraPorId, todasAsBrincadeiras } from "@/lib/conteudo";
import { codigoPix } from "@/lib/apoio";
import { SITE } from "@/config/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return todasAsBrincadeiras().map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const b = brincadeiraPorId((await params).id);
  return { title: `Brincando: ${b.nome}`, robots: { index: false } };
}

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const b = brincadeiraPorId((await params).id);
  return <Brincando b={b} pix={codigoPix()} url={SITE.url} apoio={SITE.apoio} />;
}

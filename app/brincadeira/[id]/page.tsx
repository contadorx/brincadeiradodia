import type { Metadata } from "next";
import { Ficha } from "@/components/Ficha";
import { brincadeiraPorId, brincadeirasNoSite } from "@/lib/conteudo";
import { SITE } from "@/config/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return brincadeirasNoSite().map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const b = brincadeiraPorId((await params).id);
  return { title: b.nome, description: `${b.serve} Uns ${b.minutos} minutos, com o que tem em casa.` };
}

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const b = brincadeiraPorId((await params).id);
  return <Ficha b={b} url={SITE.url} />;
}

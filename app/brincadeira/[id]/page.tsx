import type { Metadata } from "next";
import { Ficha } from "@/components/Ficha";
import { brincadeiraPorId, brincadeirasNoSite } from "@/lib/conteudo";
import { SITE } from "@/config/site";
import { previa } from "@/lib/metadados";

export const dynamicParams = false;

export function generateStaticParams() {
  return brincadeirasNoSite().map((b) => ({ id: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const b = brincadeiraPorId((await params).id);
  const descricao = `${b.serve} Uns ${b.minutos} minutos, com o que tem em casa.`;
  const caminho = `/brincadeira/${b.id}/`;
  return {
    title: b.nome,
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: previa({ titulo: `${b.nome} · ${SITE.nome}`, descricao, caminho }),
  };
}

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const b = brincadeiraPorId((await params).id);
  return <Ficha b={b} />;
}

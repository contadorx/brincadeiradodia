import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/config/site";
import { placarRevisao } from "@/lib/revisao";
import { previa } from "@/lib/metadados";
import { PaginaRevisar } from "@/components/PaginaRevisar";

const descricao =
  "Profissionais de saúde e educação infantil podem doar uma revisão: você lê umas 8 brincadeiras curtas, diz o que mudaria e, se quiser, seu nome aparece.";

export const metadata: Metadata = {
  title: "Revise uma brincadeira",
  description: descricao,
  alternates: { canonical: "/revisar/" },
  openGraph: previa({ titulo: `Revise uma brincadeira · ${SITE.nome}`, descricao, caminho: "/revisar/" }),
};

export default function Pagina() {
  if (!SITE.revisao.convidar || !SITE.contato) notFound();
  return <PaginaRevisar placar={placarRevisao()} contato={SITE.contato} />;
}

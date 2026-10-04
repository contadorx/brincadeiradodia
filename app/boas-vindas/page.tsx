import type { Metadata } from "next";
import { BoasVindas } from "@/components/BoasVindas";
import { brincadeirasNoSite } from "@/lib/conteudo";
import { FAIXAS } from "@/lib/esquema";

export const metadata: Metadata = { title: "Boas-vindas" };

export default function Pagina() {
  const lista = brincadeirasNoSite();
  const comConteudo = FAIXAS.filter((f) => lista.some((b) => b.faixas.includes(f)));
  return <BoasVindas faixasComConteudo={[...comConteudo]} />;
}

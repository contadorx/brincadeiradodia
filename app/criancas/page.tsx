import type { Metadata } from "next";
import { Criancas } from "@/components/Criancas";
import { brincadeirasNoSite } from "@/lib/conteudo";
import { FAIXAS } from "@/lib/dominio";

export const metadata: Metadata = { title: "Crianças", robots: { index: false } };

export default function Pagina() {
  const lista = brincadeirasNoSite();
  const disponiveis = FAIXAS.filter((f) => lista.some((b) => b.faixas.includes(f)));
  return <Criancas disponiveis={[...disponiveis]} />;
}

import type { Metadata } from "next";
import { Diario } from "@/components/Diario";
import { brincadeirasNoSite } from "@/lib/conteudo";

export const metadata: Metadata = { title: "Diário", robots: { index: false } };

export default function Pagina() {
  return <Diario lista={brincadeirasNoSite()} />;
}

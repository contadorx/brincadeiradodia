import type { Metadata } from "next";
import { Explorar } from "@/components/Explorar";
import { todasAsBrincadeiras } from "@/lib/conteudo";

export const metadata: Metadata = { title: "Explorar" };

export default function Pagina() {
  return <Explorar lista={todasAsBrincadeiras()} />;
}

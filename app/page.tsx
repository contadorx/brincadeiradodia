import { Hoje } from "@/components/Hoje";
import { todasAsBrincadeiras } from "@/lib/conteudo";

export default function Pagina() {
  return <Hoje lista={todasAsBrincadeiras()} />;
}

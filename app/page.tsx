import { Hoje } from "@/components/Hoje";
import { resumosNoSite } from "@/lib/conteudo";

export default function Pagina() {
  return <Hoje lista={resumosNoSite()} />;
}

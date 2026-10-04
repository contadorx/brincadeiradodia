import { Hoje } from "@/components/Hoje";
import { brincadeirasNoSite } from "@/lib/conteudo";

export default function Pagina() {
  return <Hoje lista={brincadeirasNoSite()} />;
}

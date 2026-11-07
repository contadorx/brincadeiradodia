import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { opcoesPix } from "@/lib/apoio";
import { previa } from "@/lib/metadados";
import { PaginaApoiar } from "@/components/PaginaApoiar";

const descricao = "Como ajudar o Brincadeira do Dia a continuar gratuito: mande para outra família ou contribua com um PIX.";

export const metadata: Metadata = {
  title: "Apoiar",
  description: descricao,
  alternates: { canonical: "/apoiar/" },
  openGraph: previa({ titulo: `Apoiar · ${SITE.nome}`, descricao, caminho: "/apoiar/" }),
};

export default function Pagina() {
  return (
    <PaginaApoiar
      opcoes={opcoesPix("apoiar")}
      responsavel={SITE.responsavel}
      cobre={SITE.apoioCobre}
      revisar={SITE.revisao.convidar && !!SITE.contato}
    />
  );
}

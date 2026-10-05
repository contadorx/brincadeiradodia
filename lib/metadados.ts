import type { Metadata } from "next";
import { SITE } from "@/config/site";

/**
 * Endereço público das prévias de link e do endereço canônico. Na Vercel, vem sozinho do domínio
 * de produção do projeto: o .vercel.app enquanto o .com.br não estiver ligado, e o .com.br depois.
 * Fora da Vercel, vale SITE.url. Assim a imagem da prévia sempre carrega.
 */
export const URL_PUBLICA = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : SITE.url;

/** Imagem da prévia de links, gerada por `npm run og` (1200 x 630). */
export const IMAGEM_PREVIA = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Brincadeira do Dia: uma brincadeira por dia, de uns 10 minutos, com o que você tem em casa.",
};

/**
 * Open Graph completo de uma página. No Next, o openGraph de uma página substitui o do layout
 * inteiro (não mistura campos), por isso tudo é montado aqui.
 * Sem `caminho`, a prévia não fixa o endereço: vale o link que a pessoa mandou.
 */
export function previa({ titulo, descricao, caminho }: { titulo: string; descricao: string; caminho?: string }): NonNullable<Metadata["openGraph"]> {
  return {
    title: titulo,
    description: descricao,
    ...(caminho ? { url: caminho } : {}),
    siteName: SITE.nome,
    locale: "pt_BR",
    type: "website",
    images: [IMAGEM_PREVIA],
  };
}

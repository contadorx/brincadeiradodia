import { SITE } from "@/config/site";
import { pixCopiaECola } from "./pix";

/** Código PIX copia e cola, ou null se o PIX ainda não foi configurado em config/site.ts. */
export function codigoPix(): string | null {
  const { chave, nomeRecebedor, cidade } = SITE.pix;
  if (!chave || !nomeRecebedor || !cidade) return null;
  return pixCopiaECola({ chave, nome: nomeRecebedor, cidade });
}

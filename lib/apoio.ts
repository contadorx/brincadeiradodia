import { SITE } from "@/config/site";
import { pixCopiaECola } from "./pix";

/** Um código PIX copia e cola: com valor (sugerido) ou sem valor (a pessoa digita no banco). */
export type OpcaoPix = { valor: number | null; codigo: string };

/**
 * De onde o PIX foi pedido. Vai no identificador do código (BRINCADEIRACARTAO, BRINCADEIRAAPOIAR,
 * BRINCADEIRASOBRE): no extrato, cada PIX recebido diz de qual lugar do site veio.
 */
export type LugarPix = "cartao" | "apoiar" | "sobre";

/** Identificador do PIX para um lugar do site, ou undefined se `pix.identificador` estiver vazio. */
export function identificadorPix(lugar: LugarPix): string | undefined {
  const prefixo = SITE.pix.identificador.trim();
  return prefixo ? `${prefixo}${lugar.toUpperCase()}` : undefined;
}

/**
 * Um código por valor sugerido em config/site.ts e, por último, o sem valor ("outro valor").
 * null enquanto o PIX não estiver configurado.
 */
export function opcoesPix(lugar: LugarPix): OpcaoPix[] | null {
  const { chave, nomeRecebedor, cidade, valoresSugeridos } = SITE.pix;
  if (!chave || !nomeRecebedor || !cidade) return null;
  const txid = identificadorPix(lugar);
  const codigo = (valor?: number) => pixCopiaECola({ chave, nome: nomeRecebedor, cidade, valor, txid });
  return [...valoresSugeridos.map((valor) => ({ valor, codigo: codigo(valor) })), { valor: null, codigo: codigo() }];
}

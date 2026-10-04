import { AREAS, type Brincadeira, type Faixa } from "./esquema";
import { difDias, meiaNoite } from "./datas";

/**
 * Brincadeira do dia:
 * - cada dia da semana tem uma área (domingo = explorar, segunda = linguagem…);
 * - as brincadeiras da área se revezam pela ordem (semana 1 = ordem 1, semana 2 = ordem 2…);
 * - na primeira volta do rodízio cada brincadeira é nova (nível normal); quando ela volta,
 *   sugerimos o nível mais difícil.
 * A contagem de semanas começa no dia em que a família abriu o site pela primeira vez.
 */
export function semanaDeUso(inicio: Date, hoje: Date): number {
  return Math.max(1, Math.floor(difDias(hoje, inicio) / 7) + 1);
}

export function paraAFaixa(lista: Brincadeira[], faixa: Faixa): Brincadeira[] {
  return lista.filter((b) => b.faixas.includes(faixa));
}

export function brincadeiraDoDia(
  lista: Brincadeira[],
  faixa: Faixa,
  inicio: Date,
  dia: Date,
): { brincadeira: Brincadeira | null; semana: number; nivelSugerido: "normal" | "dificil" } {
  const semana = semanaDeUso(inicio, dia);
  const area = AREAS[meiaNoite(dia).getDay()];
  const opcoes = paraAFaixa(lista, faixa)
    .filter((b) => b.area === area)
    .sort((a, b) => a.ordem - b.ordem || a.id.localeCompare(b.id));
  const brincadeira = opcoes.length ? opcoes[(semana - 1) % opcoes.length] : null;
  return { brincadeira, semana, nivelSugerido: brincadeira && semana > opcoes.length ? "dificil" : "normal" };
}

/** Duas sugestões sem material, que mudam a cada dia. */
export function semMaterial(lista: Brincadeira[], faixa: Faixa, dia: Date, excluir?: string): Brincadeira[] {
  const opcoes = paraAFaixa(lista, faixa).filter((b) => b.etiquetas.length === 0 && b.id !== excluir);
  if (opcoes.length <= 2) return opcoes;
  const inicio = Math.abs(Math.floor(meiaNoite(dia).getTime() / 86400000)) % opcoes.length;
  return [opcoes[inicio], opcoes[(inicio + 1) % opcoes.length]];
}

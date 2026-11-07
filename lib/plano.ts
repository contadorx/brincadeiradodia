import { AREAS, type Faixa, type Resumo } from "./dominio";
import { difDias, meiaNoite } from "./datas";

/**
 * Brincadeira do dia:
 * - cada dia da semana tem uma área (domingo = explorar, segunda = linguagem…);
 * - as brincadeiras da área se revezam pela ordem (semana 1 = ordem 1, semana 2 = ordem 2…);
 * - quando o rodízio dá a volta, a brincadeira volta igual: o nível nunca muda sozinho.
 *   A família escolhe "Mais fácil", "Original" ou "Mais difícil" na ficha.
 * A contagem de semanas começa no dia em que a criança foi adicionada (ou trocou de idade).
 */
export function semanaDeUso(inicio: Date, hoje: Date): number {
  return Math.max(1, Math.floor(difDias(hoje, inicio) / 7) + 1);
}

/** O mínimo que o plano precisa de cada brincadeira (serve para o resumo e para a ficha inteira). */
type ParaPlano = Pick<Resumo, "id" | "area" | "ordem" | "faixas" | "etiquetas">;

export function paraAFaixa<T extends ParaPlano>(lista: T[], faixa: Faixa): T[] {
  return lista.filter((b) => b.faixas.includes(faixa));
}

export function brincadeiraDoDia<T extends ParaPlano>(
  lista: T[],
  faixa: Faixa,
  inicio: Date,
  dia: Date,
): { brincadeira: T | null; semana: number } {
  const semana = semanaDeUso(inicio, dia);
  const area = AREAS[meiaNoite(dia).getDay()];
  const opcoes = paraAFaixa(lista, faixa)
    .filter((b) => b.area === area)
    .sort((a, b) => a.ordem - b.ordem || a.id.localeCompare(b.id));
  const brincadeira = opcoes.length ? opcoes[(semana - 1) % opcoes.length] : null;
  return { brincadeira, semana };
}

/** Duas sugestões sem material, que mudam a cada dia. */
export function semMaterial<T extends ParaPlano>(lista: T[], faixa: Faixa, dia: Date, excluir?: string): T[] {
  const opcoes = paraAFaixa(lista, faixa).filter((b) => b.etiquetas.length === 0 && b.id !== excluir);
  if (opcoes.length <= 2) return opcoes;
  const inicio = Math.abs(Math.floor(meiaNoite(dia).getTime() / 86400000)) % opcoes.length;
  return [opcoes[inicio], opcoes[(inicio + 1) % opcoes.length]];
}

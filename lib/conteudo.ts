import fs from "node:fs";
import path from "node:path";
import { esquemaBrincadeira, type Brincadeira } from "./esquema";

const PASTA = path.join(process.cwd(), "content", "brincadeiras");

/**
 * Prévia para revisão: com NEXT_PUBLIC_RASCUNHOS=1 no build, os rascunhos também
 * aparecem, com um selo "Rascunho". Use só em um endereço de prévia, nunca no site oficial.
 */
export const MOSTRAR_RASCUNHOS = process.env.NEXT_PUBLIC_RASCUNHOS === "1";

let cache: Brincadeira[] | null = null;
let avisou = false;

/**
 * Lê e valida todas as brincadeiras de content/brincadeiras/*.json, inclusive rascunhos.
 * Roda só no build. Qualquer erro de conteúdo interrompe o build e diz
 * qual arquivo e qual campo corrigir.
 */
export function todasAsBrincadeiras(): Brincadeira[] {
  if (cache) return cache;
  const arquivos = fs.readdirSync(PASTA).filter((f) => f.endsWith(".json")).sort();
  const lista: Brincadeira[] = [];
  const erros: string[] = [];
  for (const arquivo of arquivos) {
    const bruto = JSON.parse(fs.readFileSync(path.join(PASTA, arquivo), "utf8"));
    const r = esquemaBrincadeira.safeParse(bruto);
    if (!r.success) {
      for (const issue of r.error.issues) {
        erros.push(`${arquivo} → ${issue.path.join(".") || "(raiz)"}: ${issue.message}`);
      }
      continue;
    }
    if (`${r.data.id}.json` !== arquivo) {
      erros.push(`${arquivo} → id: o id "${r.data.id}" precisa ser igual ao nome do arquivo`);
    }
    if (r.data.evidencia === "D" && !r.data.fontes.some((f) => f.titulo.includes("BNCC"))) {
      erros.push(`${arquivo} → fontes: origem D precisa citar o objetivo da BNCC nas fontes`);
    }
    if (!r.data.serve.startsWith("Treina")) {
      erros.push(`${arquivo} → serve: comece com "Treina…" (sem promessa de resultado)`);
    }
    lista.push(r.data);
  }
  const ids = new Set<string>();
  const vagas = new Map<string, string>();
  for (const b of lista) {
    if (ids.has(b.id)) erros.push(`id repetido: ${b.id}`);
    ids.add(b.id);
    for (const f of b.faixas) {
      const chave = `${f}/${b.area}/${b.ordem}`;
      const outra = vagas.get(chave);
      if (outra) erros.push(`${b.id} e ${outra} têm a mesma faixa (${f}), área (${b.area}) e ordem (${b.ordem})`);
      vagas.set(chave, b.id);
    }
  }
  if (erros.length) {
    throw new Error(`Conteúdo inválido em content/brincadeiras:\n- ${erros.join("\n- ")}`);
  }
  if (!avisou) {
    avisou = true;
    const publicadas = lista.filter((b) => b.status === "publicada");
    const revisadas = publicadas.filter((b) => b.revisao).length;
    const rascunhos = lista.filter((b) => b.status === "rascunho").map((b) => b.id);
    console.log(`\n[conteúdo] ${publicadas.length} brincadeira(s) no ar, ${revisadas} com selo de revisão voluntária.`);
    if (rascunhos.length) {
      console.warn(
        MOSTRAR_RASCUNHOS
          ? `[conteúdo] PRÉVIA: ${rascunhos.length} rascunho(s) incluído(s) com selo. Não publique este build no endereço oficial.\n`
          : `[conteúdo] ${rascunhos.length} rascunho(s) fora do site: ${rascunhos.join(", ")}\n`,
      );
    }
  }
  cache = lista;
  return lista;
}

/**
 * O que vai para o site: só as publicadas, ou também os rascunhos na prévia.
 * Da revisão, só seguem para o navegador a profissão, a data e o nome (este só com
 * autorização). Registro profissional e observações ficam no arquivo e nunca vão para a página.
 */
export function brincadeirasNoSite(): Brincadeira[] {
  return todasAsBrincadeiras()
    .filter((b) => b.status === "publicada" || MOSTRAR_RASCUNHOS)
    .map((b) =>
      b.revisao
        ? {
            ...b,
            revisao: {
              ...b.revisao,
              nome: b.revisao.mostrarNome ? b.revisao.nome : "",
              registro: "",
              observacoes: "",
            },
          }
        : b,
    );
}

export function brincadeiraPorId(id: string): Brincadeira {
  const b = brincadeirasNoSite().find((x) => x.id === id);
  if (!b) throw new Error(`Brincadeira não encontrada: ${id}`);
  return b;
}

/** Profissionais que doaram revisão e autorizaram o nome no site (créditos da página Sobre). */
export function revisoras(): { nome: string; profissao: string; quantas: number }[] {
  const mapa = new Map<string, { nome: string; profissao: string; quantas: number }>();
  for (const b of brincadeirasNoSite()) {
    const r = b.revisao;
    if (!r || !r.mostrarNome) continue;
    const chave = `${r.nome}|${r.profissao}`;
    const atual = mapa.get(chave) ?? { nome: r.nome, profissao: r.profissao, quantas: 0 };
    atual.quantas += 1;
    mapa.set(chave, atual);
  }
  return [...mapa.values()].sort((a, b) => b.quantas - a.quantas || a.nome.localeCompare(b.nome));
}

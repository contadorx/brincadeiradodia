import fs from "node:fs";
import path from "node:path";
import { esquemaBrincadeira, type Brincadeira } from "./esquema";

const PASTA = path.join(process.cwd(), "content", "brincadeiras");

let cache: Brincadeira[] | null = null;

/**
 * Lê e valida todas as brincadeiras de content/brincadeiras/*.json.
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
    lista.push(r.data);
  }
  const ids = new Set<string>();
  for (const b of lista) {
    if (ids.has(b.id)) erros.push(`id repetido: ${b.id}`);
    ids.add(b.id);
  }
  if (erros.length) {
    throw new Error(`Conteúdo inválido em content/brincadeiras:\n- ${erros.join("\n- ")}`);
  }
  cache = lista;
  return lista;
}

export function brincadeiraPorId(id: string): Brincadeira {
  const b = todasAsBrincadeiras().find((x) => x.id === id);
  if (!b) throw new Error(`Brincadeira não encontrada: ${id}`);
  return b;
}

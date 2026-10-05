"use client";

import { get, set, del } from "idb-keyval";
import type { Faixa } from "./esquema";
import { chaveDia } from "./datas";

/**
 * Tudo o que a família registra fica no próprio aparelho (IndexedDB).
 * Nada é enviado para servidor.
 *
 * Uma família pode ter várias crianças. Cada uma tem idade, apelido, começo do rodízio
 * e diário próprios; uma delas é a "ativa", a que aparece em Hoje, Explorar e Diário.
 * O aceite dos termos é do adulto, então vale para a família toda.
 */

export const MAX_CRIANCAS = 6;

export type Crianca = {
  id: string;
  apelido: string;
  faixa: Faixa;
  /** Primeiro dia desta criança na faixa atual (AAAA-MM-DD): base da contagem de semanas. */
  inicio: string;
  criadaEm: string;
};

export type Aceite = { versao: string; em: string };

export type Familia = {
  criancas: Crianca[];
  ativa: string;
  aceite?: Aceite;
};

/** A criança ativa, com o aceite da família. É o que as telas usam. */
export type Perfil = {
  id: string;
  faixa: Faixa;
  apelido: string;
  /** Primeiro dia de uso (AAAA-MM-DD): base da contagem de semanas. */
  inicio: string;
  aceite?: Aceite;
};

export type Reacao = "adorou" | "ok" | "nao";

export type Registro = {
  id: string;
  /** Criança a quem o registro pertence. */
  crianca: string;
  dia: string;
  brincadeira: string;
  reacao: Reacao;
  nota: string;
  criadoEm: string;
};

export type EstadoApoio = {
  /** Última vez que o cartão de apoio foi mostrado (ISO). */
  ultimoCartao?: string;
};

const K_FAMILIA = "familia";
/** Formato antigo, de uma criança só. Lido uma vez e convertido para "familia". */
const K_PERFIL_ANTIGO = "perfil";
const K_REGISTROS = "registros";
const K_APOIO = "apoio";
const K_SEMANA = "ultima-semana-medida";

function novoId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Nome para mostrar: o apelido, ou "Criança 1", "Criança 2"... */
export function nomeDaCrianca(c: Crianca, familia: Familia): string {
  if (c.apelido.trim()) return c.apelido.trim();
  return `Criança ${familia.criancas.findIndex((x) => x.id === c.id) + 1}`;
}

// ---------------------------------------------------------------- família

let migracao: Promise<Familia | null> | null = null;

async function lerBruto<T>(chave: string): Promise<T | undefined> {
  try {
    return await get<T>(chave);
  } catch {
    return undefined;
  }
}

/**
 * Lê a família. Quem usava a versão de uma criança só tem o perfil antigo convertido
 * aqui, uma única vez, sem perder o diário: os registros passam a pertencer a essa criança.
 */
export async function lerFamilia(): Promise<Familia | null> {
  const f = await lerBruto<Familia>(K_FAMILIA);
  if (f && f.criancas?.length) return f;
  if (!migracao) {
    migracao = (async () => {
      const antigo = await lerBruto<Omit<Perfil, "id">>(K_PERFIL_ANTIGO);
      if (!antigo) return null;
      const id = novoId();
      const familia: Familia = {
        criancas: [{ id, apelido: antigo.apelido ?? "", faixa: antigo.faixa, inicio: antigo.inicio, criadaEm: new Date().toISOString() }],
        ativa: id,
        aceite: antigo.aceite,
      };
      const registros = ((await lerBruto<Registro[]>(K_REGISTROS)) ?? []).map((r) => (r.crianca ? r : { ...r, crianca: id }));
      await set(K_REGISTROS, registros);
      await set(K_FAMILIA, familia);
      await del(K_PERFIL_ANTIGO);
      return familia;
    })().finally(() => {
      migracao = null;
    });
  }
  return migracao;
}

const salvarFamilia = (f: Familia) => set(K_FAMILIA, f);

function ativaDe(f: Familia): Crianca {
  return f.criancas.find((c) => c.id === f.ativa) ?? f.criancas[0];
}

export async function lerPerfil(): Promise<Perfil | null> {
  const f = await lerFamilia();
  if (!f) return null;
  const c = ativaDe(f);
  return { id: c.id, faixa: c.faixa, apelido: c.apelido, inicio: c.inicio, aceite: f.aceite };
}

/**
 * Boas-vindas: cria a primeira criança ou ajusta a ativa, e grava o aceite.
 * Trocar a faixa de idade recomeça o rodízio daquela criança na semana 1.
 */
export async function salvarPerfil(p: { faixa: Faixa; apelido: string; inicio?: string; aceite?: Aceite }) {
  const f = await lerFamilia();
  const hoje = chaveDia(new Date());
  if (!f) {
    const id = novoId();
    await salvarFamilia({
      criancas: [{ id, apelido: p.apelido, faixa: p.faixa, inicio: p.inicio ?? hoje, criadaEm: new Date().toISOString() }],
      ativa: id,
      aceite: p.aceite,
    });
    return;
  }
  const atual = ativaDe(f);
  const criancas = f.criancas.map((c) =>
    c.id === atual.id ? { ...c, apelido: p.apelido, faixa: p.faixa, inicio: c.faixa === p.faixa ? c.inicio : hoje } : c,
  );
  await salvarFamilia({ ...f, criancas, aceite: p.aceite ?? f.aceite });
}

export async function adicionarCrianca(dados: { apelido: string; faixa: Faixa }): Promise<Familia> {
  const f = await lerFamilia();
  if (!f) throw new Error("Família ainda não criada.");
  if (f.criancas.length >= MAX_CRIANCAS) throw new Error(`No máximo ${MAX_CRIANCAS} crianças.`);
  const c: Crianca = { id: novoId(), apelido: dados.apelido.trim().slice(0, 30), faixa: dados.faixa, inicio: chaveDia(new Date()), criadaEm: new Date().toISOString() };
  const nova = { ...f, criancas: [...f.criancas, c], ativa: c.id };
  await salvarFamilia(nova);
  return nova;
}

export async function editarCrianca(id: string, dados: { apelido: string; faixa: Faixa }): Promise<Familia> {
  const f = await lerFamilia();
  if (!f) throw new Error("Família ainda não criada.");
  const hoje = chaveDia(new Date());
  const criancas = f.criancas.map((c) =>
    c.id === id ? { ...c, apelido: dados.apelido.trim().slice(0, 30), faixa: dados.faixa, inicio: c.faixa === dados.faixa ? c.inicio : hoje } : c,
  );
  const nova = { ...f, criancas };
  await salvarFamilia(nova);
  return nova;
}

export async function trocarCrianca(id: string): Promise<Familia> {
  const f = await lerFamilia();
  if (!f || !f.criancas.some((c) => c.id === id)) throw new Error("Criança não encontrada.");
  const nova = { ...f, ativa: id };
  await salvarFamilia(nova);
  return nova;
}

/** Remove a criança e o diário dela. A última criança não pode ser removida (use "Apagar meus dados"). */
export async function removerCrianca(id: string): Promise<Familia> {
  const f = await lerFamilia();
  if (!f) throw new Error("Família ainda não criada.");
  if (f.criancas.length <= 1) throw new Error("A família precisa de pelo menos uma criança.");
  const criancas = f.criancas.filter((c) => c.id !== id);
  const nova = { ...f, criancas, ativa: f.ativa === id ? criancas[0].id : f.ativa };
  await set(K_REGISTROS, (await lerTodosRegistros()).filter((r) => r.crianca !== id));
  await salvarFamilia(nova);
  return nova;
}

/** Dia em que a família começou a usar o site (a criança mais antiga). */
export async function inicioDaFamilia(): Promise<string | null> {
  const f = await lerFamilia();
  if (!f) return null;
  return f.criancas.map((c) => c.inicio).sort()[0] ?? null;
}

// ---------------------------------------------------------------- diário

export async function lerTodosRegistros(): Promise<Registro[]> {
  await lerFamilia(); // garante a migração antes de ler
  return (await lerBruto<Registro[]>(K_REGISTROS)) ?? [];
}

/** Registros da criança ativa. */
export async function lerRegistros(): Promise<Registro[]> {
  const f = await lerFamilia();
  if (!f) return [];
  const ativa = ativaDe(f).id;
  return (await lerTodosRegistros()).filter((r) => r.crianca === ativa);
}

/** Quantos registros cada criança tem no diário. */
export async function contarRegistros(): Promise<Record<string, number>> {
  const contagem: Record<string, number> = {};
  for (const r of await lerTodosRegistros()) contagem[r.crianca] = (contagem[r.crianca] ?? 0) + 1;
  return contagem;
}

/** Grava um registro para a criança ativa e devolve o diário dela e o total da família. */
export async function adicionarRegistro(r: Omit<Registro, "id" | "criadoEm" | "crianca">): Promise<{ daCrianca: Registro[]; total: number }> {
  const f = await lerFamilia();
  if (!f) throw new Error("Família ainda não criada.");
  const crianca = ativaDe(f).id;
  const todos = await lerTodosRegistros();
  const novo: Registro = { ...r, crianca, id: novoId(), criadoEm: new Date().toISOString() };
  const proxima = [novo, ...todos];
  await set(K_REGISTROS, proxima);
  return { daCrianca: proxima.filter((x) => x.crianca === crianca), total: proxima.length };
}

export async function apagarRegistro(id: string): Promise<Registro[]> {
  await set(K_REGISTROS, (await lerTodosRegistros()).filter((r) => r.id !== id));
  return lerRegistros();
}

// ---------------------------------------------------------------- apoio e métricas

export async function lerApoio(): Promise<EstadoApoio> {
  return (await lerBruto<EstadoApoio>(K_APOIO)) ?? {};
}
export const salvarApoio = (a: EstadoApoio) => set(K_APOIO, a);

export async function lerUltimaSemanaMedida(): Promise<number> {
  return (await lerBruto<number>(K_SEMANA)) ?? 0;
}
export const salvarUltimaSemanaMedida = (n: number) => set(K_SEMANA, n);

/** Apaga tudo deste aparelho (página Sobre). */
export async function apagarTudo() {
  await Promise.all([del(K_FAMILIA), del(K_PERFIL_ANTIGO), del(K_REGISTROS), del(K_APOIO), del(K_SEMANA)]);
}

// ---------------------------------------------------------------- cópia de segurança

/** Versão 2: família inteira. A versão 1 (uma criança só) continua sendo aceita na importação. */
export type Copia = { versao: 2; criancas: Crianca[]; registros: Registro[]; exportadoEm: string };
type CopiaV1 = { versao: 1; perfil: { faixa: Faixa; apelido: string; inicio: string } | null; registros: Omit<Registro, "crianca">[] };

export async function gerarCopia(): Promise<Copia> {
  const f = await lerFamilia();
  return { versao: 2, criancas: f?.criancas ?? [], registros: await lerTodosRegistros(), exportadoEm: new Date().toISOString() };
}

function registroValido(r: unknown): r is Registro {
  const x = r as Registro;
  return !!x && typeof x.id === "string" && typeof x.dia === "string" && typeof x.brincadeira === "string";
}

/** Importa uma cópia sem apagar nada: junta crianças e registros que ainda não existem neste aparelho. */
export async function importarCopia(texto: string): Promise<number> {
  const dados = JSON.parse(texto) as Partial<Copia> | Partial<CopiaV1>;
  const f = await lerFamilia();
  if (!f) throw new Error("Família ainda não criada.");
  const todos = await lerTodosRegistros();
  const ids = new Set(todos.map((r) => r.id));
  let novos: Registro[] = [];
  let criancas = f.criancas;

  if (dados.versao === 1 && Array.isArray(dados.registros)) {
    // cópia antiga, de uma criança só: os registros vão para a criança ativa
    const ativa = ativaDe(f).id;
    novos = dados.registros.filter(registroValido).filter((r) => !ids.has(r.id)).map((r) => ({ ...r, crianca: ativa }));
  } else if (dados.versao === 2 && Array.isArray(dados.registros) && Array.isArray(dados.criancas)) {
    const conhecidas = new Set(criancas.map((c) => c.id));
    const vindas = dados.criancas.filter((c) => c && typeof c.id === "string" && !conhecidas.has(c.id));
    criancas = [...criancas, ...vindas].slice(0, MAX_CRIANCAS);
    const validas = new Set(criancas.map((c) => c.id));
    novos = dados.registros.filter(registroValido).filter((r) => !ids.has(r.id) && validas.has(r.crianca));
  } else {
    throw new Error("Arquivo não reconhecido.");
  }

  await set(K_REGISTROS, [...novos, ...todos].sort((a, b) => b.dia.localeCompare(a.dia)));
  if (criancas !== f.criancas) await salvarFamilia({ ...f, criancas });
  return novos.length;
}

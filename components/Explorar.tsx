"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ETIQUETAS,
  LUGARES,
  NOME_AREA,
  NOME_ETIQUETA,
  NOME_LUGAR,
  type Brincadeira,
  type Etiqueta,
  type Lugar,
} from "@/lib/esquema";
import { evento } from "@/lib/metricas";
import { useDados } from "@/lib/useDados";
import { Avancar, Lupa } from "./Icones";
import { NavInferior } from "./NavInferior";
import { Cabecalho, CONTEUDO } from "./Cabecalho";

const TEMPOS = [5, 10, 15] as const;
type Material = Etiqueta | "nada";

const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

function Chip({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={`min-h-11 rounded-full border-[1.5px] px-3.5 text-[15px] font-bold transition-colors ${ativo ? "border-azul bg-azul text-white" : "border-borda bg-white text-tinta hover:border-azul"}`}
    >
      {children}
    </button>
  );
}

export function Explorar({ lista }: { lista: Brincadeira[] }) {
  const { perfil } = useDados(false);
  const [busca, setBusca] = useState("");
  const [materiais, setMateriais] = useState<Set<Material>>(new Set());
  const [lugar, setLugar] = useState<Lugar | null>(null);
  const [tempo, setTempo] = useState<number | null>(null);

  const resultado = useMemo(() => {
    const q = normalizar(busca.trim());
    const tem = new Set([...materiais].filter((m): m is Etiqueta => m !== "nada"));
    const filtrarMateriais = materiais.size > 0;
    return lista
      .filter((b) => !perfil || b.faixas.includes(perfil.faixa))
      .filter((b) => !q || normalizar(`${b.nome} ${b.serve} ${b.materiais.join(" ")} ${NOME_AREA[b.area]}`).includes(q))
      .filter((b) => !filtrarMateriais || b.etiquetas.every((e) => tem.has(e)))
      .filter((b) => !lugar || b.lugares.includes(lugar))
      .filter((b) => !tempo || b.minutos <= tempo)
      .sort((a, b) => a.minutos - b.minutos || a.nome.localeCompare(b.nome));
  }, [lista, perfil, busca, materiais, lugar, tempo]);

  function alternarMaterial(m: Material) {
    const prox = new Set(materiais);
    if (prox.has(m)) prox.delete(m);
    else prox.add(m);
    setMateriais(prox);
    evento("filtro_usado", { tipo: "material", valor: m });
  }

  return (
    <>
      <Cabecalho atual="explorar" />
      <main className={`pb-nav flex flex-col gap-5 pt-5 md:pt-8 ${CONTEUDO}`}>
        <h1 className="m-0 font-display text-[30px] font-extrabold tracking-tight md:text-[40px]">Explorar</h1>
        <div className="flex flex-col gap-5 md:grid md:grid-cols-12 md:items-start md:gap-10">
        <aside className="flex flex-col gap-5 md:sticky md:top-6 md:col-span-4">

        <div className="flex min-h-[52px] items-center gap-2.5 rounded-[14px] bg-painel px-3.5">
          <Lupa tamanho={20} className="shrink-0 text-suave" />
          <label htmlFor="busca" className="sr-only">
            Buscar brincadeira
          </label>
          <input
            id="busca"
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar: estátua, massinha, livro…"
            className="min-h-11 min-w-0 flex-1 border-0 bg-transparent text-base text-tinta outline-none"
          />
        </div>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2.5 p-0 text-[17px] font-bold">O que você tem em casa?</legend>
          <div className="flex flex-wrap gap-2">
            <Chip ativo={materiais.has("nada")} onClick={() => alternarMaterial("nada")}>
              Nada, só a gente
            </Chip>
            {ETIQUETAS.map((e) => (
              <Chip key={e} ativo={materiais.has(e)} onClick={() => alternarMaterial(e)}>
                {NOME_ETIQUETA[e]}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2.5 p-0 text-[17px] font-bold">Onde vocês estão?</legend>
          <div className="flex flex-wrap gap-2">
            {LUGARES.map((l) => (
              <Chip
                key={l}
                ativo={lugar === l}
                onClick={() => {
                  setLugar(lugar === l ? null : l);
                  evento("filtro_usado", { tipo: "lugar", valor: l });
                }}
              >
                {NOME_LUGAR[l]}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2.5 p-0 text-[17px] font-bold">Quanto tempo vocês têm?</legend>
          <div className="flex flex-wrap gap-2">
            {TEMPOS.map((t) => (
              <Chip
                key={t}
                ativo={tempo === t}
                onClick={() => {
                  setTempo(tempo === t ? null : t);
                  evento("filtro_usado", { tipo: "tempo", valor: t });
                }}
              >
                Até {t} min
              </Chip>
            ))}
          </div>
        </fieldset>

        </aside>

        <section aria-labelledby="resultados" className="flex flex-col gap-2 md:col-span-8">
          <h2 id="resultados" className="m-0 mb-0.5 font-display text-[19px] font-extrabold" aria-live="polite">
            {resultado.length === 0
              ? "Nenhuma brincadeira com esses filtros"
              : `${resultado.length} ${resultado.length === 1 ? "brincadeira" : "brincadeiras"}`}
          </h2>
          <div className="flex flex-col gap-2 md:grid md:grid-cols-2 md:gap-3">
          {resultado.map((b) => (
            <Link
              key={b.id}
              href={`/brincadeira/${b.id}/`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-linha px-3.5 py-3 text-tinta no-underline transition-colors hover:border-azul hover:bg-painel md:min-h-[88px] md:px-4"
            >
              <span className="flex min-w-0 flex-col">
                <span className="font-display text-[17px] font-extrabold">
                  {b.nome}
                  {b.status === "rascunho" ? <span className="ml-2 align-middle text-xs font-bold uppercase tracking-wider text-alerta">rascunho</span> : null}
                </span>
                <span className="text-sm text-suave">
                  {NOME_AREA[b.area]} · {b.minutos} min · {b.materiais.length ? b.materiais[0].toLowerCase() : "sem material"}
                </span>
              </span>
              <Avancar tamanho={20} className="shrink-0 text-suave" />
            </Link>
          ))}
          </div>
          {resultado.length === 0 ? (
            <button
              type="button"
              onClick={() => {
                setBusca("");
                setMateriais(new Set());
                setLugar(null);
                setTempo(null);
              }}
              className="min-h-11 self-start font-bold text-azul"
            >
              Limpar os filtros
            </button>
          ) : null}
        </section>
        </div>
      </main>
      <NavInferior atual="explorar" />
    </>
  );
}

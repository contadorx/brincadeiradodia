"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NOME_AREA, NOME_FAIXA, type Brincadeira } from "@/lib/esquema";
import { lerRegistros } from "@/lib/armazenamento";
import { evento } from "@/lib/metricas";
import { compartilhar } from "@/lib/compartilhar";
import { Alerta, Compartilhar, Play, Voltar } from "./Icones";
import { Cabecalho, CONTEUDO } from "./Cabecalho";
import { Rodape } from "./Rodape";
import { PorQue, SeloRascunho } from "./PorQue";

export type Nivel = "facil" | "normal" | "dificil";
const NIVEIS: { id: Nivel; nome: string }[] = [
  { id: "facil", nome: "Mais fácil" },
  { id: "normal", nome: "Original" },
  { id: "dificil", nome: "Mais difícil" },
];

export const chaveNivel = (id: string) => `bdd:nivel:${id}`;

export function textoDoNivel(b: Brincadeira, n: Nivel) {
  return n === "facil" ? b.facil : n === "dificil" ? b.dificil : "Como nos passos acima.";
}

export function Ficha({ b, url }: { b: Brincadeira; url: string }) {
  const [nivel, setNivel] = useState<Nivel>("normal");
  const [jaBrincou, setJaBrincou] = useState(false);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    evento("brincadeira_aberta", { id: b.id, area: b.area });
    try {
      const salvo = sessionStorage.getItem(chaveNivel(b.id));
      if (salvo === "facil" || salvo === "normal" || salvo === "dificil") setNivel(salvo);
    } catch {
      /* ignora */
    }
    // O nível nunca muda sozinho: a família escolhe. Só avisamos que já brincaram desta
    // (com a criança ativa) e que pode experimentar o mais difícil, se quiser.
    lerRegistros()
      .then((registros) => setJaBrincou(registros.some((r) => r.brincadeira === b.id && r.reacao !== "nao")))
      .catch(() => {});
  }, [b.id, b.area]);

  function escolherNivel(n: Nivel) {
    setNivel(n);
    try {
      sessionStorage.setItem(chaveNivel(b.id), n);
    } catch {
      /* ignora */
    }
    evento("nivel_trocado", { id: b.id, nivel: n });
  }

  async function compartilharFicha() {
    const r = await compartilhar({
      title: b.nome,
      text: `${b.nome}: uma brincadeira de uns ${b.minutos} minutos para fazer com a criança, sem tela.`,
      url: `${url}/brincadeira/${b.id}/`,
    });
    if (r === "copia") setAviso("Link copiado.");
    if (r === "falhou") setAviso("Não deu para compartilhar. Copie o endereço da página.");
  }

  return (
    <>
      <Cabecalho />
      <main className={`flex flex-col gap-5 pb-[calc(112px+env(safe-area-inset-bottom,0px))] pt-3.5 md:pb-16 md:pt-6 ${CONTEUDO}`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex min-h-11 items-center gap-1 rounded-full font-bold text-tinta no-underline hover:text-azul">
            <Voltar tamanho={22} />
            Hoje
          </Link>
          <button type="button" onClick={compartilharFicha} aria-label="Compartilhar a brincadeira" className="grid size-11 place-items-center rounded-full bg-painel text-tinta transition-colors hover:bg-linha">
            <Compartilhar tamanho={20} />
          </button>
        </div>
        {aviso ? (
          <p role="status" className="m-0 -mt-3 text-right text-sm text-suave">
            {aviso}
          </p>
        ) : null}

        <div className="flex flex-col gap-5 md:grid md:grid-cols-12 md:items-start md:gap-10">
        <div className="flex flex-col gap-5 md:col-span-7">
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex min-h-[30px] items-center rounded-full bg-sol-claro px-3 text-[13px] font-bold">{NOME_AREA[b.area]}</span>
            <span className="inline-flex min-h-[30px] items-center rounded-full bg-painel px-3 text-[13px] font-bold">uns {b.minutos} min</span>
            {b.faixas.map((f) => (
              <span key={f} className="inline-flex min-h-[30px] items-center rounded-full bg-painel px-3 text-[13px] font-bold">
                {NOME_FAIXA[f]}
              </span>
            ))}
            {b.status === "rascunho" ? <SeloRascunho /> : null}
          </div>
          <h1 className="m-0 font-display text-[34px] font-extrabold leading-[1.02] tracking-tight md:text-[48px]">{b.nome}</h1>
          <p className="m-0 text-suave md:text-lg">{b.serve}</p>
        </div>

        <section aria-labelledby="precisa" className="flex flex-col gap-2">
          <h2 id="precisa" className="m-0 font-display text-[19px] font-extrabold">
            Você vai precisar
          </h2>
          {b.materiais.length ? (
            b.materiais.map((m, i) => (
              <label key={m} htmlFor={`material-${i}`} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[14px] bg-painel px-3.5 py-2">
                <input id={`material-${i}`} type="checkbox" className="size-[22px] shrink-0 accent-folha" />
                {m}
              </label>
            ))
          ) : (
            <p className="m-0 rounded-[14px] bg-painel px-3.5 py-3">Nada além de vocês dois.</p>
          )}
          {b.preparo ? (
            <p className="m-0 text-[15px]">
              <strong>Tempo de preparo:</strong> {b.preparo}.
            </p>
          ) : null}
        </section>

        <section aria-labelledby="como" className="flex flex-col gap-2.5">
          <h2 id="como" className="m-0 font-display text-[19px] font-extrabold">
            Como brincar
          </h2>
          <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
            {b.passos.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-tinta text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </section>

        </div>

        <aside className="flex flex-col gap-5 md:sticky md:top-6 md:col-span-5 md:rounded-3xl md:border md:border-linha md:p-6">
        <section aria-labelledby="nivel" className="flex flex-col gap-2.5">
          <h2 id="nivel" className="m-0 font-display text-[19px] font-extrabold">
            Ajuste para a criança
          </h2>
          <p id="nivel-dica" className="m-0 text-[15px] text-suave">
            Comece como achar melhor; pode repetir do mesmo jeito. Só aumente o desafio se estiver divertido. A criança pode parar quando quiser.
          </p>
          {jaBrincou ? (
            <p className="m-0 rounded-xl bg-azul-claro px-3.5 py-2.5 text-[15px]">Já brincaram desta. Se ficou fácil, experimente o mais difícil.</p>
          ) : null}
          <div role="group" aria-labelledby="nivel" aria-describedby="nivel-dica" className="grid grid-cols-3 gap-1 rounded-[14px] bg-painel p-1">
            {NIVEIS.map((n) => (
              <button
                key={n.id}
                type="button"
                aria-pressed={nivel === n.id}
                onClick={() => escolherNivel(n.id)}
                className={`min-h-11 rounded-[10px] text-[15px] font-bold transition-colors ${nivel === n.id ? "bg-white text-tinta shadow-sm" : "text-suave hover:text-tinta"}`}
              >
                {n.nome}
              </button>
            ))}
          </div>
          <p className="m-0 rounded-[14px] border-[1.5px] border-dashed border-borda px-3.5 py-3">{textoDoNivel(b, nivel)}</p>
        </section>

        <section aria-labelledby="conversa" className="flex flex-col gap-2">
          <h2 id="conversa" className="m-0 font-display text-[19px] font-extrabold">
            Para puxar conversa
          </h2>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {b.conversa.map((c) => (
              <li key={c} className="italic">
                “{c}”
              </li>
            ))}
          </ul>
        </section>

        <div className="flex items-start gap-3 rounded-2xl bg-alerta-claro p-3.5 text-alerta" role="note" aria-label="Segurança">
          <Alerta tamanho={22} className="shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="m-0">
              <strong>Sempre com um adulto acompanhando.</strong> A criança não fica sozinha com os materiais em nenhum momento.
            </p>
            {b.seguranca ? <p className="m-0">{b.seguranca}</p> : null}
          </div>
        </div>

        <PorQue b={b} />

        <Link
          href={`/brincadeira/${b.id}/brincando/`}
          className="hidden min-h-[58px] items-center justify-center gap-2.5 rounded-2xl bg-azul text-lg font-bold text-white no-underline transition-colors hover:bg-azul-escuro md:flex"
        >
          <Play tamanho={20} />
          Começar a brincadeira
        </Link>
        </aside>
        </div>
        <Rodape />
      </main>

      <div className="nao-imprimir fixed inset-x-0 bottom-0 z-20 border-t border-linha bg-white md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="mx-auto max-w-md px-5 pb-5 pt-3">
          <Link
            href={`/brincadeira/${b.id}/brincando/`}
            className="flex min-h-[58px] items-center justify-center gap-2.5 rounded-2xl bg-azul text-lg font-bold text-white no-underline"
          >
            <Play tamanho={20} />
            Começar a brincadeira
          </Link>
        </div>
      </div>
    </>
  );
}

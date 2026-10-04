"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NOME_AREA, NOME_FAIXA, type Brincadeira } from "@/lib/esquema";
import { lerPerfil } from "@/lib/armazenamento";
import { deChave } from "@/lib/datas";
import { semanaDeUso } from "@/lib/plano";
import { evento } from "@/lib/metricas";
import { compartilhar } from "@/lib/compartilhar";
import { Alerta, Compartilhar, Play, Voltar } from "./Icones";

export type Nivel = "facil" | "normal" | "dificil";
const NIVEIS: { id: Nivel; nome: string }[] = [
  { id: "facil", nome: "Mais fácil" },
  { id: "normal", nome: "Normal" },
  { id: "dificil", nome: "Mais difícil" },
];

export const chaveNivel = (id: string) => `bdd:nivel:${id}`;

export function textoDoNivel(b: Brincadeira, n: Nivel) {
  return n === "facil" ? b.facil : n === "dificil" ? b.dificil : "Como nos passos acima.";
}

export function Ficha({ b, url }: { b: Brincadeira; url: string }) {
  const [nivel, setNivel] = useState<Nivel>("normal");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    evento("brincadeira_aberta", { id: b.id, area: b.area });
    let salvo: string | null = null;
    try {
      salvo = sessionStorage.getItem(chaveNivel(b.id));
    } catch {
      /* ignora */
    }
    if (salvo === "facil" || salvo === "normal" || salvo === "dificil") {
      setNivel(salvo);
      return;
    }
    lerPerfil().then((p) => {
      if (p && semanaDeUso(deChave(p.inicio), new Date()) >= 3) setNivel("dificil");
    });
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
      text: `${b.nome}: uma brincadeira de ${b.minutos} minutos para fazer com a criança, sem tela.`,
      url: `${url}/brincadeira/${b.id}/`,
    });
    if (r === "copia") setAviso("Link copiado.");
    if (r === "falhou") setAviso("Não deu para compartilhar. Copie o endereço da página.");
  }

  return (
    <>
      <main className="mx-auto flex max-w-md flex-col gap-5 px-5 pt-3.5" style={{ paddingBottom: "calc(112px + env(safe-area-inset-bottom, 0px))" }}>
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex min-h-11 items-center gap-1 font-bold text-tinta no-underline">
            <Voltar tamanho={22} />
            Hoje
          </Link>
          <button type="button" onClick={compartilharFicha} aria-label="Compartilhar a brincadeira" className="grid size-11 place-items-center rounded-full bg-painel text-tinta">
            <Compartilhar tamanho={20} />
          </button>
        </div>
        {aviso ? (
          <p role="status" className="m-0 -mt-3 text-right text-sm text-suave">
            {aviso}
          </p>
        ) : null}

        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex min-h-[30px] items-center rounded-full bg-sol-claro px-3 text-[13px] font-bold">{NOME_AREA[b.area]}</span>
            <span className="inline-flex min-h-[30px] items-center rounded-full bg-painel px-3 text-[13px] font-bold">{b.minutos} min</span>
            {b.faixas.map((f) => (
              <span key={f} className="inline-flex min-h-[30px] items-center rounded-full bg-painel px-3 text-[13px] font-bold">
                {NOME_FAIXA[f]}
              </span>
            ))}
          </div>
          <h1 className="m-0 font-display text-[34px] font-extrabold leading-[1.02] tracking-tight">{b.nome}</h1>
          <p className="m-0 text-suave">{b.serve}</p>
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

        <section aria-labelledby="nivel" className="flex flex-col gap-2.5">
          <h2 id="nivel" className="m-0 font-display text-[19px] font-extrabold">
            Ajuste para a criança
          </h2>
          <div role="group" aria-labelledby="nivel" className="grid grid-cols-3 gap-1 rounded-[14px] bg-painel p-1">
            {NIVEIS.map((n) => (
              <button
                key={n.id}
                type="button"
                aria-pressed={nivel === n.id}
                onClick={() => escolherNivel(n.id)}
                className={`min-h-11 rounded-[10px] text-[15px] font-bold ${nivel === n.id ? "bg-white text-tinta shadow-sm" : "text-suave"}`}
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

        {b.seguranca ? (
          <div className="flex items-start gap-3 rounded-2xl bg-alerta-claro p-3.5 text-alerta">
            <Alerta tamanho={22} className="shrink-0" />
            <p className="m-0">
              <strong>Segurança.</strong> {b.seguranca}
            </p>
          </div>
        ) : null}

        <p className="m-0 text-[13px] text-suave">Base: {b.base}.</p>
      </main>

      <div className="nao-imprimir fixed inset-x-0 bottom-0 z-20 border-t border-linha bg-white" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="mx-auto max-w-md px-5 pb-5 pt-3">
          <Link
            href={`/brincadeira/${b.id}/brincando/`}
            className="flex min-h-[58px] items-center justify-center gap-2.5 rounded-2xl bg-azul text-lg font-bold text-white no-underline"
          >
            <Play tamanho={20} />
            Começar os {b.minutos} minutos
          </Link>
        </div>
      </div>
    </>
  );
}

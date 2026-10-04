"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Brincadeira } from "@/lib/esquema";
import { apagarRegistro, gerarCopia, importarCopia, lerRegistros } from "@/lib/armazenamento";
import { chaveDia, dataCurta, deChave, meiaNoite, somaDias, DIAS_CURTOS } from "@/lib/datas";
import { baixarArquivo } from "@/lib/compartilhar";
import { evento } from "@/lib/metricas";
import { useDados } from "@/lib/useDados";
import { Carregando } from "./Carregando";
import { Baixar } from "./Icones";
import { NavInferior } from "./NavInferior";

const REACAO = {
  adorou: { nome: "Adorou", classe: "bg-folha-claro text-folha-escuro" },
  ok: { nome: "Foi ok", classe: "bg-painel text-suave" },
  nao: { nome: "Não rolou", classe: "bg-alerta-claro text-alerta" },
} as const;

export function Diario({ lista }: { lista: Brincadeira[] }) {
  const { perfil, registros, setRegistros, pronto } = useDados();
  const [apagando, setApagando] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");
  const arquivo = useRef<HTMLInputElement>(null);

  if (!pronto || !perfil) return <Carregando />;

  const porId = new Map(lista.map((b) => [b.id, b]));
  const hoje = meiaNoite(new Date());
  const kHoje = chaveDia(hoje);
  const dias = Array.from({ length: 7 }, (_, i) => somaDias(hoje, i - 6));
  const feitos = new Set(registros.map((r) => r.dia));
  const qtd = dias.filter((d) => feitos.has(chaveDia(d))).length;

  const contagem = new Map<string, number>();
  for (const r of registros) if (r.reacao === "adorou") contagem.set(r.brincadeira, (contagem.get(r.brincadeira) ?? 0) + 1);
  const preferidas = [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => porId.get(id))
    .filter((b): b is Brincadeira => !!b);

  async function exportar() {
    const copia = await gerarCopia();
    baixarArquivo(`diario-brincadeira-do-dia-${kHoje}.json`, JSON.stringify(copia, null, 2), "application/json");
    evento("diario_exportado", { registros: copia.registros.length });
    setAviso("Cópia salva. Guarde o arquivo para levar para outro celular.");
  }

  async function importar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const n = await importarCopia(await f.text());
      setRegistros(await lerRegistros());
      evento("diario_importado", { registros: n });
      setAviso(n ? `${n} ${n === 1 ? "registro importado" : "registros importados"}.` : "Nada novo para importar.");
    } catch {
      setAviso("Esse arquivo não é uma cópia do diário.");
    } finally {
      e.target.value = "";
    }
  }

  async function apagar(id: string) {
    if (apagando !== id) {
      setApagando(id);
      return;
    }
    setRegistros(await apagarRegistro(id));
    setApagando(null);
  }

  return (
    <>
      <main className="pb-nav mx-auto flex max-w-md flex-col gap-4 px-5 pt-5">
        <div>
          <h1 className="m-0 font-display text-[30px] font-extrabold tracking-tight">{perfil.apelido ? `Diário de ${perfil.apelido}` : "Diário"}</h1>
          <p className="m-0 mt-0.5 text-[15px] text-suave">Fica só neste celular.</p>
        </div>

        <div className="flex flex-col gap-3.5 rounded-[22px] bg-folha-claro p-[18px]">
          <div className="flex flex-wrap items-baseline gap-x-2.5">
            <span className="font-display text-[44px] font-extrabold leading-none tracking-tight">{qtd} de 7</span>
            <span className="text-folha-escuro">dias com brincadeira nos últimos 7 dias</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-folha-escuro">
            {dias.map((d) => {
              const k = chaveDia(d);
              const feito = feitos.has(k);
              const eHoje = k === kHoje;
              return (
                <div key={k} className="flex flex-col items-center gap-1">
                  <span>{eHoje ? "Hoje" : DIAS_CURTOS[d.getDay()]}</span>
                  <span
                    className={`grid size-[30px] place-items-center rounded-full ${
                      feito ? "bg-folha text-white" : eHoje ? "border-[2.5px] border-azul bg-white text-tinta" : "bg-white"
                    }`}
                    aria-label={`${DIAS_CURTOS[d.getDay()]} ${d.getDate()}${feito ? ", teve brincadeira" : ""}`}
                  >
                    {d.getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <section aria-labelledby="registros" className="flex flex-col gap-2">
          <h2 id="registros" className="m-0 font-display text-[19px] font-extrabold">
            O que vocês fizeram
          </h2>
          {registros.length === 0 ? (
            <p className="m-0 rounded-2xl border-[1.5px] border-dashed border-borda p-4 text-suave">
              Ainda não tem nada aqui. Quando vocês terminarem uma brincadeira e tocarem em “Salvar no diário”, ela aparece nesta lista.{" "}
              <Link href="/" className="font-bold">
                Ver a de hoje
              </Link>
            </p>
          ) : (
            registros.slice(0, 60).map((r) => {
              const b = porId.get(r.brincadeira);
              return (
                <div key={r.id} className="flex flex-col gap-1 rounded-2xl border border-linha px-3.5 py-3">
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="font-bold">{b?.nome ?? r.brincadeira}</span>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${REACAO[r.reacao].classe}`}>{REACAO[r.reacao].nome}</span>
                  </div>
                  <span className="text-sm text-suave">
                    {dataCurta(deChave(r.dia))}
                    {r.nota ? ` · ${r.nota}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => apagar(r.id)}
                    className={`nao-imprimir min-h-9 self-end text-sm font-bold ${apagando === r.id ? "text-alerta" : "text-suave"}`}
                  >
                    {apagando === r.id ? "Tocar de novo para apagar" : "Apagar"}
                  </button>
                </div>
              );
            })
          )}
        </section>

        {preferidas.length ? (
          <section aria-labelledby="preferidas" className="flex flex-col gap-2">
            <h2 id="preferidas" className="m-0 font-display text-[19px] font-extrabold">
              As preferidas
            </h2>
            <div className="flex flex-wrap gap-2">
              {preferidas.map((b) => (
                <Link key={b.id} href={`/brincadeira/${b.id}/`} className="inline-flex min-h-10 items-center rounded-full bg-sol-claro px-3.5 text-[15px] font-bold text-tinta no-underline">
                  {b.nome}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <div className="nao-imprimir flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={exportar}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-[14px] border-[1.5px] border-tinta bg-white font-bold text-tinta"
            >
              <Baixar tamanho={20} />
              Exportar
            </button>
            <button
              type="button"
              onClick={() => arquivo.current?.click()}
              className="flex min-h-[52px] items-center justify-center rounded-[14px] border-[1.5px] border-borda bg-white font-bold text-tinta"
            >
              Importar
            </button>
            <input ref={arquivo} type="file" accept="application/json,.json" className="hidden" onChange={importar} aria-label="Importar cópia do diário" />
          </div>
          <button type="button" onClick={() => window.print()} className="min-h-11 font-bold text-azul">
            Salvar em PDF ou imprimir
          </button>
          {aviso ? (
            <p role="status" className="m-0 text-center text-sm text-suave">
              {aviso}
            </p>
          ) : null}
          <p className="m-0 text-center text-[13px] text-suave">Sem conta e sem nuvem. Antes de trocar de celular, exporte o diário.</p>
        </div>
      </main>
      <NavInferior atual="diario" />
    </>
  );
}

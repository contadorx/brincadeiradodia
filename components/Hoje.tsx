"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NOME_AREA, NOME_FAIXA, type Brincadeira } from "@/lib/esquema";
import { chaveDia, dataExtensa, deChave, meiaNoite, somaDias, DIAS, DIAS_CURTOS } from "@/lib/datas";
import { brincadeiraDoDia, semMaterial } from "@/lib/plano";
import { useDados } from "@/lib/useDados";
import { Cabecalho, CONTEUDO } from "./Cabecalho";
import { Carregando } from "./Carregando";
import { Casa, Check, Fechar, Info, Play, Relogio } from "./Icones";
import { Marca } from "./Marca";
import { NavInferior } from "./NavInferior";

const NOME_REACAO = { adorou: "Adorou", ok: "Foi ok", nao: "Não rolou" } as const;

export function Hoje({ lista }: { lista: Brincadeira[] }) {
  const { perfil, registros, pronto } = useDados();
  const [avisoInstalar, setAvisoInstalar] = useState(false);

  useEffect(() => {
    const instalado =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    let dispensado = false;
    try {
      dispensado = localStorage.getItem("bdd:aviso-instalar") === "dispensado";
    } catch {
      /* sem armazenamento: mostra o aviso */
    }
    setAvisoInstalar(!instalado && !dispensado);
  }, []);

  if (!pronto || !perfil) return <Carregando />;

  const hoje = meiaNoite(new Date());
  const inicio = deChave(perfil.inicio);
  const { brincadeira: b, semana } = brincadeiraDoDia(lista, perfil.faixa, inicio, hoje);
  const extras = semMaterial(lista, perfil.faixa, hoje, b?.id);
  const kHoje = chaveDia(hoje);
  const feita = b ? registros.find((r) => r.dia === kHoje && r.brincadeira === b.id) : undefined;
  const diasFeitos = new Set(registros.map((r) => r.dia));
  const ultimos7 = Array.from({ length: 7 }, (_, i) => somaDias(hoje, i - 6));
  const qtd7 = ultimos7.filter((d) => diasFeitos.has(chaveDia(d))).length;
  const domingo = somaDias(hoje, -hoje.getDay());
  const semanaAtual = Array.from({ length: 7 }, (_, i) => {
    const d = somaDias(domingo, i);
    return { d, k: chaveDia(d), b: brincadeiraDoDia(lista, perfil.faixa, inicio, d).brincadeira };
  });

  const dispensarAviso = () => {
    setAvisoInstalar(false);
    try {
      localStorage.setItem("bdd:aviso-instalar", "dispensado");
    } catch {
      /* ignora */
    }
  };

  const chipPerfil = (
    <Link
      href="/boas-vindas/"
      aria-label={`Trocar a criança ou a idade: ${perfil.apelido ? perfil.apelido + ", " : ""}${NOME_FAIXA[perfil.faixa]}`}
      className="inline-flex min-h-10 max-w-[45%] items-center truncate whitespace-nowrap rounded-full bg-painel px-3.5 text-sm font-bold text-tinta no-underline hover:bg-linha md:max-w-none"
    >
      {perfil.apelido ? `${perfil.apelido} · ` : ""}
      {NOME_FAIXA[perfil.faixa]}
    </Link>
  );

  return (
    <>
      <Cabecalho atual="hoje">{chipPerfil}</Cabecalho>
      <main className={`pb-nav flex flex-col gap-5 pt-4 md:gap-8 md:pt-8 ${CONTEUDO}`}>
        <header className="flex items-center justify-between gap-3 md:hidden">
          <Marca />
          {chipPerfil}
        </header>

        {avisoInstalar ? (
          <div className="flex items-center gap-3 rounded-2xl border border-linha px-4 py-3">
            <p className="m-0 flex-1 text-[15px]">
              Instale o app: abre direto, como um aplicativo, e funciona sem internet.{" "}
              <Link href="/instalar/" className="font-bold">
                Como fazer
              </Link>
            </p>
            <button type="button" onClick={dispensarAviso} aria-label="Dispensar aviso" className="grid size-10 shrink-0 place-items-center rounded-full text-suave hover:bg-painel">
              <Fechar tamanho={18} />
            </button>
          </div>
        ) : null}

        <div className="flex flex-col gap-5 md:grid md:grid-cols-12 md:items-start md:gap-10">
          <div className="flex flex-col gap-5 md:col-span-7">
            <div>
              <p className="m-0 text-[15px] text-suave">{dataExtensa(hoje)}</p>
              <h1 className="m-0 mt-0.5 font-display text-[31px] font-extrabold leading-[1.1] tracking-tight md:text-[42px]">
                A brincadeira de <span className="marca-texto">hoje</span>
              </h1>
            </div>

            {b ? (
              <article className="flex flex-col gap-3.5 rounded-3xl bg-sol-claro p-5 md:gap-4 md:p-8">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex min-h-[30px] items-center rounded-full bg-white px-3 text-[13px] font-bold">{NOME_AREA[b.area]}</span>
                  <span className="inline-flex min-h-[30px] items-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-bold">
                    <Relogio tamanho={15} />
                    {b.minutos} min
                  </span>
                  <span className="inline-flex min-h-[30px] items-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-bold">
                    <Casa tamanho={15} />
                    {b.lugares.includes("casa") ? "Em casa" : "Fora de casa"}
                  </span>
                  {semana >= 3 ? (
                    <span className="inline-flex min-h-[30px] items-center rounded-full bg-tinta px-3 text-[13px] font-bold text-white">Nível 2 esta semana</span>
                  ) : null}
                </div>
                <h2 className="m-0 font-display text-[34px] font-extrabold leading-[1.02] tracking-tight md:text-[48px]">{b.nome}</h2>
                <p className="m-0 md:text-lg">{b.serve}</p>
                <div className="rounded-2xl bg-white px-3.5 py-3 md:px-5 md:py-4">
                  <p className="m-0 mb-0.5 text-xs font-bold uppercase tracking-wider text-suave">Você vai precisar</p>
                  <p className="m-0">{b.materiais.length ? b.materiais.join(" · ") : "Nada além de vocês dois"}</p>
                </div>
                {feita ? (
                  <p className="m-0 flex items-center gap-2 font-bold text-folha-escuro">
                    <Check tamanho={20} /> Feita hoje · {NOME_REACAO[feita.reacao]}
                  </p>
                ) : null}
                <div className="flex gap-2.5 md:max-w-md">
                  <Link
                    href={`/brincadeira/${b.id}/brincando/`}
                    className="flex min-h-14 flex-[2] items-center justify-center gap-2.5 rounded-2xl bg-azul text-lg font-bold text-white no-underline transition-colors hover:bg-azul-escuro"
                  >
                    <Play tamanho={20} />
                    {feita ? "Brincar de novo" : "Começar"}
                  </Link>
                  <Link
                    href={`/brincadeira/${b.id}/`}
                    className="flex min-h-14 flex-1 items-center justify-center rounded-2xl border-[1.5px] border-tinta bg-white font-bold text-tinta no-underline transition-colors hover:bg-painel"
                  >
                    Ver ficha
                  </Link>
                </div>
              </article>
            ) : (
              <article className="rounded-3xl bg-painel p-5">
                <h2 className="m-0 font-display text-2xl font-extrabold">Ainda estamos preparando</h2>
                <p className="mb-0 mt-2">
                  As brincadeiras para {NOME_FAIXA[perfil.faixa]} ainda não estão prontas. Por enquanto, o site tem brincadeiras para 3 a 4 anos.
                </p>
                <Link href="/boas-vindas/" className="mt-3 inline-flex min-h-11 items-center font-bold">
                  Trocar a idade
                </Link>
              </article>
            )}
          </div>

          <aside className="flex flex-col gap-5 md:col-span-5 md:pt-[86px]">
            {extras.length ? (
              <section aria-labelledby="sem-material" className="flex flex-col gap-2.5">
                <h2 id="sem-material" className="m-0 font-display text-[19px] font-extrabold">
                  Sem material em casa?
                </h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {extras.map((x) => (
                    <Link
                      key={x.id}
                      href={`/brincadeira/${x.id}/`}
                      className="flex flex-col gap-0.5 rounded-[18px] bg-painel p-3.5 text-tinta no-underline transition-colors hover:bg-linha"
                    >
                      <span className="font-display text-[17px] font-extrabold">{x.nome}</span>
                      <span className="text-sm text-suave">
                        {x.minutos} min · {x.lugares.includes("rua") ? "em casa ou num passeio" : x.lugares.includes("carro") ? "até no carro" : "só vocês"}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <Link
              href="/diario/"
              className="flex items-center justify-between gap-3 rounded-[18px] border border-linha px-4 py-3.5 text-tinta no-underline transition-colors hover:bg-painel"
            >
              <span className="flex flex-col">
                <span className="font-bold">Últimos 7 dias</span>
                <span className="text-sm text-suave">
                  {qtd7 === 0 ? "Nenhuma brincadeira ainda" : `${qtd7} ${qtd7 === 1 ? "dia" : "dias"} com brincadeira`}
                </span>
              </span>
              <span className="flex items-center gap-1.5" aria-hidden="true">
                {ultimos7.map((d) => {
                  const k = chaveDia(d);
                  const eHoje = k === kHoje;
                  return (
                    <span
                      key={k}
                      title={DIAS_CURTOS[d.getDay()]}
                      className={`block rounded-full ${
                        diasFeitos.has(k) ? "size-3 bg-folha" : eHoje ? "size-3.5 border-[2.5px] border-azul" : "size-3 border-2 border-linha"
                      }`}
                    />
                  );
                })}
              </span>
            </Link>

            <section aria-labelledby="semana" className="flex flex-col gap-2">
              <h2 id="semana" className="m-0 font-display text-[19px] font-extrabold">
                A semana
              </h2>
              <ol className="m-0 flex list-none flex-col p-0">
                {semanaAtual.map(({ d, k, b: bd }) => {
                  const eHoje = k === kHoje;
                  const feito = diasFeitos.has(k);
                  return (
                    <li key={k} className="border-t border-linha first:border-t-0">
                      {bd ? (
                        <Link
                          href={`/brincadeira/${bd.id}/`}
                          className={`flex items-center gap-3 rounded-xl px-2 py-2.5 text-tinta no-underline transition-colors hover:bg-painel ${eHoje ? "bg-azul-claro" : ""}`}
                          aria-current={eHoje ? "date" : undefined}
                        >
                          <span className={`w-10 shrink-0 text-sm font-bold ${eHoje ? "text-azul" : "text-suave"}`}>{eHoje ? "Hoje" : DIAS_CURTOS[d.getDay()]}</span>
                          <span className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate font-bold">{bd.nome}</span>
                            <span className="truncate text-[13px] text-suave">{NOME_AREA[bd.area]}</span>
                          </span>
                          {feito ? (
                            <>
                              <Check tamanho={18} className="shrink-0 text-folha" />
                              <span className="sr-only">feita</span>
                            </>
                          ) : null}
                        </Link>
                      ) : (
                        <span className="flex px-2 py-2.5 text-suave">{DIAS[d.getDay()]}: em preparação</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>

            <Link href="/sobre/" className="inline-flex min-h-11 items-center gap-2 self-center font-bold text-suave no-underline md:hidden">
              <Info tamanho={18} />
              Sobre o site e como apoiar
            </Link>
          </aside>
        </div>
      </main>
      <NavInferior atual="hoje" />
    </>
  );
}

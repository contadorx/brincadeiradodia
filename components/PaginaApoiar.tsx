"use client";

import Link from "next/link";
import { CONTEUDO_SITE } from "@/lib/compartilhar";
import type { OpcaoPix } from "@/lib/apoio";
import { Check, Compartilhar, Voltar } from "./Icones";
import { BotaoCompartilhar } from "./JanelaCompartilhar";
import { JaContribui, PixApoio } from "./PixApoio";
import { Cabecalho, CONTEUDO } from "./Cabecalho";
import { NavInferior } from "./NavInferior";
import { Rodape } from "./Rodape";

/** Página Apoiar: uma página só para quem quer ajudar (compartilhar ou PIX). */
export function PaginaApoiar({
  opcoes,
  responsavel,
  cobre,
  revisar,
}: {
  opcoes: OpcaoPix[] | null;
  responsavel: string;
  cobre: readonly string[];
  revisar: boolean;
}) {
  return (
    <>
      <Cabecalho atual="apoiar" />
      <main className={`pb-nav flex flex-col gap-6 pt-3.5 md:pt-8 ${CONTEUDO}`}>
        <Link href="/" className="inline-flex min-h-11 items-center gap-1 self-start font-bold text-tinta no-underline md:hidden">
          <Voltar tamanho={22} />
          Hoje
        </Link>
        <div className="flex flex-col gap-6 md:grid md:grid-cols-12 md:items-start md:gap-12">
          <div className="flex flex-col gap-3 md:col-span-6">
            <h1 className="m-0 -mt-3 font-display text-[30px] font-extrabold leading-[1.1] tracking-tight md:mt-0 md:text-[40px]">
              Ajude o site a continuar de graça
            </h1>
            <p className="m-0 md:text-lg">
              O Brincadeira do Dia não tem anúncios nem cadastro e não vende dados. Ele se mantém com a ajuda de quem usa, de dois jeitos.
            </p>

            <section aria-labelledby="ap-compartilhar" className="mt-2 flex flex-col gap-2.5 rounded-3xl bg-azul-claro p-5">
              <h2 id="ap-compartilhar" className="m-0 font-display text-[21px] font-extrabold">
                1. Mande para outra família
              </h2>
              <p className="m-0">É o jeito mais simples de ajudar: cada família nova faz o site valer mais.</p>
              <BotaoCompartilhar
                conteudo={CONTEUDO_SITE}
                origem="apoio-pagina"
                className="flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-azul text-[17px] font-bold text-white"
              >
                <Compartilhar tamanho={20} />
                Compartilhar com outra família
              </BotaoCompartilhar>
            </section>

            {opcoes ? (
              <section aria-labelledby="ap-pix" className="flex flex-col gap-2.5 rounded-3xl bg-painel p-5">
                <h2 id="ap-pix" className="m-0 font-display text-[21px] font-extrabold">
                  2. Contribua com um PIX
                </h2>
                <p className="m-0">Qualquer valor ajuda. É voluntário e não muda nada no uso.</p>
                <PixApoio opcoes={opcoes} origem="apoio-pagina" comQr />
                {responsavel ? (
                  <p className="m-0 text-sm text-suave">
                    Quem recebe: {responsavel}, responsável pelo site. É esse o nome que o app do banco vai mostrar.
                  </p>
                ) : null}
                <JaContribui origem="apoio-pagina" />
              </section>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 md:col-span-6 md:mt-2">
            <h2 className="m-0 font-display text-[19px] font-extrabold">O que o apoio ajuda a pagar</h2>
            <ul className="m-0 flex list-none flex-col p-0">
              {cobre.map((item) => (
                <li key={item} className="flex items-center gap-3 border-t border-linha py-2.5">
                  <Check tamanho={18} className="shrink-0 text-folha" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="m-0 text-sm text-suave">Tudo continua gratuito para todas as famílias, apoiando ou não.</p>
            <Link href="/sobre/" className="font-bold">
              Quem faz o site e como escolhemos as brincadeiras
            </Link>
            {revisar ? (
              <Link href="/revisar/" className="font-bold">
                É profissional de saúde ou educação? Doe uma revisão
              </Link>
            ) : null}
          </div>
        </div>
        <Rodape />
      </main>
      <NavInferior atual="apoiar" />
    </>
  );
}

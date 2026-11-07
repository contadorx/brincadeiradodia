"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { evento } from "@/lib/metricas";
import type { LoteComPlacar } from "@/lib/revisao";
import { Check, Voltar } from "./Icones";
import { Cabecalho, CONTEUDO } from "./Cabecalho";
import { NavInferior } from "./NavInferior";
import { Rodape } from "./Rodape";

type Placar = {
  total: number;
  revisadas: number;
  prioridade: number;
  prioridadeRevisadas: number;
  lotes: LoteComPlacar[];
  nomes: Record<string, string>;
};

const AUTORIZACAO =
  "Autorizo o Brincadeira do Dia a mostrar meu nome e minha profissão como revisor(a) das brincadeiras que conferi, na página de cada uma e na página Sobre. Posso pedir para retirar a qualquer momento.";

/** E-mail já com o modelo de resposta: quem revisa só preenche. */
function linkEmail(contato: string, assunto: string, alvo: string) {
  const corpo = [
    `Olá! Quero revisar: ${alvo}.`,
    "",
    "1. Uma linha por brincadeira: OK / OK com ajustes: ... / Não publicaria: ...",
    "",
    "2. Nome e profissão como devem aparecer:",
    "   Registro profissional (fica só com vocês, não vai para o site):",
    "",
    `3. ${AUTORIZACAO}`,
  ].join("\n");
  return `mailto:${contato}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
}

/** Página Revisar: o convite para profissionais, os lotes e o placar das revisões. */
export function PaginaRevisar({ placar, contato }: { placar: Placar; contato: string }) {
  const [veioDe, setVeioDe] = useState<string | null>(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("b");
    if (id && Object.prototype.hasOwnProperty.call(placar.nomes, id)) setVeioDe(id);
  }, [placar.nomes]);

  const nomeVeioDe = veioDe ? placar.nomes[veioDe] : "";
  const pct = placar.total ? Math.round((placar.revisadas / placar.total) * 100) : 0;

  return (
    <>
      <Cabecalho />
      <main className={`pb-nav flex flex-col gap-6 pt-3.5 md:pt-8 ${CONTEUDO}`}>
        <Link href="/" className="inline-flex min-h-11 items-center gap-1 self-start font-bold text-tinta no-underline md:hidden">
          <Voltar tamanho={22} />
          Hoje
        </Link>
        <div className="flex max-w-3xl flex-col gap-3">
          <h1 className="m-0 -mt-3 font-display text-[30px] font-extrabold leading-[1.1] tracking-tight md:mt-0 md:text-[40px]">Revise uma brincadeira</h1>
          <p className="m-0 md:text-lg">
            Você lê umas 8 brincadeiras curtas, diz o que mudaria e, se quiser, seu nome aparece como revisor(a). É para profissionais de pediatria,
            enfermagem, nutrição, fonoaudiologia, terapia ocupacional, fisioterapia, psicologia, psicopedagogia e educação infantil.
          </p>
        </div>

        {veioDe ? (
          <section aria-labelledby="rv-esta" className="flex flex-col gap-2.5 rounded-3xl bg-sol-claro p-5 md:max-w-3xl">
            <h2 id="rv-esta" className="m-0 font-display text-[19px] font-extrabold">
              Você veio de “{nomeVeioDe}”
            </h2>
            <p className="m-0">Pode começar só por ela: são uns 5 minutos.</p>
            <a
              href={linkEmail(contato, `Revisão voluntária: ${nomeVeioDe}`, nomeVeioDe)}
              onClick={() => evento("revisao_convite_clicado", { origem: "revisar", alvo: "ficha" })}
              className="flex min-h-[52px] items-center justify-center rounded-2xl bg-azul px-4 text-base font-bold text-white no-underline"
            >
              Quero revisar esta brincadeira
            </a>
          </section>
        ) : null}

        <section aria-labelledby="rv-placar" className="flex flex-col gap-2 rounded-3xl bg-painel p-5 md:max-w-3xl">
          <h2 id="rv-placar" className="m-0 font-display text-[19px] font-extrabold">
            {placar.revisadas} de {placar.total} brincadeiras revisadas
          </h2>
          <div className="h-3 overflow-hidden rounded-full bg-white" role="img" aria-label={`${pct}% das brincadeiras revisadas`}>
            <div className="h-full rounded-full bg-folha" style={{ width: `${Math.max(pct, placar.revisadas ? 2 : 0)}%` }} />
          </div>
          <p className="m-0 text-[15px]">
            Prioridade: as {placar.prioridade} fichas de água, comida, plantas e da faixa de 1 a 2 anos ({placar.prioridadeRevisadas} revisadas até
            agora).
          </p>
        </section>

        <section aria-labelledby="rv-como" className="flex flex-col gap-2 md:max-w-3xl">
          <h2 id="rv-como" className="m-0 font-display text-[21px] font-extrabold">
            Como funciona
          </h2>
          <ul className="m-0 flex flex-col gap-1.5 pl-5">
            <li>Cada ficha leva uns 5 minutos. Olhe a segurança, se a brincadeira serve para a idade e se algum passo pode ser mal entendido.</li>
            <li>
              Eu aplico os ajustes. Se você autorizar, a ficha mostra “Revisada por [seu nome], [profissão], em [mês/ano]” e seu nome entra nos
              agradecimentos da página Sobre. Se preferir, aparece só a profissão.
            </li>
            <li>Seu registro profissional fica só com a gente: não vai para o site. Você pode pedir para tirar seu nome quando quiser.</li>
            <li>Se a ficha mudar depois da sua revisão, o selo sai até você olhar de novo: seu nome nunca fica num texto que você não viu.</li>
            <li>É voluntário: não há pagamento, e o site não tem fins comerciais.</li>
          </ul>
        </section>

        <section aria-labelledby="rv-lotes" className="flex flex-col gap-3">
          <h2 id="rv-lotes" className="m-0 font-display text-[21px] font-extrabold">
            Lotes para começar
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {placar.lotes.map((l) => (
              <article key={l.id} aria-labelledby={`lote-${l.id}`} className="flex flex-col gap-2 rounded-3xl border border-linha p-5">
                <h3 id={`lote-${l.id}`} className="m-0 font-display text-[19px] font-extrabold">
                  Lote {l.id} · {l.tema}
                </h3>
                <p className="m-0 text-[15px]">
                  <strong>Para:</strong> {l.para}. <strong>Foco:</strong> {l.foco}.
                </p>
                <p className="m-0 text-sm text-suave">
                  {l.fichas.length} fichas, uns {l.fichas.length * 5} minutos · {l.revisadas} de {l.fichas.length} revisadas
                </p>
                <ul className="m-0 flex list-none flex-col gap-1 p-0 text-[15px]">
                  {l.fichas.map((f) => (
                    <li key={f.id} className="flex items-center gap-2">
                      {f.revisada ? <Check tamanho={16} className="shrink-0 text-folha" /> : <span className="block size-4 shrink-0" aria-hidden="true" />}
                      <Link href={`/brincadeira/${f.id}/`}>{f.nome}</Link>
                      {f.revisada ? <span className="sr-only">(revisada)</span> : null}
                    </li>
                  ))}
                </ul>
                <a
                  href={linkEmail(contato, `Revisão voluntária: lote ${l.id} (${l.tema.toLowerCase()})`, `o lote ${l.id} (${l.tema.toLowerCase()})`)}
                  onClick={() => evento("revisao_convite_clicado", { origem: "revisar", alvo: `lote-${l.id}` })}
                  className="mt-1 flex min-h-[52px] items-center justify-center rounded-2xl border-[1.5px] border-tinta bg-white px-4 text-base font-bold text-tinta no-underline"
                >
                  Quero revisar este lote
                </a>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="rv-resposta" className="flex flex-col gap-2 md:max-w-3xl">
          <h2 id="rv-resposta" className="m-0 font-display text-[21px] font-extrabold">
            Como responder
          </h2>
          <p className="m-0">Os botões acima abrem um e-mail para {contato} já com este modelo:</p>
          <ol className="m-0 flex flex-col gap-1.5 pl-5">
            <li>Uma linha por brincadeira: “OK”, “OK com ajustes: …” ou “Não publicaria: …”.</li>
            <li>Seu nome e sua profissão como devem aparecer, e seu registro profissional (fica só com a gente).</li>
            <li>A frase de autorização: “{AUTORIZACAO}”</li>
          </ol>
        </section>
        <Rodape />
      </main>
      <NavInferior />
    </>
  );
}

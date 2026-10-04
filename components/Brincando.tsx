"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Brincadeira } from "@/lib/esquema";
import { useRouter } from "next/navigation";
import { adicionarRegistro, lerApoio, lerPerfil, type Reacao } from "@/lib/armazenamento";
import { VERSAO_TERMOS } from "@/config/site";
import { chaveDia, difDias } from "@/lib/datas";
import { evento } from "@/lib/metricas";
import { CartaoApoio } from "./CartaoApoio";
import { chaveNivel, textoDoNivel, type Nivel } from "./Ficha";
import { Alerta, Celular, Check, Fechar, Play } from "./Icones";

const REACOES: { id: Reacao; nome: string }[] = [
  { id: "adorou", nome: "Adorou" },
  { id: "ok", nome: "Foi ok" },
  { id: "nao", nome: "Não rolou" },
];

type WakeLock = { release: () => Promise<void> };
type NavComWakeLock = Navigator & { wakeLock?: { request: (t: "screen") => Promise<WakeLock> } };

const CIRCUNF = 2 * Math.PI * 96;
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function Brincando({
  b,
  pix,
  url,
  apoio,
}: {
  b: Brincadeira;
  pix: string | null;
  url: string;
  apoio: { aPartirDeRegistros: number; intervaloDias: number };
}) {
  const total = b.minutos * 60;
  const [passo, setPasso] = useState(0);
  const [restante, setRestante] = useState(total);
  const [rodando, setRodando] = useState(false);
  const [comecou, setComecou] = useState(false);
  const [fase, setFase] = useState<"brincando" | "registro" | "feito">("brincando");
  const [nivel, setNivel] = useState<Nivel>("normal");
  const [reacao, setReacao] = useState<Reacao | null>(null);
  const [nota, setNota] = useState("");
  const [mostrarApoio, setMostrarApoio] = useState(false);
  const trava = useRef<WakeLock | null>(null);
  const router = useRouter();

  // Para brincar e registrar é preciso ter aceitado os termos (quem chega por um link compartilhado passa pelas boas-vindas).
  useEffect(() => {
    lerPerfil().then((p) => {
      if (!p || p.aceite?.versao !== VERSAO_TERMOS) router.replace("/boas-vindas/");
    });
  }, [router]);

  useEffect(() => {
    try {
      const n = sessionStorage.getItem(chaveNivel(b.id));
      if (n === "facil" || n === "dificil" || n === "normal") setNivel(n);
    } catch {
      /* ignora */
    }
  }, [b.id]);

  const prenderTela = useCallback(async () => {
    try {
      const nav = navigator as NavComWakeLock;
      if (nav.wakeLock && document.visibilityState === "visible") trava.current = await nav.wakeLock.request("screen");
    } catch {
      /* sem suporte: a tela pode apagar */
    }
  }, []);
  const soltarTela = useCallback(() => {
    trava.current?.release().catch(() => {});
    trava.current = null;
  }, []);

  useEffect(() => {
    if (!rodando) return;
    const t = setInterval(() => setRestante((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [rodando]);

  useEffect(() => {
    if (restante === 0) setRodando(false);
  }, [restante]);

  useEffect(() => {
    const aoVoltar = () => {
      if (document.visibilityState === "visible" && rodando) prenderTela();
    };
    document.addEventListener("visibilitychange", aoVoltar);
    return () => document.removeEventListener("visibilitychange", aoVoltar);
  }, [rodando, prenderTela]);

  useEffect(() => soltarTela, [soltarTela]);

  function comecar() {
    setRodando(true);
    prenderTela();
    if (!comecou) {
      setComecou(true);
      evento("brincadeira_iniciada", { id: b.id, area: b.area, nivel });
    }
  }
  function pausar() {
    setRodando(false);
    soltarTela();
  }
  function terminar() {
    setRodando(false);
    soltarTela();
    setFase("registro");
  }

  async function salvar() {
    if (!reacao) return;
    const lista = await adicionarRegistro({ dia: chaveDia(new Date()), brincadeira: b.id, reacao, nota: nota.trim().slice(0, 300) });
    evento("brincadeira_concluida", { id: b.id, area: b.area, reacao, nivel });
    const estado = await lerApoio();
    const longeDoUltimo = !estado.ultimoCartao || difDias(new Date(), new Date(estado.ultimoCartao)) >= apoio.intervaloDias;
    setMostrarApoio(lista.length >= apoio.aPartirDeRegistros && longeDoUltimo);
    setFase("feito");
  }

  const ultimo = passo === b.passos.length - 1;

  // Atalhos no computador: setas mudam o passo, espaço começa ou pausa o tempo.
  useEffect(() => {
    if (fase !== "brincando") return;
    const aoTeclar = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null;
      if (alvo && (alvo.closest("input, textarea, select, button, a") || alvo.isContentEditable)) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (passo < b.passos.length - 1) setPasso(passo + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (passo > 0) setPasso(passo - 1);
      } else if (e.key === " ") {
        e.preventDefault();
        if (rodando) {
          setRodando(false);
          soltarTela();
        } else if (restante > 0) {
          setRodando(true);
          prenderTela();
          if (!comecou) {
            setComecou(true);
            evento("brincadeira_iniciada", { id: b.id, area: b.area, nivel });
          }
        }
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [fase, passo, rodando, restante, comecou, nivel, b, prenderTela, soltarTela]);
  const conversa = b.conversa[passo % b.conversa.length];
  const fracao = restante / total;

  if (fase === "registro") {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 pb-7 pt-6 md:max-w-xl md:justify-center md:py-12">
        <p className="m-0 text-sm font-bold uppercase tracking-wider text-suave">{b.nome}</p>
        <h1 className="m-0 font-display text-[30px] font-extrabold leading-tight">Como foi?</h1>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Reação da criança">
          {REACOES.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={reacao === r.id}
              onClick={() => setReacao(r.id)}
              className={`min-h-14 rounded-2xl border-[1.5px] text-base font-bold ${reacao === r.id ? "border-tinta bg-tinta text-white" : "border-borda bg-white text-tinta"}`}
            >
              {r.nome}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="nota" className="font-bold">
            Anotação <span className="font-normal text-suave">(opcional, fica só neste aparelho)</span>
          </label>
          <textarea
            id="nota"
            rows={3}
            maxLength={300}
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ex.: pediu para repetir; ainda troca o amarelo pelo verde"
            className="rounded-[14px] border-[1.5px] border-borda bg-white px-3.5 py-3 text-base text-tinta"
          />
        </div>
        <button
          type="button"
          onClick={salvar}
          disabled={!reacao}
          className="mt-auto flex min-h-[58px] items-center justify-center rounded-2xl bg-azul text-lg font-bold text-white transition-colors hover:bg-azul-escuro disabled:opacity-50 md:mt-2"
        >
          Salvar no diário
        </button>
        <button type="button" onClick={() => setFase("brincando")} className="min-h-11 font-bold text-suave">
          Voltar para a brincadeira
        </button>
      </main>
    );
  }

  if (fase === "feito") {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 pb-7 pt-8 md:max-w-xl md:justify-center md:py-12">
        <div className="grid size-16 place-items-center rounded-full bg-folha-claro text-folha">
          <Check tamanho={34} />
        </div>
        <h1 className="m-0 font-display text-[30px] font-extrabold leading-tight">Pronto! Está no diário.</h1>
        <p className="m-0 text-suave">Amanhã tem outra. Se ela pedir para repetir esta, ótimo: repetir também ensina.</p>
        {mostrarApoio ? <CartaoApoio pix={pix} url={url} modo="cartao" aoFechar={() => setMostrarApoio(false)} /> : null}
        <div className="mt-auto flex flex-col gap-2.5 md:mt-2 md:flex-row">
          <Link href="/diario/" className="flex min-h-[54px] items-center justify-center rounded-2xl bg-azul text-[17px] font-bold text-white no-underline transition-colors hover:bg-azul-escuro md:flex-1">
            Ver o diário
          </Link>
          <Link href="/" className="flex min-h-[54px] items-center justify-center rounded-2xl border-[1.5px] border-tinta font-bold text-tinta no-underline transition-colors hover:bg-painel md:flex-1">
            Voltar para hoje
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-noite text-[#F4F6FA]">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 px-5 pb-6 pt-4 md:max-w-5xl md:px-8 md:pb-10 md:pt-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-noite-suave">Brincando agora</span>
            <span className="truncate font-display text-xl font-extrabold">{b.nome}</span>
          </div>
          <Link
            href={`/brincadeira/${b.id}/`}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-noite-linha px-3.5 text-[15px] font-bold text-[#F4F6FA] no-underline"
          >
            <Fechar tamanho={16} />
            Encerrar
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-5 md:grid md:grid-cols-2 md:items-center md:gap-14">
        <div className="flex flex-col items-center gap-5">
        <div className="relative mx-auto size-[220px] md:size-[320px]">
          <svg viewBox="0 0 220 220" aria-hidden="true" className="absolute inset-0 size-full -rotate-90">
            <circle cx="110" cy="110" r="96" fill="none" stroke="#2C3550" strokeWidth="14" />
            <circle
              cx="110"
              cy="110"
              r="96"
              fill="none"
              stroke="#FFC845"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${(CIRCUNF * fracao).toFixed(1)} ${CIRCUNF.toFixed(1)}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span role="timer" aria-live="off" className="font-display text-[58px] font-extrabold tabular-nums tracking-tight md:text-[84px]">
              {mmss(restante)}
            </span>
            <span className="mt-2 text-sm text-noite-suave">{restante === 0 ? "tempo encerrado" : `de ${b.minutos} min`}</span>
          </div>
        </div>

        {rodando ? (
          <button type="button" onClick={pausar} className="mx-auto min-h-11 rounded-full border-[1.5px] border-noite-linha px-5 font-bold text-[#F4F6FA] transition-colors hover:bg-noite-2">
            Pausar o tempo
          </button>
        ) : (
          <button
            type="button"
            onClick={comecar}
            disabled={restante === 0}
            className="mx-auto flex min-h-12 items-center gap-2 rounded-full bg-sol px-6 font-bold text-noite disabled:opacity-40"
          >
            <Play tamanho={18} />
            {comecou ? "Continuar o tempo" : "Começar o tempo"}
          </button>
        )}

        <div className="flex justify-center gap-2" aria-hidden="true">
          {b.passos.map((_, k) => (
            <span key={k} className={`block h-1.5 w-7 rounded-sm ${k === passo ? "bg-sol" : k < passo ? "bg-[#8D96AD]" : "bg-noite-linha"}`} />
          ))}
        </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 md:flex-none">

        {!comecou ? (
          <div className="flex items-start gap-3 rounded-[18px] border-[1.5px] border-sol/60 bg-noite-2 p-4" role="note" aria-label="Antes de começar">
            <Alerta tamanho={22} className="mt-0.5 shrink-0 text-sol" />
            <div className="flex flex-col gap-1">
              <p className="m-0 font-bold">Antes de começar</p>
              <p className="m-0 text-[15px] text-noite-suave">
                Um adulto acompanha a brincadeira do começo ao fim. Olhe o lugar e os materiais.
                {b.seguranca ? ` ${b.seguranca}` : ""}
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 rounded-[22px] bg-noite-2 p-5" aria-live="polite">
          <span className="text-[13px] font-bold uppercase tracking-wider text-sol">
            Passo {passo + 1} de {b.passos.length}
          </span>
          <p className="m-0 font-display text-2xl font-semibold leading-snug md:text-[30px]">{b.passos[passo]}</p>
          <div className="border-t border-noite-linha pt-3">
            <span className="text-[13px] text-noite-suave">Puxe conversa</span>
            <p className="m-0 mt-0.5 text-lg italic">“{conversa}”</p>
          </div>
          {nivel !== "normal" ? (
            <p className="m-0 rounded-xl bg-noite px-3 py-2 text-[15px] text-noite-suave">
              <strong className="text-[#F4F6FA]">{nivel === "facil" ? "Mais fácil:" : "Mais difícil:"}</strong> {textoDoNivel(b, nivel)}
            </p>
          ) : null}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setPasso((p) => Math.max(0, p - 1))}
            disabled={passo === 0}
            className="min-h-[58px] rounded-2xl border-[1.5px] border-noite-linha text-[17px] font-bold text-[#F4F6FA] disabled:opacity-40"
          >
            Anterior
          </button>
          {ultimo ? (
            <button type="button" onClick={terminar} className="min-h-[58px] rounded-2xl bg-sol text-[17px] font-bold text-noite">
              Terminamos
            </button>
          ) : (
            <button type="button" onClick={() => setPasso((p) => p + 1)} className="min-h-[58px] rounded-2xl bg-sol text-[17px] font-bold text-noite">
              Próximo passo
            </button>
          )}
        </div>

        <p className="m-0 flex items-start gap-2 text-sm text-noite-suave">
          <Celular tamanho={18} className="mt-px shrink-0" />
          Com o tempo correndo, a tela fica acesa. Pode deixar o celular de lado e brincar.
        </p>
        <p className="m-0 hidden text-sm text-noite-suave md:block">
          Atalhos do teclado: as setas ← e → mudam o passo, e a barra de espaço começa ou pausa o tempo.
        </p>
        </div>
        </div>
      </div>
    </main>
  );
}

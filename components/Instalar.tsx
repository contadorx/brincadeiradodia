"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { gerarLembreteIcs } from "@/lib/ics";
import { baixarArquivo } from "@/lib/compartilhar";
import { evento } from "@/lib/metricas";
import { Baixar, Cadeado, Compartilhar, Coracao, Monitor, SemWifi, Sino } from "./Icones";
import { Selo } from "./Marca";
import { Cabecalho } from "./Cabecalho";

type EventoInstalar = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export function Instalar({ url }: { url: string }) {
  const [pedido, setPedido] = useState<EventoInstalar | null>(null);
  const [instalado, setInstalado] = useState(false);
  const [iphone, setIphone] = useState(false);
  const [celular, setCelular] = useState(true);
  const [hora, setHora] = useState("19:00");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    setInstalado(
      window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true,
    );
    setIphone(/iPhone|iPad|iPod/i.test(navigator.userAgent));
    setCelular(/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent));
    const guardar = (e: Event) => {
      e.preventDefault();
      setPedido(e as EventoInstalar);
    };
    window.addEventListener("beforeinstallprompt", guardar);
    return () => window.removeEventListener("beforeinstallprompt", guardar);
  }, []);

  async function instalar() {
    if (!pedido) return;
    await pedido.prompt();
    const escolha = await pedido.userChoice;
    if (escolha.outcome === "accepted") setInstalado(true);
    setPedido(null);
  }

  function baixarLembrete() {
    baixarArquivo("lembrete-brincadeira-do-dia.ics", gerarLembreteIcs(hora, url), "text/calendar");
    evento("lembrete_baixado", { hora });
    setAviso(
      iphone
        ? "Abra o arquivo baixado e toque em Adicionar à agenda."
        : "Abra o arquivo baixado e escolha a sua agenda. O lembrete se repete todo dia.",
    );
  }

  return (
    <>
    <Cabecalho />
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-5 pb-7 pt-3.5 md:min-h-0 md:max-w-2xl md:px-8 md:pt-10">
      <div className="flex justify-end md:hidden">
        <Link href="/" className="inline-flex min-h-11 items-center px-1 font-bold text-suave no-underline">
          Voltar
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-1.5" aria-hidden="true">
          <div className="grid size-[72px] place-items-center rounded-[18px] bg-azul">
            <Selo tamanho={58} />
          </div>
          <span className="text-xs text-suave">Brincadeira</span>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="m-0 font-display text-[27px] font-extrabold leading-tight tracking-tight">
            {instalado ? "Já está na tela inicial" : "Deixe na tela inicial"}
          </h1>
          <p className="m-0 text-[15px] text-suave">Abre como um aplicativo, funciona sem internet e não pede cadastro.</p>
        </div>
      </div>

      {!instalado ? (
        <>
          {pedido ? (
            <button type="button" onClick={instalar} className="flex min-h-[58px] items-center justify-center gap-2.5 rounded-2xl bg-azul text-lg font-bold text-white">
              <Baixar tamanho={20} />
              Instalar agora
            </button>
          ) : null}
          {!celular ? (
            <div className="flex gap-3 rounded-2xl bg-painel p-3.5">
              <Monitor tamanho={22} className="mt-0.5 shrink-0" />
              <div>
                <p className="m-0 font-bold">No computador</p>
                <p className="m-0 mt-0.5 text-[15px]">
                  No Chrome ou no Edge, clique no ícone de instalar no fim da barra de endereço, ou no menu, em Instalar. No Safari do Mac, use Arquivo
                  e depois Adicionar ao Dock.
                </p>
              </div>
            </div>
          ) : null}
          <div className={`flex gap-3 rounded-2xl bg-painel p-3.5 ${iphone ? "order-last" : ""}`}>
            <Baixar tamanho={22} className="mt-0.5 shrink-0" />
            <div>
              <p className="m-0 font-bold">No Android</p>
              <p className="m-0 mt-0.5 text-[15px]">Toque em Instalar quando o aviso aparecer. Ou abra o menu do Chrome e escolha Instalar app.</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-2xl bg-painel p-3.5">
            <Compartilhar tamanho={22} className="mt-0.5 shrink-0" />
            <div>
              <p className="m-0 font-bold">No iPhone</p>
              <p className="m-0 mt-0.5 text-[15px]">No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início.</p>
            </div>
          </div>
        </>
      ) : null}

      <section aria-labelledby="lembrete" className="flex flex-col gap-2.5 rounded-2xl border-[1.5px] border-linha p-3.5">
        <div className="flex items-center gap-2.5">
          <Sino tamanho={22} className="shrink-0" />
          <h2 id="lembrete" className="m-0 text-base font-bold">
            Lembrete diário na agenda
          </h2>
        </div>
        <div className="flex items-center gap-2.5">
          <label htmlFor="hora" className="text-[15px]">
            Horário
          </label>
          <input
            id="hora"
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value || "19:00")}
            className="min-h-11 rounded-xl border-[1.5px] border-borda bg-white px-3 text-base text-tinta"
          />
          <button type="button" onClick={baixarLembrete} className="ml-auto min-h-11 rounded-xl bg-tinta px-4 font-bold text-white transition-colors hover:bg-azul-escuro">
            Adicionar
          </button>
        </div>
        <p className="m-0 text-sm text-suave">
          O lembrete fica na sua agenda (do celular, do Google ou do Outlook). O site não guarda seu horário nem manda notificações.
        </p>
        {aviso ? (
          <p role="status" className="m-0 text-sm font-bold">
            {aviso}
          </p>
        ) : null}
      </section>

      <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0 text-center text-[13px] font-bold">
        <li className="flex flex-col items-center gap-1.5">
          <SemWifi tamanho={22} className="text-azul" />
          Funciona sem internet
        </li>
        <li className="flex flex-col items-center gap-1.5">
          <Cadeado tamanho={22} className="text-azul" />
          Sem cadastro
        </li>
        <li className="flex flex-col items-center gap-1.5">
          <Coracao tamanho={22} className="text-azul" />
          Sem anúncios
        </li>
      </ul>
    </main>
    </>
  );
}

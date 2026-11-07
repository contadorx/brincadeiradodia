"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONTEUDO_SITE } from "@/lib/compartilhar";
import { evento } from "@/lib/metricas";
import { salvarApoio } from "@/lib/armazenamento";
import type { OpcaoPix } from "@/lib/apoio";
import { Compartilhar, Coracao } from "./Icones";
import { BotaoCompartilhar } from "./JanelaCompartilhar";
import { JaContribui, PixApoio } from "./PixApoio";

/**
 * Pedido de apoio com duas saídas: compartilhar (sempre) e PIX (se configurado).
 * modo "cartao": aparece depois de uma brincadeira de que a criança gostou e pode ser dispensado.
 * modo "secao": fixo nas páginas Apoiar e Sobre.
 */
export function CartaoApoio({
  opcoes,
  modo,
  aoFechar,
}: {
  opcoes: OpcaoPix[] | null;
  modo: "cartao" | "secao";
  aoFechar?: () => void;
}) {
  const [mostrarPix, setMostrarPix] = useState(modo === "secao");
  const [declarou, setDeclarou] = useState(false);
  const origem = modo === "cartao" ? "apoio-cartao" : "apoio-secao";

  useEffect(() => {
    if (modo !== "cartao") return;
    evento("apoio_cartao_mostrado");
    salvarApoio({ ultimoCartao: new Date().toISOString() });
  }, [modo]);

  function dispensar() {
    if (!declarou) evento("apoio_dispensado");
    aoFechar?.();
  }

  return (
    <section aria-labelledby={`apoio-${modo}`} className={`flex flex-col gap-3 rounded-3xl p-5 ${modo === "cartao" ? "bg-azul-claro" : "bg-painel"}`}>
      <div className="flex items-center gap-2 text-azul">
        <Coracao tamanho={22} />
        <h2 id={`apoio-${modo}`} className="m-0 font-display text-[21px] font-extrabold text-tinta">
          Ajude outras famílias a brincar
        </h2>
      </div>
      <p className="m-0">
        O Brincadeira do Dia é gratuito e sem anúncios. Se ele ajudou vocês, mandar para outra família já ajuda muito.
        {opcoes ? " Quem puder contribuir com um PIX ajuda a pagar o domínio, os servidores, a pesquisa de novas brincadeiras e a evolução do aplicativo." : ""}
      </p>
      <BotaoCompartilhar
        conteudo={CONTEUDO_SITE}
        origem={origem}
        className="flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-azul text-[17px] font-bold text-white"
      >
        <Compartilhar tamanho={20} />
        Compartilhar com outra família
      </BotaoCompartilhar>
      {opcoes ? (
        mostrarPix ? (
          <div className="flex flex-col gap-2">
            <PixApoio opcoes={opcoes} origem={origem} comQr={modo === "secao"} />
            {modo === "cartao" ? (
              <Link href="/apoiar/" className="self-center text-[15px] font-bold">
                Ver o QR code e o que o apoio paga
              </Link>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMostrarPix(true)}
            className="flex min-h-[52px] items-center justify-center rounded-2xl border-[1.5px] border-tinta bg-white text-base font-bold text-tinta"
          >
            Apoiar com PIX
          </button>
        )
      ) : null}
      {opcoes ? <JaContribui origem={origem} aoMarcar={() => setDeclarou(true)} /> : null}
      {modo === "cartao" ? (
        <button type="button" onClick={dispensar} className="min-h-11 self-center px-3 font-bold text-suave">
          {declarou ? "Fechar" : "Agora não"}
        </button>
      ) : null}
    </section>
  );
}

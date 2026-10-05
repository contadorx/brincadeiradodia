"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONTEUDO_SITE, copiar } from "@/lib/compartilhar";
import { evento } from "@/lib/metricas";
import { salvarApoio } from "@/lib/armazenamento";
import { Compartilhar, Coracao } from "./Icones";
import { BotaoCompartilhar } from "./JanelaCompartilhar";

/**
 * Pedido de apoio com duas saídas: compartilhar (sempre) e PIX (se configurado).
 * modo "cartao": aparece depois de uma brincadeira e pode ser dispensado.
 * modo "secao": fixo na página Sobre.
 */
export function CartaoApoio({
  pix,
  modo,
  aoFechar,
}: {
  pix: string | null;
  modo: "cartao" | "secao";
  aoFechar?: () => void;
}) {
  const [mostrarPix, setMostrarPix] = useState(modo === "secao");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    if (modo !== "cartao") return;
    evento("apoio_cartao_mostrado");
    salvarApoio({ ultimoCartao: new Date().toISOString() });
  }, [modo]);

  async function aoCopiarPix() {
    if (!pix) return;
    const ok = await copiar(pix);
    setAviso(ok ? "Código PIX copiado. Cole no app do seu banco, em PIX copia e cola." : "Não deu para copiar. Use o QR code na página Sobre.");
    if (ok) evento("apoio_pix_copiado", { origem: modo });
  }

  function dispensar() {
    evento("apoio_dispensado");
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
        {pix ? " Quem puder contribuir com um PIX ajuda a pagar o domínio, os servidores, a pesquisa de novas brincadeiras e a evolução do aplicativo." : ""}
      </p>
      <BotaoCompartilhar
        conteudo={CONTEUDO_SITE}
        origem={modo === "cartao" ? "apoio-cartao" : "apoio-secao"}
        className="flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-azul text-[17px] font-bold text-white"
      >
        <Compartilhar tamanho={20} />
        Compartilhar com outra família
      </BotaoCompartilhar>
      {pix ? (
        mostrarPix ? (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={aoCopiarPix}
              className="flex min-h-[52px] items-center justify-center rounded-2xl border-[1.5px] border-tinta bg-white text-base font-bold text-tinta"
            >
              Copiar código PIX
            </button>
            {modo === "cartao" ? (
              <Link href="/sobre/#apoio" className="self-center text-[15px] font-bold">
                Ver o QR code
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
      {aviso ? (
        <p role="status" className="m-0 text-[15px] text-suave">
          {aviso}
        </p>
      ) : null}
      {modo === "cartao" ? (
        <button type="button" onClick={dispensar} className="min-h-11 self-center px-3 font-bold text-suave">
          Agora não
        </button>
      ) : null}
    </section>
  );
}

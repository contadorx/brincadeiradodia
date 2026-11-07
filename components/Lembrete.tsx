"use client";

import { useEffect, useId, useState } from "react";
import { gerarLembreteIcs } from "@/lib/ics";
import { baixarArquivo } from "@/lib/compartilhar";
import { evento } from "@/lib/metricas";
import { Sino } from "./Icones";

/**
 * Lembrete diário sem servidor: um evento de agenda que se repete todo dia, no horário escolhido.
 * Usado na página Instalar e, uma vez, depois da primeira brincadeira salva.
 */
export function Lembrete({
  url,
  origem,
  titulo = "Lembrete diário na agenda",
  className = "rounded-2xl border-[1.5px] border-linha p-3.5",
}: {
  url?: string;
  origem: string;
  titulo?: string;
  className?: string;
}) {
  const id = useId();
  const [hora, setHora] = useState("19:00");
  const [aviso, setAviso] = useState("");
  const [iphone, setIphone] = useState(false);

  useEffect(() => {
    setIphone(/iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  function baixar() {
    baixarArquivo("lembrete-brincadeira-do-dia.ics", gerarLembreteIcs(hora, url || window.location.origin), "text/calendar");
    evento("lembrete_baixado", { hora, origem });
    setAviso(
      iphone
        ? "Abra o arquivo baixado e toque em Adicionar à agenda."
        : "Abra o arquivo baixado e escolha a sua agenda. O lembrete se repete todo dia.",
    );
  }

  return (
    <section aria-labelledby={`${id}-t`} className={`flex flex-col gap-2.5 ${className}`}>
      <div className="flex items-center gap-2.5">
        <Sino tamanho={22} className="shrink-0" />
        <h2 id={`${id}-t`} className="m-0 text-base font-bold">
          {titulo}
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <label htmlFor={`${id}-hora`} className="text-[15px]">
          Horário
        </label>
        <input
          id={`${id}-hora`}
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value || "19:00")}
          className="min-h-11 rounded-xl border-[1.5px] border-borda bg-white px-3 text-base text-tinta"
        />
        <button type="button" onClick={baixar} className="min-h-11 flex-[1_1_104px] rounded-xl bg-tinta px-4 font-bold text-white transition-colors hover:bg-azul-escuro">
          Adicionar
        </button>
      </div>
      <p className="m-0 text-sm text-suave">
        O lembrete fica na sua agenda (do celular, do Google ou do Outlook). O site não guarda seu horário nem manda notificações.
      </p>
      <p role="status" className={aviso ? "m-0 text-sm font-bold" : "sr-only"}>
        {aviso}
      </p>
    </section>
  );
}

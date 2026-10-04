"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apagarTudo } from "@/lib/armazenamento";

export function ApagarDados() {
  const router = useRouter();
  const [armado, setArmado] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (!armado) {
          setArmado(true);
          return;
        }
        await apagarTudo();
        router.push("/boas-vindas/");
      }}
      className={`min-h-11 self-start rounded-xl border-[1.5px] px-4 font-bold ${armado ? "border-alerta bg-alerta-claro text-alerta" : "border-borda text-tinta"}`}
    >
      {armado ? "Tocar de novo para apagar tudo" : "Apagar meus dados deste celular"}
    </button>
  );
}

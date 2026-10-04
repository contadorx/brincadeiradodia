"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { lerPerfil, lerRegistros, type Perfil, type Registro } from "./armazenamento";
import { VERSAO_TERMOS } from "@/config/site";

/**
 * Carrega o perfil e o diário do aparelho. Sem perfil, ou sem o aceite da versão atual
 * dos termos, leva para as boas-vindas.
 */
export function useDados(exigirPerfil = true) {
  const router = useRouter();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let vivo = true;
    (async () => {
      const [p, r] = await Promise.all([lerPerfil(), lerRegistros()]);
      if (!vivo) return;
      if (exigirPerfil && (!p || p.aceite?.versao !== VERSAO_TERMOS)) {
        router.replace("/boas-vindas/");
        return;
      }
      setPerfil(p);
      setRegistros(r);
      setPronto(true);
    })();
    return () => {
      vivo = false;
    };
  }, [exigirPerfil, router]);

  return { perfil, registros, setRegistros, pronto };
}

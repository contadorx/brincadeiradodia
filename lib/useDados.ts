"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { lerFamilia, lerPerfil, lerRegistros, type Familia, type Perfil, type Registro } from "./armazenamento";
import { VERSAO_TERMOS } from "@/config/site";

/**
 * Carrega a família, a criança ativa e o diário dela. Sem criança cadastrada, ou sem o
 * aceite da versão atual dos termos, leva para as boas-vindas.
 * `recarregar` lê tudo de novo (depois de trocar de criança, por exemplo).
 */
export function useDados(exigirPerfil = true) {
  const router = useRouter();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [familia, setFamilia] = useState<Familia | null>(null);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [pronto, setPronto] = useState(false);
  const [versao, setVersao] = useState(0);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  useEffect(() => {
    let vivo = true;
    (async () => {
      const [f, p, r] = await Promise.all([lerFamilia(), lerPerfil(), lerRegistros()]);
      if (!vivo) return;
      if (exigirPerfil && (!p || p.aceite?.versao !== VERSAO_TERMOS)) {
        router.replace("/boas-vindas/");
        return;
      }
      setFamilia(f);
      setPerfil(p);
      setRegistros(r);
      setPronto(true);
    })();
    return () => {
      vivo = false;
    };
  }, [exigirPerfil, router, versao]);

  return { perfil, familia, registros, setRegistros, pronto, recarregar };
}

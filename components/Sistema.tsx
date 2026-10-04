"use client";

import { useEffect } from "react";
import { lerPerfil, lerUltimaSemanaMedida, salvarUltimaSemanaMedida } from "@/lib/armazenamento";
import { deChave } from "@/lib/datas";
import { evento } from "@/lib/metricas";
import { semanaDeUso } from "@/lib/plano";

/**
 * Roda uma vez por abertura do app:
 * - registra o service worker (só no site publicado);
 * - mede, de forma anônima, em que semana de uso a família está (indicador de retorno);
 * - avisa as métricas quando o app é instalado.
 */
export function Sistema() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const instalado = () => evento("app_instalado");
    window.addEventListener("appinstalled", instalado);

    (async () => {
      const perfil = await lerPerfil();
      if (!perfil) return;
      const semana = semanaDeUso(deChave(perfil.inicio), new Date());
      const ultima = await lerUltimaSemanaMedida();
      if (semana > ultima) {
        // espera o script de métricas carregar
        setTimeout(() => evento("uso_semana", { semana: Math.min(semana, 52) }), 2500);
        await salvarUltimaSemanaMedida(semana);
      }
    })();

    return () => window.removeEventListener("appinstalled", instalado);
  }, []);
  return null;
}

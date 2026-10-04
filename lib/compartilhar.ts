"use client";

export type ResultadoCompartilhar = "share" | "copia" | "cancelado" | "falhou";

/** Usa o compartilhar nativo do celular; se não houver, copia o link. */
export async function compartilhar(dados: { title: string; text: string; url: string }): Promise<ResultadoCompartilhar> {
  try {
    if (typeof navigator.share === "function") {
      await navigator.share(dados);
      return "share";
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return "cancelado";
  }
  return (await copiar(`${dados.text} ${dados.url}`)) ? "copia" : "falhou";
}

export async function copiar(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

export function baixarArquivo(nome: string, conteudo: string, tipo: string) {
  const blob = new Blob([conteudo], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

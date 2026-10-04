import { Selo } from "./Marca";

export function Carregando() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-3 px-5" aria-busy="true">
      <Selo tamanho={56} />
      <p className="m-0 text-suave">Abrindo…</p>
    </main>
  );
}

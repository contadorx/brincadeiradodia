import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { tamanho?: number };

function Base({ tamanho = 22, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Sol = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Base>
);
export const Lupa = (p: P) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Base>
);
export const Livro = (p: P) => (
  <Base {...p}>
    <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" />
    <path d="M5 17a3 3 0 0 1 3-3h11" />
  </Base>
);
export const Relogio = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Base>
);
export const Casa = (p: P) => (
  <Base {...p}>
    <path d="M3 11l9-7 9 7v9H3z" />
  </Base>
);
export const Play = (p: P) => (
  <Base {...p} fill="currentColor" strokeWidth={1.5}>
    <path d="M8 5l11 7-11 7z" />
  </Base>
);
export const Cadeado = (p: P) => (
  <Base {...p}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Base>
);
export const Alerta = (p: P) => (
  <Base {...p}>
    <path d="M12 3l9.5 17h-19z" />
    <path d="M12 10v4M12 17.5v.5" />
  </Base>
);
export const Check = (p: P) => (
  <Base {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Base>
);
export const Voltar = (p: P) => (
  <Base {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Base>
);
export const Avancar = (p: P) => (
  <Base {...p}>
    <path d="M9 5l7 7-7 7" />
  </Base>
);
export const Compartilhar = (p: P) => (
  <Base {...p}>
    <path d="M12 3v12" />
    <path d="M8 7l4-4 4 4" />
    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
  </Base>
);
export const Baixar = (p: P) => (
  <Base {...p}>
    <path d="M12 3v12" />
    <path d="M7 10l5 5 5-5" />
    <path d="M5 21h14" />
  </Base>
);
export const Sino = (p: P) => (
  <Base {...p}>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
    <path d="M10 21h4" />
  </Base>
);
export const SemWifi = (p: P) => (
  <Base {...p}>
    <path d="M2 8.5a16 16 0 0 1 5-2.8M10.5 5.1A16 16 0 0 1 22 8.5M5 12a11 11 0 0 1 4-2.2M15 10a11 11 0 0 1 4 2M8.5 15.5a6 6 0 0 1 7 0M12 19.5h.01M3 3l18 18" />
  </Base>
);
export const Fechar = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Base>
);
export const Info = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7.5v.5" />
  </Base>
);
export const Coracao = (p: P) => (
  <Base {...p}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </Base>
);
export const Monitor = (p: P) => (
  <Base {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </Base>
);
export const Celular = (p: P) => (
  <Base {...p}>
    <rect x="6" y="2" width="12" height="20" rx="3" />
    <path d="M11 18h2" />
  </Base>
);

/* Ícones genéricos dos canais de compartilhar. Não reproduzem logotipos de marcas:
   o nome do aplicativo vai sempre escrito ao lado. */
export const Mensagem = (p: P) => (
  <Base {...p}>
    <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <path d="M8 9h8M8 12.5h5" />
  </Base>
);
export const Imagem = (p: P) => (
  <Base {...p}>
    <rect x="5" y="2.5" width="14" height="19" rx="2.5" />
    <circle cx="10" cy="8.5" r="1.8" />
    <path d="M5 17l4.5-4 3 2.5 2.5-2 4 3.5" />
  </Base>
);
export const Pessoas = (p: P) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M21.5 20a6.5 6.5 0 0 0-4-6" />
  </Base>
);
export const Aviao = (p: P) => (
  <Base {...p}>
    <path d="M21 3L3 10.5l7 3 3 7z" />
    <path d="M21 3L10 13.5" />
  </Base>
);
export const Envelope = (p: P) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
  </Base>
);
export const Elo = (p: P) => (
  <Base {...p}>
    <path d="M10 14a4.2 4.2 0 0 0 6 0l3-3a4.2 4.2 0 0 0-6-6l-1 1" />
    <path d="M14 10a4.2 4.2 0 0 0-6 0l-3 3a4.2 4.2 0 0 0 6 6l1-1" />
  </Base>
);
export const Qr = (p: P) => (
  <Base {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <path d="M14 14h3v3h-3zM20.5 14v.5M14 20.5h.5M17.5 20.5H21v-3.5" />
  </Base>
);
export const Pontos = (p: P) => (
  <Base {...p} fill="currentColor" strokeWidth={0}>
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </Base>
);

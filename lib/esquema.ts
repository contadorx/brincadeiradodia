import { z } from "zod";

/** Áreas do desenvolvimento. A ordem é a dos dias da semana (0 = domingo). */
export const AREAS = [
  "explorar",
  "linguagem",
  "autocontrole",
  "raciocinio",
  "corpo",
  "fazdeconta",
  "musica",
] as const;

export const NOME_AREA: Record<(typeof AREAS)[number], string> = {
  explorar: "Explorar",
  linguagem: "Linguagem",
  autocontrole: "Atenção e autocontrole",
  raciocinio: "Raciocínio e números",
  corpo: "Corpo e coordenação",
  fazdeconta: "Faz de conta",
  musica: "Música e cozinha",
};

/** Faixas de idade oferecidas na escolha inicial. */
export const FAIXAS = ["1-2", "2-3", "3-4", "4-5", "5-6"] as const;
export const NOME_FAIXA: Record<(typeof FAIXAS)[number], string> = {
  "1-2": "1 a 2 anos",
  "2-3": "2 a 3 anos",
  "3-4": "3 a 4 anos",
  "4-5": "4 a 5 anos",
  "5-6": "5 a 6 anos",
};

/** Materiais que aparecem no filtro "O que você tem em casa?". */
export const ETIQUETAS = [
  "papel",
  "brinquedos",
  "fita",
  "massinha",
  "agua",
  "livro",
  "cozinha",
] as const;
export const NOME_ETIQUETA: Record<(typeof ETIQUETAS)[number], string> = {
  papel: "Papel e caneta",
  brinquedos: "Brinquedos",
  fita: "Fita crepe",
  massinha: "Massinha",
  agua: "Bacia com água",
  livro: "Um livro",
  cozinha: "Frutas e pão",
};

export const LUGARES = ["casa", "rua", "banho", "carro"] as const;
export const NOME_LUGAR: Record<(typeof LUGARES)[number], string> = {
  casa: "Em casa",
  rua: "Na rua",
  banho: "No banho",
  carro: "No carro",
};

const textoCurto = z.string().trim().min(3).max(200);
const textoMedio = z.string().trim().min(3).max(400);

export const esquemaBrincadeira = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/, "use só letras minúsculas, números e hífen"),
    nome: z.string().trim().min(3).max(40),
    area: z.enum(AREAS),
    /** 1 = semanas ímpares, 2 = semanas pares (rodízio da brincadeira do dia). */
    ordem: z.number().int().min(1).max(9),
    faixas: z.array(z.enum(FAIXAS)).min(1),
    minutos: z.number().int().min(3).max(20),
    lugares: z.array(z.enum(LUGARES)).min(1),
    serve: textoCurto,
    materiais: z.array(textoCurto).max(6),
    etiquetas: z.array(z.enum(ETIQUETAS)),
    passos: z.array(textoCurto).min(3).max(6),
    facil: textoMedio,
    dificil: textoMedio,
    conversa: z.array(textoCurto).min(2).max(4),
    seguranca: textoMedio.nullable(),
    base: textoCurto,
  })
  .strict();

export type Brincadeira = z.infer<typeof esquemaBrincadeira>;
export type Area = (typeof AREAS)[number];
export type Faixa = (typeof FAIXAS)[number];
export type Etiqueta = (typeof ETIQUETAS)[number];
export type Lugar = (typeof LUGARES)[number];

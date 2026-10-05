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

/**
 * Cuidado extra que aparece sozinho em toda ficha da faixa 1 a 2 anos, além do aviso da brincadeira.
 * Nesta idade tudo vai à boca, o equilíbrio ainda falha e a criança não avisa o perigo.
 */
export const AVISO_1_2 =
  "De 1 a 2 anos, tudo vai à boca: só objetos maiores que um rolo de papel higiênico, inteiros e limpos, conferidos antes e depois. Brincadeira no chão, sem subir em nada.";

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

/**
 * Origem da ideia (veja o Plano de Conteúdo). Não é nota de eficácia: diz de onde a
 * ideia veio. A ficha é sempre uma versão nossa, e a `base` explica a diferença.
 * A = inspirada em atividade estudada com crianças (diga população, contexto e o que mudou);
 * B = inspirada em sugestão de atividade de uma instituição (dica, não marco do desenvolvimento);
 * C = brincadeira tradicional brasileira ou variação dela;
 * D = só há um objetivo da BNCC relacionado (currículo, não recomendação da atividade).
 */
export const EVIDENCIAS = ["A", "B", "C", "D"] as const;
export const NOME_EVIDENCIA: Record<(typeof EVIDENCIAS)[number], string> = {
  A: "Inspirada em atividade estudada com crianças",
  B: "Inspirada em sugestão de instituição de referência",
  C: "Inspirada em brincadeira tradicional brasileira",
  D: "Relacionada a objetivo da BNCC, o currículo da educação infantil",
};

/**
 * Brincadeiras que mudaram de id. O diário guarda o id antigo; aqui ele aponta para o novo.
 * Os endereços antigos são redirecionados em vercel.json.
 */
export const IDS_ANTIGOS: Record<string, string> = {
  "chocalho-de-pote": "tambor-de-pote",
};

/** rascunho = não aparece no site publicado; publicada = aparece. */
export const STATUS = ["rascunho", "publicada"] as const;

const esquemaFonte = z
  .object({
    titulo: z.string().trim().min(3).max(160),
    url: z.string().url().startsWith("https://", "use um endereço https://"),
  })
  .strict();

const esquemaRevisao = z
  .object({
    /** Ex.: "Terapeuta ocupacional". É o que aparece no site. */
    profissao: z.string().trim().min(3).max(60),
    nome: z.string().trim().min(3).max(80),
    /** Ex.: "CREFITO-3 000000-F". Fica só no arquivo, não aparece no site. */
    registro: z.string().trim().max(40),
    /** Data da revisão, AAAA-MM-DD. */
    em: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use AAAA-MM-DD"),
    /** Só mostre o nome no site com autorização por escrito da profissional. */
    mostrarNome: z.boolean(),
    observacoes: z.string().trim().max(600),
  })
  .strict();

export const esquemaBrincadeira = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/, "use só letras minúsculas, números e hífen"),
    nome: z.string().trim().min(3).max(40),
    area: z.enum(AREAS),
    /** Posição no rodízio semanal da área (1 a 4): semana 1 usa a de ordem 1, semana 2 a de ordem 2… */
    ordem: z.number().int().min(1).max(9),
    faixas: z.array(z.enum(FAIXAS)).min(1),
    /** Tempo estimado de brincadeira. É estimativa: a família para quando a criança quiser. */
    minutos: z.number().int().min(3).max(20),
    /** Preparo, limpeza ou observação em outros dias, quando não cabe nos minutos. Ex.: "10 minutos para montar; depois, uma olhada por dia". */
    preparo: z.string().trim().min(3).max(160).optional(),
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
    status: z.enum(STATUS),
    evidencia: z.enum(EVIDENCIAS),
    fontes: z.array(esquemaFonte).min(1).max(4),
    /** null = ainda sem revisão de profissional. */
    revisao: esquemaRevisao.nullable(),
  })
  .strict();

export type Brincadeira = z.infer<typeof esquemaBrincadeira>;
export type Area = (typeof AREAS)[number];
export type Faixa = (typeof FAIXAS)[number];
export type Etiqueta = (typeof ETIQUETAS)[number];
export type Lugar = (typeof LUGARES)[number];
export type Evidencia = (typeof EVIDENCIAS)[number];
export type Revisao = z.infer<typeof esquemaRevisao>;

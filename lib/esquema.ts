import { z } from "zod";
import { AREAS, ETIQUETAS, EVIDENCIAS, FAIXAS, LUGARES, STATUS } from "./dominio";

/**
 * Esquema que valida cada brincadeira de content/brincadeiras no build (lib/conteudo.ts).
 * Só o build usa este arquivo. Telas que rodam no navegador importam de lib/dominio.ts
 * (e daqui só tipos, com `import type`), para o zod não ir para o celular.
 */
export * from "./dominio";

const textoCurto = z.string().trim().min(3).max(200);
const textoMedio = z.string().trim().min(3).max(400);

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
    /** Posição no rodízio semanal da área (hoje, 1 a 6): semana 1 usa a de ordem 1, semana 2 a de ordem 2… */
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
export type Revisao = z.infer<typeof esquemaRevisao>;

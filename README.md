# Brincadeira do Dia

Site e PWA gratuito com uma brincadeira de 10 minutos por dia para pais e cuidadores
fazerem com a criança, com o que têm em casa. Funciona no navegador do computador e no
celular. O site é para os adultos; a criança brinca longe da tela.

- **Computador e tablet:** barra de navegação no topo, telas em duas colunas e atalhos de
  teclado no modo "Brincando" (setas mudam o passo, espaço começa ou pausa o tempo).
- **Celular:** coluna única, barra de navegação embaixo e botões grandes para uma mão.

- **Sem login e sem banco de dados.** Perfil, diário e preferências ficam no próprio celular (IndexedDB).
- **Funciona sem internet** depois da primeira visita (service worker com o site inteiro em cache).
- **Instalável** como app no celular (Android e iPhone) e no computador (Chrome, Edge e Safari do Mac).
- **Métricas anônimas** com Umami no seu VPS, sem cookies (veja `docs/metricas.md`).
- **Apoio voluntário**: compartilhar e PIX, num cartão discreto depois da 10ª brincadeira e na página Sobre.

## Stack

| Parte | Tecnologia |
|---|---|
| Site | Next.js 16 com export estático (`out/`), React 19, TypeScript |
| Estilo | Tailwind CSS 4, fontes Atkinson Hyperlegible e Bricolage Grotesque (servidas pelo próprio site) |
| Conteúdo | Um JSON por brincadeira em `content/brincadeiras/`, validado com Zod no build |
| Dados no aparelho | `idb-keyval` (IndexedDB) |
| Offline | `scripts/gerar-sw.mjs` gera `out/sw.js` depois do build |
| PIX | BR Code estático gerado em `lib/pix.ts`, QR code com `qrcode` no build |
| Métricas | Umami (Docker) em `infra/umami/` |

## Rodar no computador

```bash
npm install
npm run dev          # http://localhost:3000 (sem service worker)
npm run build        # gera out/ e out/sw.js
npm run preview      # serve out/ em http://localhost:4173, igual ao site publicado
```

Requer Node 20.9 ou mais novo.

## Antes de publicar: `config/site.ts`

É o único arquivo de configuração:

- **`pix`**: use uma **chave aleatória** da sua conta, não o número do CPF. A chave fica
  pública no site e no QR code. Preencha também o nome como está no banco (sem acento)
  e a cidade. Enquanto a chave estiver vazia, o bloco do PIX não aparece; o de
  compartilhar continua.
- **`custosAno`**: os valores reais do que o apoio paga (transparência na página Sobre).
- **`contato`**: e-mail para sugestões (opcional).
- **`umami`**: endereço do script e ID do site, depois de seguir `docs/metricas.md`.
- **`apoio`**: a partir de quantas brincadeiras e de quantos em quantos dias o cartão de apoio aparece.

## Publicar na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Na Vercel: Add New → Project → importe o repositório.
3. Em **Build and Output Settings**:
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `out`
4. Deploy. Depois, em Settings → Domains, adicione `brincadeiradodia.com.br` e
   `www.brincadeiradodia.com.br` e copie os registros de DNS para o Registro.br.

O preset "Other" garante que a Vercel publique exatamente a pasta `out/`, com o `sw.js`
gerado depois do build. O plano gratuito (Hobby) permite pedir doações; links de
afiliado ou venda exigem plano pago.

## Manutenção

### Adicionar ou editar uma brincadeira

1. Copie um arquivo de `content/brincadeiras/` e mude o nome do arquivo e o `id` (iguais, só minúsculas e hífen).
2. Campos:
   - `area`: `explorar`, `linguagem`, `autocontrole`, `raciocinio`, `corpo`, `fazdeconta` ou `musica`. Cada área é um dia da semana.
   - `ordem`: 1 para semanas ímpares, 2 para semanas pares (rodízio da brincadeira do dia).
   - `faixas`: idades atendidas, ex. `["3-4"]`. Uma faixa passa a ser oferecida nas boas-vindas assim que tiver conteúdo.
   - `etiquetas`: materiais para o filtro do Explorar (`papel`, `brinquedos`, `fita`, `massinha`, `agua`, `livro`, `cozinha`). Vazio = sem material.
   - `seguranca`: obrigatório pensar nele. Use `null` só quando não houver risco.
   - `base`: de onde veio a ideia. Cite a fonte como inspiração, nunca como aval.
3. Rode `npm run build`. Se algo estiver errado, o build para e diz o arquivo e o campo.
4. Publique. O service worker troca o cache sozinho na próxima visita.

Regras do conteúdo: texto próprio (o guia de Harvard não permite tradução ou adaptação
sem autorização por escrito), linguagem neutra ("a criança"), passos curtos e sempre um
aviso de segurança quando houver peças pequenas, água, comida, faca ou altura.

### Rotina mensal (30 minutos)

- Ler o painel com as cinco perguntas de `docs/metricas.md`.
- Revisar as brincadeiras com mais "não rolou" e as mais trocadas para "mais fácil".
- Conferir se os links da página Sobre continuam funcionando.
- A cada 3 meses: `npm outdated`, atualizar dependências, `npm run build` e testar o fluxo
  boas-vindas → hoje → brincando → diário no celular.

### Estrutura

```
app/                  páginas (hoje, boas-vindas, brincadeira/[id], brincando, explorar, diário, instalar, sobre)
components/           telas e partes reutilizáveis
content/brincadeiras/ uma brincadeira por arquivo JSON
config/site.ts        PIX, contato, métricas, apoio, custos
lib/                  esquema do conteúdo, plano do dia, armazenamento local, PIX, lembrete, métricas
public/               manifesto e ícones do PWA (npm run icones para gerar de novo)
scripts/              gerar-sw.mjs (offline) e gerar-icones.py
infra/umami/          docker-compose do painel de métricas
docs/metricas.md      instalação do painel e o que olhar nele
```

## Privacidade

Nada do que a família digita sai do aparelho. As métricas são agregadas e anônimas, sem
cookies. O botão "Apagar meus dados deste aparelho", na página Sobre, limpa tudo.
O site não substitui a orientação do pediatra.

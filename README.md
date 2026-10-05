# Brincadeira do Dia

Site e PWA gratuito com uma brincadeira por dia, de 5 a 15 minutos (uns 10, em geral), para pais e
cuidadores fazerem com a criança, com o que têm em casa. Funciona no navegador do computador e no
celular. O site é para os adultos; a criança brinca longe da tela.

- **Computador e tablet:** barra de navegação no topo, telas em duas colunas e atalhos de
  teclado no modo "Brincando" (setas mudam o passo, espaço começa ou pausa o tempo).
- **Celular:** coluna única, barra de navegação embaixo e botões grandes para uma mão.

- **Sem login e sem banco de dados.** Crianças, diário e preferências ficam no próprio celular (IndexedDB).
- **Várias crianças:** cada uma tem idade, apelido, diário e sequência de brincadeiras próprios. A troca
  fica no topo de Hoje, Explorar e Diário, e em `/criancas/` dá para adicionar, editar e remover. Quem já
  usava o site com uma criança é migrado automaticamente na primeira visita, sem perder o diário.
- **Funciona sem internet** depois da primeira visita: o service worker guarda todas as páginas na instalação; os dados de navegação interna são guardados conforme o uso.
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

- **`responsavel` e `contato`** (obrigatórios): nome de quem mantém o site e o e-mail de
  atendimento. Aparecem nos Termos de Uso e na Política de Privacidade; a LGPD exige
  identificar o controlador e oferecer um canal. O build avisa se estiverem vazios.
- **`provedores`**: onde ficam a hospedagem e o servidor de métricas (informe o país do datacenter da Contabo).

- **`pix`**: use uma **chave aleatória** da sua conta, não o número do CPF. A chave fica
  pública no site e no QR code. Preencha também o nome como está no banco (sem acento)
  e a cidade. Enquanto a chave estiver vazia, o bloco do PIX não aparece; o de
  compartilhar continua.
- **`apoioCobre`**: a lista, sem valores, do que o apoio ajuda a pagar (página Sobre).
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
   - `ordem`: posição no rodízio da área (1 a 4). Semana 1 usa a de ordem 1, semana 2 a de ordem 2, e assim por diante.
     Quando o rodízio dá a volta, a brincadeira volta igual: o nível nunca muda sozinho, a família escolhe
     "Mais fácil", "Original" ou "Mais difícil". Não pode repetir ordem na mesma área e faixa.
   - `minutos`: tempo estimado de brincadeira (a família para quando a criança quiser).
   - `preparo` (opcional): preparo, limpeza ou observação em outros dias que não cabem nos minutos, até 160
     letras. Ex.: `"10 minutos para montar; depois, uma olhada por dia"`. Aparece na ficha, em "Você vai precisar".
   - `serve`: começa sempre com "Treina…" (o build confere). Nada de "melhora" ou "desenvolve".
   - `faixas`: idades atendidas, ex. `["3-4"]`. Uma faixa passa a ser oferecida nas boas-vindas assim que tiver conteúdo publicado.
   - `etiquetas`: materiais para o filtro do Explorar (`papel`, `brinquedos`, `fita`, `massinha`, `agua`, `livro`, `cozinha`). Vazio = sem material.
   - `seguranca`: obrigatório pensar nele. Use `null` só quando não houver risco.
   - `base`: de onde veio a ideia, em até 200 letras. Cite a fonte como inspiração, nunca como aval, e diga o que
     mudou na nossa versão. Para estudo, diga quem participou (idade, contexto) e que a ficha não foi testada.
   - `evidencia` (origem da ideia, não nota de eficácia):
     - `A`: inspirada em atividade estudada com crianças. Só use com o estudo e a tarefa localizados.
     - `B`: inspirada em sugestão de atividade de uma instituição (a dica, não o marco do desenvolvimento).
     - `C`: brincadeira tradicional brasileira ou variação dela (diga quando for variação).
     - `D`: só há um objetivo da BNCC relacionado. O build exige uma fonte com "BNCC" no título.
   - `fontes`: de 1 a 4 `{ "titulo", "url" }`, sempre `https://`. Aparecem em "De onde veio a ideia".
   - `status`: `rascunho` (fica fora do site) ou `publicada`.
   - `revisao`: `null` enquanto ninguém revisou (a ficha fica no ar e avisa "Ainda não revisada por
     profissional"). Quando uma
     profissional doar a revisão:
     ```json
     "revisao": {
       "profissao": "Terapeuta ocupacional",
       "nome": "Ana Souza",
       "registro": "CREFITO-3 000000-F",
       "em": "2026-11-10",
       "mostrarNome": true,
       "observacoes": "O que ela pediu para mudar."
     }
     ```
     Com `mostrarNome: true`, a ficha mostra "Revisada por Ana Souza, terapeuta ocupacional, em nov/2026" e o
     nome entra nos agradecimentos da página Sobre. Com `false`, aparece só a profissão. Registro profissional e
     observações nunca vão para a página: ficam só no arquivo.
3. Rode `npm run build`. Se algo estiver errado, o build para e diz o arquivo e o campo. O build também diz
   quantas brincadeiras estão no ar, quantas têm selo de revisão e quais rascunhos ficaram de fora.
4. Publique. O service worker troca o cache sozinho na próxima visita.

### Publicação e revisão voluntária

- Toda brincadeira vai ao ar com a fonte (`fontes`, `evidencia`, `base`) e o checklist de segurança do Plano
  de Conteúdo. A revisão de profissional não trava a publicação: é um selo que chega depois. As fichas com
  água, comida, faca ou plantas são as primeiras da fila de revisão.
- **Textos padrão de segurança** (use sempre o mesmo texto):
  - Água: adulto ao alcance dos braços o tempo todo, sem celular; esvaziar tudo no fim.
  - Comida: só o que a criança já come e tolera, com textura que consegue mastigar; alergias e restrições;
    come sentada e acompanhada; uva e tomate-cereja em quatro, no comprimento.
  - Carro: só brincadeiras de voz. A criança fica na cadeirinha, com o cinto, e o motorista participa só com a
    voz, sem olhar para trás nem fazer gestos. Nada de procurar objetos, mudar de posição ou usar tela.
  - Toque e perseguição: só se a criança quiser; parar quando ela disser não ou se afastar.
  - Som: volume confortável, longe dos ouvidos; ninguém precisa gritar nem bater forte.
  - Peças pequenas: o teste do rolo de papel higiênico é triagem caseira, não certificação. Evitar também o que
    esfarela, solta pedaços ou pode ser apertado até caber na boca.
- **Doação de revisão:** com `contato` preenchido e `revisao.convidar: true` em `config/site.ts`, a página
  Sobre convida profissionais a revisar. Quando alguém revisar:
  1. Aplique as mudanças que a profissional pediu no texto.
  2. Preencha o campo `revisao` da brincadeira (modelo acima) e publique.
  3. Mudou de novo os passos, os materiais ou o aviso de segurança depois? A revisão valia para o texto
     anterior: apague o campo `revisao` (volte para `null`) até ela olhar de novo.
- **Autorização para mostrar o nome:** guarde a resposta por escrito (um e-mail basta). Modelo:
  > Autorizo o Brincadeira do Dia a mostrar meu nome e minha profissão como revisora das brincadeiras que
  > conferi, na página de cada uma e na página Sobre. Posso pedir para retirar a qualquer momento.
- **Repositório público?** O arquivo de cada brincadeira guarda o registro profissional e as observações. Se o
  repositório no GitHub for público, deixe-o privado ou não preencha esses dois campos.
- **Rascunhos:** `"status": "rascunho"` continua existindo para brincadeiras em preparo. Elas ficam fora do
  site. Para ver como ficariam, gere uma prévia: `NEXT_PUBLIC_RASCUNHOS=1 npm run build && npm run preview`
  (na Vercel, a variável `NEXT_PUBLIC_RASCUNHOS` = `1` só no ambiente Preview). A prévia mostra o selo
  "Rascunho" e pede para não ser indexada pelo Google.

### Rotina mensal (30 minutos)

- Ler o painel com as cinco perguntas de `docs/metricas.md`.
- Revisar as brincadeiras com mais "não rolou" e as mais trocadas para "mais fácil".
- Conferir se os links da página Sobre e das fontes das brincadeiras continuam funcionando.
- A cada 3 meses: `npm outdated`, atualizar dependências, `npm run build` e testar o fluxo
  boas-vindas → hoje → brincando → diário no celular.

### Estrutura

```
app/                  páginas (hoje, boas-vindas, crianças, brincadeira/[id], brincando, explorar, diário, instalar, sobre)
components/           telas e partes reutilizáveis
content/brincadeiras/ uma brincadeira por arquivo JSON
config/site.ts        PIX, contato, métricas, apoio, revisão
lib/                  esquema do conteúdo, plano do dia, armazenamento local, PIX, lembrete, métricas
public/               manifesto e ícones do PWA (npm run icones para gerar de novo)
scripts/              gerar-sw.mjs (offline) e gerar-icones.py
infra/umami/          docker-compose do painel de métricas
docs/metricas.md      instalação do painel e o que olhar nele
vercel.json           redirecionamentos de brincadeiras que mudaram de endereço
```

### Mudou o id de uma brincadeira?

Evite: o id é o endereço da página e fica guardado no diário das famílias. Se precisar:

1. Renomeie o arquivo e o `id`.
2. Em `lib/esquema.ts`, acrescente o par em `IDS_ANTIGOS` (`"id-antigo": "id-novo"`), para o diário
   continuar mostrando o nome certo.
3. Em `vercel.json`, acrescente o redirecionamento do endereço antigo para o novo (veja o exemplo do
   `chocalho-de-pote`, que virou `tambor-de-pote`).

## Termos, privacidade e segurança

- `/termos/` (Termos de Uso) e `/privacidade/` (Política de Privacidade, LGPD) ficam no rodapé.
- Nas boas-vindas, a pessoa marca que é maior de idade, que vai acompanhar a criança e que
  concorda com os dois documentos. O aceite (versão e data) fica guardado no aparelho.
- Mudou algo relevante nos textos? Troque `VERSAO_TERMOS` e `DATA_TERMOS` em `config/site.ts`:
  na próxima visita, todos aceitam de novo.
- Toda ficha mostra "Sempre com um adulto acompanhando" e o aviso específico da brincadeira.
  No modo "Brincando", o aviso específico aparece primeiro, antes de começar o tempo, junto com
  "Leia todos os passos antes e deixe o celular de lado" e a lista completa dos passos.
- O tempo é estimativa: o cronômetro é opcional e a família para quando a criança quiser.
- Os textos foram escritos com cuidado, mas não substituem a revisão de um advogado.

## Privacidade

Nada do que a família digita sai do aparelho. As métricas são agregadas e anônimas, sem
cookies. O botão "Apagar meus dados deste aparelho", na página Sobre, limpa tudo.
O site não substitui a orientação do pediatra.

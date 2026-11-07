# Métricas e painel

O site usa o **Umami**, instalado no seu VPS. Ele não usa cookies, não guarda IP
e não identifica pessoas. Os dados ficam no seu servidor.

## 1. Subir o Umami no VPS (Contabo, o mesmo do Postal)

Precisa de acesso SSH ao VPS e do Docker, que o Postal já usa. O Umami e o banco dele ocupam uns 500 MB
de memória.

```bash
# no VPS
docker ps                      # confira: o Caddy do Postal aparece como "postal-caddy"
ss -ltn | grep ':3000 '        # não deve mostrar nada; se mostrar, troque a porta 3000 no arquivo
mkdir -p ~/umami && cd ~/umami
nano docker-compose.yml        # cole o conteúdo de infra/umami/docker-compose.yml
nano .env                      # cole infra/umami/.env.example e troque os três valores
openssl rand -hex 32           # rode três vezes: um valor para cada linha do .env
docker compose up -d
docker compose logs -f umami   # espere aparecer "Ready" e saia com Ctrl+C
```

O Umami fica em `127.0.0.1:3000`: só o próprio servidor enxerga. Quem publica na internet é o Caddy.

## 2. Publicar em `metricas.brincadeiradodia.com.br`

1. **DNS:** crie um registro **A** com o nome `metricas` apontando para o IP do VPS, no mesmo lugar onde
   você criou os registros que ligaram o domínio à Vercel (no Registro.br, em "Editar zona"; se o domínio
   usa os servidores DNS da Vercel, em Domains → DNS Records). Leva de minutos a algumas horas para valer.
2. **Caddy do Postal:** na instalação padrão do Postal, o arquivo fica em `/opt/postal/config/Caddyfile`.
   Acrescente no fim dele, sem mexer no bloco do Postal:

   ```
   metricas.brincadeiradodia.com.br {
       reverse_proxy 127.0.0.1:3000
   }
   ```

   e recarregue: `docker exec -w /etc/caddy postal-caddy caddy reload`. Se der erro, confira o arquivo;
   `docker restart postal-caddy` também funciona (a página do Postal fica fora por segundos, os e-mails não
   param). O Caddy pede o certificado HTTPS sozinho assim que o DNS estiver valendo.
3. Abra `https://metricas.brincadeiradodia.com.br`. O login inicial é `admin` / `umami`: **troque a senha na
   hora**, no perfil do usuário (Profile), e ligue ali a verificação em duas etapas (2FA).

## 3. Ligar o site ao painel

1. No Umami, em Websites (ou Settings → Websites), clique em **Add website**: nome "Brincadeira do Dia",
   domínio `brincadeiradodia.com.br`.
2. Abra o site criado e copie o **Website ID** (um código como `a1b2c3d4-...`).
3. Em `config/site.ts`, preencha (dá para editar direto no GitHub, pelo lápis do arquivo):

   ```ts
   umami: {
     scriptUrl: "https://metricas.brincadeiradodia.com.br/script.js",
     websiteId: "COLE-O-ID-AQUI",
     dominio: "brincadeiradodia.com.br,www.brincadeiradodia.com.br",
   },
   ```

4. Publique o site de novo. Visitas em `localhost` não são contadas. Para conferir, abra o site no celular
   e veja a visita aparecer em Realtime no painel.

Quem usa bloqueador de anúncios pode não ser contado: o painel mostra um pouco menos do que o real. O Umami
permite trocar o nome do script (`TRACKER_SCRIPT_NAME`) para escapar dos bloqueadores; preferimos deixar o
padrão.

### Manutenção do painel

- **Atualizar:** `cd ~/umami && docker compose pull && docker compose up -d`. Antes de uma versão grande
  (de 3 para 4, por exemplo), faça a cópia abaixo.
- **Cópia do banco (uma vez por mês):**
  `docker compose exec -T db pg_dump -U umami umami | gzip > ~/umami-$(date +%F).sql.gz`
  e guarde o arquivo fora do VPS.

## 4. O que o painel mostra

Além de visitas e páginas mais vistas, o app envia estes eventos anônimos:

| Evento | Quando acontece | Dados enviados |
|---|---|---|
| `boas_vindas_concluida` | Família termina a escolha inicial | faixa de idade |
| `brincadeira_aberta` | Abre a ficha de uma brincadeira | id, área |
| `brincadeira_iniciada` | Toca em "Começar o tempo" | id, área, nível |
| `brincadeira_concluida` | Salva no diário | id, área, reação, nível |
| `diario_marco_1`, `diario_marco_5`, `diario_marco_10` | A família salva a 1ª, a 5ª e a 10ª brincadeira no diário (somando todas as crianças, uma vez por aparelho) | dias desde que a família entrou |
| `nivel_trocado` | Troca entre mais fácil, original e mais difícil (o nível nunca muda sozinho) | id, nível |
| `filtro_usado` | Usa um filtro no Explorar (idade, material, lugar ou tempo) | tipo, valor |
| `app_instalado` | Instala na tela inicial (Android/Chrome) | nenhum |
| `lembrete_baixado` | Baixa o lembrete de agenda | horário, origem (instalar, primeira-brincadeira) |
| `diario_exportado` / `diario_importado` | Faz ou restaura a cópia do diário | quantidade |
| `apoio_cartao_mostrado` | Cartão de apoio aparece | nenhum |
| `compartilhar_aberto` | Abre a janela de compartilhar | origem (ficha, apoio-cartao, apoio-secao, apoio-pagina) |
| `compartilhado` | Escolhe um canal na janela (conta o toque, não se a mensagem foi enviada) | canal (whatsapp, instagram, imagem, facebook, telegram, email, copiar, qrcode, qr_baixado, mais), origem |
| `apoio_pix_copiado` | Copia o código PIX | origem (apoio-cartao, apoio-secao, apoio-pagina), valor (5, 10, 20 ou outro) |
| `apoio_declarado` | Toca em "Já contribuí" (o site para de pedir por 6 meses naquele aparelho) | origem |
| `apoio_dispensado` | Toca em "Agora não" no cartão | nenhum |
| `revisao_convite_clicado` | Toca no convite de revisão da ficha ou num botão de e-mail da página Revisar | origem (ficha, revisar); id da ficha ou alvo (ficha, lote-A a lote-F) |
| `uso_semana` | Primeira abertura em cada semana de uso da família | número da semana |
| `crianca_adicionada` | Adiciona outra criança | faixa de idade, total de crianças |
| `crianca_trocada` | Troca a criança ativa | faixa de idade |
| `crianca_removida` | Remove uma criança do aparelho | total de crianças |

Nunca são enviados: apelido, anotações do diário, nome ou qualquer dado da criança.

## 5. As seis perguntas para olhar todo mês

Crie estes relatórios no Umami (Reports):

1. **As famílias chegam a brincar e criam o hábito?** No primeiro dia, um funil (Reports → Funnel, etapas por evento): `boas_vindas_concluida` → `brincadeira_iniciada` → `brincadeira_concluida`. Para o hábito, compare as contagens do mês: `boas_vindas_concluida` (famílias novas), `diario_marco_1`, `diario_marco_5` e `diario_marco_10`. Não use o funil aqui: ele junta etapas da mesma visita, com prazo em minutos, e a 5ª brincadeira acontece dias depois. Quem entra no fim do mês só chega à 10ª no mês seguinte; compare a 10ª de um mês com as famílias novas do mês anterior. O dado `dias` mostra quanto tempo cada marco levou.
2. **Elas voltam?** Eventos `uso_semana` filtrados por semana (1, 2, 4, 8). Se muitas chegam à semana 1 e poucas à 4, o problema é hábito: reforce o lembrete.
3. **Quais brincadeiras funcionam?** `brincadeira_concluida` por `id` e por `reacao`. As com muito "não rolou" pedem revisão do texto ou do nível.
4. **Os níveis estão bem calibrados?** Muito `nivel_trocado` para "facil" numa brincadeira indica que a versão original está pesada; muito para "dificil", que está fácil demais.
5. **O apoio funciona sem incomodar?** Compare `apoio_cartao_mostrado` com `compartilhado` (origem `apoio-cartao`), `apoio_pix_copiado` e `apoio_dispensado`. Se "dispensado" dominar, espaçe o cartão em `config/site.ts`.
   - `apoio_pix_copiado` por `valor` mostra qual atalho as pessoas escolhem; se quase ninguém usar R$ 20, troque os valores em `pix.valoresSugeridos`.
   - O PIX cai direto na sua conta e o site não fica sabendo. O painel mostra intenção (`apoio_pix_copiado`, `apoio_declarado`); o pagamento de verdade está no extrato, com o identificador de cada lugar do site (veja a seção 6).
   - Visitas da página `/apoiar/` mostram quantos procuram o apoio por conta própria, pela aba.
   Para saber por onde as famílias espalham o site, veja `compartilhado` por `canal`: se quase tudo for WhatsApp, é ali que vale caprichar na mensagem.
6. **Os profissionais chegam?** `revisao_convite_clicado` por `origem`: "ficha" conta quem tocou no convite de uma ficha; "revisar" conta quem abriu o e-mail na página Revisar (por `alvo`: uma ficha ou um lote). Compare com os e-mails que chegaram de fato: muito clique e pouco e-mail indica que o pedido parece trabalhoso.

Limitação: sem cookies, o Umami não sabe se duas visitas em semanas diferentes são da
mesma família. Por isso o próprio app conta a semana de uso no aparelho e só envia o
número (`uso_semana`). É uma aproximação, não uma medida exata de retenção.

## 6. Fechamento do mês do apoio (uns 15 minutos)

Uma vez por mês, só contagem e valor. Nada de nome de quem doou: o site não precisa saber.

**No painel** (Umami → Events, período = o mês que passou):

- Famílias novas (`boas_vindas_concluida`) e quantas chegaram à 5ª brincadeira (`diario_marco_5`).
- Cartões mostrados (`apoio_cartao_mostrado`) e "Agora não" (`apoio_dispensado`).
- PIX copiados (`apoio_pix_copiado`), por `valor` e por `origem`, e "Já contribuí" (`apoio_declarado`).

**No extrato:** os códigos do site levam um identificador (campo `txid` do PIX), que o banco de quem paga
repassa ao seu: `BRINCADEIRACARTAO` (cartão depois de uma brincadeira), `BRINCADEIRAAPOIAR` (página Apoiar)
e `BRINCADEIRASOBRE` (página Sobre). Onde ele aparece muda de banco para banco: no comprovante, nos
detalhes do PIX ou no próprio extrato. Confira no seu banco com o PIX de teste de R$ 1. Conte quantos PIX
chegaram com cada identificador e some os valores. Um PIX feito digitando a chave à mão chega sem
identificador; conte-o à parte.

**As contas que importam:**

- PIX recebidos ÷ PIX copiados: quantos dos que copiaram o código pagaram de fato.
- PIX do cartão (`BRINCADEIRACARTAO`) ÷ cartões mostrados: quanto o cartão rende.
- Valor recebido ÷ PIX recebidos: o valor médio, para saber se os atalhos fazem sentido.

Anote mês a mês (uma planilha ou esta tabela):

| Mês | Famílias novas | Chegaram à 5ª | Cartões | "Agora não" | PIX copiados | "Já contribuí" | PIX recebidos | Valor (R$) | O que mudou no site |
|---|---|---|---|---|---|---|---|---|---|
| out/2026 | | | | | | | | | Onda 2 no ar |

## 7. Quando mexer no cartão de apoio

Regras escritas antes de ver os números, para não mudar o site por impressão. São pontos de partida, não
números de pesquisa:

- **Espere volume:** pelo menos 100 cartões mostrados (ou dois meses) antes de mudar qualquer coisa. Com
  poucos casos, a diferença é sorte.
- **Uma mudança por vez,** anotada na tabela acima com a data, para saber o que causou o quê.
- **O cartão incomoda mais do que ajuda** ("Agora não" em mais de 7 de cada 10 cartões e menos de 1 PIX
  `BRINCADEIRACARTAO` a cada 100 cartões): passe `apoio.intervaloDias` de 30 para 60 em `config/site.ts`.
- **Copiam e não pagam** (mais de 5 PIX copiados a cada 100 cartões, mas menos de um terço deles vira PIX no
  extrato): o problema está no banco, não no cartão. Refaça o PIX de teste e veja se o código abre sem erro.
- **Poucas famílias chegam à 5ª** (menos de 1 em 4 das famílias novas): não mexa no cartão; o problema é o
  hábito (lembrete, conteúdo, primeira brincadeira). Baixar o cartão para a 3ª só pede antes de a família
  saber se gosta.
- **Ninguém usa um atalho** (menos de 1 em 10 dos PIX copiados): troque o valor em `pix.valoresSugeridos`.


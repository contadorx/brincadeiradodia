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
| `nivel_trocado` | Troca entre mais fácil, original e mais difícil (o nível nunca muda sozinho) | id, nível |
| `filtro_usado` | Usa um filtro no Explorar (idade, material, lugar ou tempo) | tipo, valor |
| `app_instalado` | Instala na tela inicial (Android/Chrome) | nenhum |
| `lembrete_baixado` | Baixa o lembrete de agenda | horário |
| `diario_exportado` / `diario_importado` | Faz ou restaura a cópia do diário | quantidade |
| `apoio_cartao_mostrado` | Cartão de apoio aparece | nenhum |
| `compartilhar_aberto` | Abre a janela de compartilhar | origem (ficha, apoio-cartao, apoio-secao) |
| `compartilhado` | Escolhe um canal na janela (conta o toque, não se a mensagem foi enviada) | canal (whatsapp, instagram, imagem, facebook, telegram, email, copiar, qrcode, qr_baixado, mais), origem |
| `apoio_pix_copiado` | Copia o código PIX | origem |
| `apoio_dispensado` | Toca em "Agora não" | nenhum |
| `uso_semana` | Primeira abertura em cada semana de uso da família | número da semana |
| `crianca_adicionada` | Adiciona outra criança | faixa de idade, total de crianças |
| `crianca_trocada` | Troca a criança ativa | faixa de idade |
| `crianca_removida` | Remove uma criança do aparelho | total de crianças |

Nunca são enviados: apelido, anotações do diário, nome ou qualquer dado da criança.

## 5. As cinco perguntas para olhar todo mês

Crie estes relatórios no Umami (Reports):

1. **As famílias chegam a brincar?** Funil: `boas_vindas_concluida` → `brincadeira_iniciada` → `brincadeira_concluida`.
2. **Elas voltam?** Eventos `uso_semana` filtrados por semana (1, 2, 4, 8). Se muitas chegam à semana 1 e poucas à 4, o problema é hábito: reforce o lembrete.
3. **Quais brincadeiras funcionam?** `brincadeira_concluida` por `id` e por `reacao`. As com muito "não rolou" pedem revisão do texto ou do nível.
4. **Os níveis estão bem calibrados?** Muito `nivel_trocado` para "facil" numa brincadeira indica que a versão original está pesada; muito para "dificil", que está fácil demais.
5. **O apoio funciona sem incomodar?** Compare `apoio_cartao_mostrado` com `compartilhado` (origem `apoio-cartao`), `apoio_pix_copiado` e `apoio_dispensado`. Se "dispensado" dominar, espaçe o cartão em `config/site.ts`.
   Para saber por onde as famílias espalham o site, veja `compartilhado` por `canal`: se quase tudo for WhatsApp, é ali que vale caprichar na mensagem.

Limitação: sem cookies, o Umami não sabe se duas visitas em semanas diferentes são da
mesma família. Por isso o próprio app conta a semana de uso no aparelho e só envia o
número (`uso_semana`). É uma aproximação, não uma medida exata de retenção.

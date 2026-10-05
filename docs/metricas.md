# Métricas e painel

O site usa o **Umami**, instalado no seu VPS. Ele não usa cookies, não guarda IP
e não identifica pessoas. Os dados ficam no seu servidor.

## 1. Subir o Umami no VPS

```bash
# no VPS
mkdir -p ~/umami && cd ~/umami
# copie infra/umami/docker-compose.yml e infra/umami/.env.example para cá
cp .env.example .env
nano .env                      # troque a senha e o segredo (openssl rand -hex 32)
docker compose up -d
docker compose logs -f umami   # espere aparecer "Ready"
```

O Umami fica em `127.0.0.1:3000`, sem acesso direto pela internet.

## 2. Publicar em um subdomínio

1. No Registro.br, crie um registro **A** `metricas.brincadeiradodia.com.br` apontando para o IP do VPS.
2. No proxy reverso que já atende o servidor (o mesmo usado pelo Postal), crie um site para
   `metricas.brincadeiradodia.com.br` repassando para `http://127.0.0.1:3000`, com HTTPS.
   Exemplo para Caddy:

   ```
   metricas.brincadeiradodia.com.br {
       reverse_proxy 127.0.0.1:3000
   }
   ```

3. Abra `https://metricas.brincadeiradodia.com.br`. O login inicial do Umami é
   `admin` / `umami`: **troque a senha na hora** (Settings → Profile).

## 3. Ligar o site ao painel

1. No Umami: Settings → Websites → Add website → nome "Brincadeira do Dia",
   domínio `brincadeiradodia.com.br`.
2. Copie o **Website ID**.
3. Em `config/site.ts`, preencha:

   ```ts
   umami: {
     scriptUrl: "https://metricas.brincadeiradodia.com.br/script.js",
     websiteId: "COLE-O-ID-AQUI",
     dominio: "brincadeiradodia.com.br",
   },
   ```

4. Publique o site de novo. Visitas em `localhost` não são contadas.

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

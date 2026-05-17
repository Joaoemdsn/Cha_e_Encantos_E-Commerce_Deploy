# Chá e Encantos — E-commerce

Loja de chás feita com Vue 3 + Vite no frontend e Express + Prisma + PostgreSQL no backend.

## O que foi ajustado nesta versão

- Banco configurado para PostgreSQL real via Prisma.
- Migration inicial PostgreSQL criada.
- Seed mantido para popular produtos e atividades.
- Modelo de favoritos criado no banco.
- Checkout de pagamento com Stripe Checkout.
- Webhook da Stripe para atualizar pedido como pago.
- Área de perfil em `/perfil` com dados do cliente, favoritos, pedidos e reservas.
- Rotas protegidas por JWT para perfil, favoritos, pedidos e reservas.
- Páginas de retorno do checkout: `/checkout/sucesso` e `/checkout/cancelado`.

## Banco de dados

Você pode usar Neon, Supabase, Railway, Render ou PostgreSQL local.

Para PostgreSQL local com Docker:

```bash
docker compose up -d
```

Depois use esta `DATABASE_URL` no `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cha_e_encantos?schema=public"
```

Para Neon/Supabase/Railway/Render, copie a connection string PostgreSQL do painel e coloque no `DATABASE_URL`.

## Como rodar o backend

```bash
cd backend
copy .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

No PowerShell, `copy .env.example .env` funciona. No Git Bash, macOS ou Linux, use `cp .env.example .env`.

A API fica em:

```txt
http://localhost:3000/api
```

## Como rodar o frontend

Em outro terminal:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

O Vite normalmente abre em:

```txt
http://localhost:5173
```

## Stripe Checkout

No `backend/.env`, preencha:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PUBLIC_APP_URL=http://localhost:5173
```

Para testar webhook localmente, use a Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

A Stripe CLI vai mostrar um `whsec_...`. Copie esse valor para `STRIPE_WEBHOOK_SECRET` e reinicie o backend.

Cartão de teste comum da Stripe:

```txt
4242 4242 4242 4242
```

Use qualquer data futura, qualquer CVC e qualquer CEP válido.

## Fluxos disponíveis

- Cadastro e login.
- Catálogo de produtos vindo do banco.
- Detalhe do produto.
- Favoritar/desfavoritar chás.
- Carrinho persistente no navegador.
- Checkout com Stripe.
- Perfil do cliente com favoritos, pedidos e reservas.
- Atividades e reservas autenticadas.

## Observações importantes

- Os preços estão em reais no banco, por exemplo `100` representa `R$ 100`. Na Stripe, o backend converte para centavos automaticamente.
- O pedido fica `pending` ao iniciar checkout e muda para `paid` quando o webhook `checkout.session.completed` chega da Stripe.
- Sem o webhook local rodando, o pagamento pode ser concluído na Stripe, mas o pedido ficará pendente no banco.


## Recursos adicionados nesta versão

- Recuperação de senha em ambiente local: o endpoint retorna um `devResetUrl`; em produção, integre esse link com um provedor de email.
- Avaliações de produtos e atividades com nota de 1 a 5 estrelas e comentário.
- Assinatura mensal de caixinhas via Stripe Checkout em modo subscription.
- Painel administrativo em `/admin`.

Usuário administrador criado pelo seed:

```txt
admin@chaeencantos.com.br
senha: admin123
```

Após atualizar esta versão em um banco já existente, rode:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name add_auth_reviews_subscriptions_admin
npm run seed
npm run dev
```

Para assinatura com Stripe, você pode usar `STRIPE_SECRET_KEY` e `STRIPE_WEBHOOK_SECRET` como já fez no checkout. Caso queira usar preços criados diretamente na Stripe, preencha o campo `stripePriceId` do plano no banco; caso contrário, o sistema cria o preço mensal dinamicamente no Checkout.

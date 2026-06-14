# MedEducaIA — Runbook de Produção

Passos para colocar no ar com pagamento real e entitlement seguro. Ordem importa.

## Arquitetura de pagamento (o que foi implementado)

```
Pricing → redirectToCheckout(plan)
  → POST /api/create-checkout-session   (verifica Firebase ID token, cria sessão Stripe)
  → Stripe Checkout hospedado
  → pagamento aprovado
  → Stripe dispara webhook → POST /api/stripe-webhook  (valida assinatura)
  → grava users/{uid}.plan = 'pro' no Firestore (Admin SDK, ignora rules)
  → useAuth (onSnapshot) reflete 'pro' no client em tempo real
```

O entitlement é **server-authoritative**: o cliente não consegue se promover a `pro`
(bloqueado pelas Firestore Rules). Só o webhook grava `plan`.

## 1. Firebase

1. Firebase Console → Project Settings → pegue a config web (apiKey, appId, messagingSenderId).
2. Authentication → habilite **Email/Password** e **Google**.
3. Authentication → Settings → Authorized domains → adicione o domínio de produção.
4. Firestore → crie o database (modo produção).
5. Publique as rules deste repo:
   ```bash
   npm i -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules   # usa firestore.rules
   ```
6. Project Settings → Service accounts → **Generate new private key** → guarde o JSON
   (vira a env `FIREBASE_SERVICE_ACCOUNT`).

## 2. Stripe

1. Crie 2 **Prices** recorrentes (mensal R$ 29,90 / anual R$ 238,80) → copie os `price_...`.
2. Developers → API keys → copie a **Secret key** (`sk_live_...`) e a **Publishable** (`pk_live_...`).
3. Developers → Webhooks → **Add endpoint**:
   - URL: `https://<seu-dominio>/api/stripe-webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`,
     `customer.subscription.created`, `customer.subscription.deleted`
   - Copie o **Signing secret** (`whsec_...`) → env `STRIPE_WEBHOOK_SECRET`.

## 3. Vercel — Environment Variables

Defina TODAS (Production + Preview). Veja `.env.example`. Resumo:

| Variável | Escopo | Secreto? |
|---|---|---|
| `VITE_FIREBASE_*` (6) | Frontend | Não (público por design) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Frontend | Não |
| `STRIPE_SECRET_KEY` | Backend | **SIM** |
| `STRIPE_WEBHOOK_SECRET` | Backend | **SIM** |
| `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_ANNUAL` | Backend | Não |
| `FIREBASE_SERVICE_ACCOUNT` | Backend | **SIM** (JSON ou base64) |
| `PUBLIC_APP_URL` | Backend | Não |

> Dica: `FIREBASE_SERVICE_ACCOUNT` em base64 evita problemas de quebra de linha:
> `base64 -i serviceAccount.json | pbcopy`

## 4. Deploy

```bash
vercel        # preview
vercel --prod # produção
```
As funções em `/api` viram serverless functions automaticamente. O `vercel.json`
já tem rewrites SPA + headers de segurança (X-Frame-Options, nosniff, Referrer-Policy).

## 5. Teste end-to-end (Stripe test mode primeiro)

1. Use chaves `sk_test`/`pk_test` + cartão `4242 4242 4242 4242`.
2. Login → Pricing → assinar → confirme redirect pro Stripe.
3. Pague → confirme retorno em `/#/specialties?checkout=success`.
4. Stripe Dashboard → Webhooks → confirme `200` no evento.
5. Firestore → `users/{uid}` deve ter `plan: 'pro'`.
6. App deve refletir `pro` sem reload (onSnapshot).

---

## ⚠️ Pendências antes de cobrar de verdade (decisões de produto)

1. **Gate de conteúdo por plano** — hoje NENHUMA rota é gateada por `plan`.
   Criei `src/components/PremiumRoute.tsx`. Para ativar o paywall, troque em `src/App.tsx`
   o `ProtectedRoute` por `PremiumRoute` nas rotas pagas (provável: `/case/:id`,
   `/flashcards`, `/analytics`; manter `/specialties` aberto como vitrine). **Decisão sua
   qual conteúdo é free vs pro** — por isso não apliquei automaticamente.
2. **Conteúdo no Firestore** — casos/flashcards hoje são mock hardcoded no bundle
   (qualquer um lê via devtools). Migrar conteúdo pago para a coleção `premiumContent`
   (já protegida nas rules) para o gate ser real, não só de UI.
3. **Itens HIGH do security review**: validação zod nos forms de Login/Register,
   rate limiting de login, mensagens de erro genéricas (anti-enumeração de e-mail),
   verificação de e-mail no registro.

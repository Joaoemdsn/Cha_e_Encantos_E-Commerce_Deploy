import { Response } from 'express'
import Stripe from 'stripe'
import { prisma } from '../lib.js'
import { AuthRequest } from '../middleware/auth.js'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || secretKey.includes('sua_chave')) throw new Error('STRIPE_SECRET_KEY não configurada')
  return new Stripe(secretKey)
}

const priceToCents = (price: number) => Math.round(price * 100)

export const getSubscriptionPlans = async (req: AuthRequest, res: Response) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({ where: { active: true }, orderBy: { price: 'asc' } })
    return res.json(plans)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar planos de assinatura' })
  }
}

export const getMySubscriptions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' })
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.user.id },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    })
    return res.json(subscriptions)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar suas assinaturas' })
  }
}

export const createSubscriptionCheckout = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' })
    const { planId } = req.body
    if (!planId) return res.status(400).json({ error: 'Plano é obrigatório' })

    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } })
    if (!plan || !plan.active) return res.status(404).json({ error: 'Plano não encontrado' })

    const stripe = getStripe()
    const frontendUrl = (process.env.PUBLIC_APP_URL || process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0]

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = plan.stripePriceId
      ? { price: plan.stripePriceId, quantity: 1 }
      : {
          quantity: 1,
          price_data: {
            currency: 'brl',
            unit_amount: priceToCents(plan.price),
            recurring: { interval: 'month' },
            product_data: { name: plan.name, description: plan.description },
          },
        }

    const subscription = await prisma.subscription.create({
      data: { userId: req.user.id, planId: plan.id, status: 'pending' },
    })

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: req.user.email,
      line_items: [lineItem],
      metadata: { subscriptionId: subscription.id, planId: plan.id, userId: req.user.id },
      subscription_data: { metadata: { subscriptionId: subscription.id, planId: plan.id, userId: req.user.id } },
      success_url: `${frontendUrl}/checkout/sucesso?subscription_session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/assinatura?cancelado=1`,
    })

    await prisma.subscription.update({ where: { id: subscription.id }, data: { stripeSessionId: session.id } })
    return res.status(201).json({ checkoutUrl: session.url, sessionId: session.id, subscriptionId: subscription.id })
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao iniciar assinatura' })
  }
}

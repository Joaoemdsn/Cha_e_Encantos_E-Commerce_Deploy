import { Request, Response } from 'express'
import Stripe from 'stripe'
import { prisma } from '../lib.js'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || secretKey.includes('sua_chave')) throw new Error('STRIPE_SECRET_KEY não configurada')
  return new Stripe(secretKey)
}

const getPeriodEnd = (subscription: Stripe.Subscription) => {
  const periodEnd = (subscription as any).current_period_end
  return periodEnd ? new Date(periodEnd * 1000) : null
}

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const stripe = getStripe()
  const signature = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret || webhookSecret.includes('seu_webhook')) {
    return res.status(400).send('Stripe webhook não configurado')
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret)
  } catch (error: any) {
    return res.status(400).send(`Webhook inválido: ${error.message}`)
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId
      const subscriptionId = session.metadata?.subscriptionId

      if (orderId) {
        await prisma.$transaction([
          prisma.payment.updateMany({
            where: { stripeSessionId: session.id },
            data: { status: 'paid', stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null },
          }),
          prisma.order.update({ where: { id: orderId }, data: { status: 'paid' } }),
        ])
      }

      if (subscriptionId) {
        let currentPeriodEnd: Date | null = null
        if (typeof session.subscription === 'string') {
          const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription)
          currentPeriodEnd = getPeriodEnd(stripeSubscription)
        }
        await prisma.subscription.update({
          where: { id: subscriptionId },
          data: {
            status: 'active',
            stripeSessionId: session.id,
            stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : null,
            currentPeriodEnd,
          },
        })
      }
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId
      const subscriptionId = session.metadata?.subscriptionId

      if (orderId) {
        await prisma.$transaction([
          prisma.payment.updateMany({ where: { stripeSessionId: session.id }, data: { status: 'expired' } }),
          prisma.order.update({ where: { id: orderId }, data: { status: 'cancelled' } }),
        ])
      }
      if (subscriptionId) {
        await prisma.subscription.update({ where: { id: subscriptionId }, data: { status: 'cancelled' } })
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      const status = event.type === 'customer.subscription.deleted' ? 'canceled' : subscription.status
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { status, currentPeriodEnd: getPeriodEnd(subscription) },
      })
    }

    return res.json({ received: true })
  } catch (error) {
    return res.status(500).send('Erro ao processar webhook')
  }
}

import { Response } from 'express'
import Stripe from 'stripe'
import { AuthRequest } from '../middleware/auth.js'
import { prisma } from '../lib.js'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || secretKey.includes('sua_chave')) {
    throw new Error('STRIPE_SECRET_KEY não configurada')
  }
  return new Stripe(secretKey)
}

const priceToCents = (price: number) => Math.round(price * 100)

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } }, payment: true },
      orderBy: { createdAt: 'desc' },
    })

    return res.json(orders)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar pedidos' })
  }
}

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const { id } = req.params
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, payment: true },
    })

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    return res.json(order)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar pedido' })
  }
}

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const { items } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Nenhum item no pedido' })
    }

    let total = 0
    const orderItems = []

    for (const item of items) {
      const productId = item.productId || item.product?.id
      const quantity = Number(item.quantity || 1)

      if (!productId || quantity < 1) {
        return res.status(400).json({ error: 'Itens inválidos no pedido' })
      }

      const product = await prisma.product.findUnique({ where: { id: productId } })
      if (!product) {
        return res.status(404).json({ error: `Produto ${productId} não encontrado` })
      }

      total += product.price * quantity
      orderItems.push({ productId: product.id, quantity, price: product.price })
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        status: 'pending',
        items: { createMany: { data: orderItems } },
      },
      include: { items: { include: { product: true } } },
    })

    return res.status(201).json(order)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar pedido' })
  }
}

export const checkoutOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const { items } = req.body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Nenhum item no checkout' })
    }

    const stripe = getStripe()
    const frontendUrl = (process.env.PUBLIC_APP_URL || process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0]

    let total = 0
    const orderItems = []
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    for (const item of items) {
      const productId = item.productId || item.product?.id
      const quantity = Number(item.quantity || 1)

      if (!productId || quantity < 1) {
        return res.status(400).json({ error: 'Itens inválidos no checkout' })
      }

      const product = await prisma.product.findUnique({ where: { id: productId } })
      if (!product) {
        return res.status(404).json({ error: `Produto ${productId} não encontrado` })
      }

      total += product.price * quantity
      orderItems.push({ productId: product.id, quantity, price: product.price })
      lineItems.push({
        quantity,
        price_data: {
          currency: 'brl',
          unit_amount: priceToCents(product.price),
          product_data: {
            name: product.name,
            description: product.description,
          },
        },
      })
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        status: 'pending',
        items: { createMany: { data: orderItems } },
      },
      include: { items: { include: { product: true } } },
    })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: req.user.email,
      line_items: lineItems,
      metadata: {
        orderId: order.id,
        userId: req.user.id,
      },
      success_url: `${frontendUrl}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout/cancelado?order_id=${order.id}`,
    })

    await prisma.payment.create({
      data: {
        orderId: order.id,
        stripeSessionId: session.id,
        amount: total,
        status: 'pending',
      },
    })

    return res.status(201).json({ orderId: order.id, checkoutUrl: session.url, sessionId: session.id })
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Erro ao iniciar pagamento' })
  }
}

export const getCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const { sessionId } = req.params
    const payment = await prisma.payment.findUnique({
      where: { stripeSessionId: sessionId },
      include: { order: true },
    })

    if (!payment || payment.order.userId !== req.user.id) {
      return res.status(404).json({ error: 'Sessão não encontrada' })
    }

    return res.json({ payment, order: payment.order })
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao consultar pagamento' })
  }
}

import { Response } from 'express'
import { prisma } from '../lib.js'
import { AuthRequest } from '../middleware/auth.js'

export const getAdminOverview = async (req: AuthRequest, res: Response) => {
  try {
    const [products, activities, orders, bookings, subscriptions, users] = await Promise.all([
      prisma.product.count(),
      prisma.activity.count(),
      prisma.order.count(),
      prisma.booking.count(),
      prisma.subscription.count(),
      prisma.user.count(),
    ])

    const revenue = await prisma.order.aggregate({ where: { status: 'paid' }, _sum: { total: true } })

    return res.json({ products, activities, orders, bookings, subscriptions, users, paidRevenue: revenue._sum.total || 0 })
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao carregar painel administrativo' })
  }
}

export const getAdminOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, items: { include: { product: true } }, payment: true },
      orderBy: { createdAt: 'desc' },
    })
    return res.json(orders)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar pedidos' })
  }
}

export const updateAdminOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const allowed = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Status inválido' })
    const order = await prisma.order.update({ where: { id }, data: { status } })
    return res.json(order)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar pedido' })
  }
}

export const getAdminBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { user: { select: { name: true, email: true } }, activity: true, slot: true },
      orderBy: { createdAt: 'desc' },
    })
    return res.json(bookings)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar reservas' })
  }
}

export const getAdminSubscriptions = async (req: AuthRequest, res: Response) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: { user: { select: { name: true, email: true } }, plan: true },
      orderBy: { createdAt: 'desc' },
    })
    return res.json(subscriptions)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao listar assinaturas' })
  }
}

export const createSubscriptionPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, description, price, benefits, stripePriceId } = req.body
    if (!name || !slug || !description || !price) return res.status(400).json({ error: 'Preencha os dados do plano' })
    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        benefits: Array.isArray(benefits) ? benefits : String(benefits || '').split('\n').filter(Boolean),
        stripePriceId: stripePriceId || null,
      },
    })
    return res.status(201).json(plan)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar plano' })
  }
}

import { Response } from 'express'
import { prisma } from '../lib.js'
import { AuthRequest } from '../middleware/auth.js'

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' })

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        favorites: { include: { product: true }, orderBy: { createdAt: 'desc' } },
        orders: { include: { items: { include: { product: true } }, payment: true }, orderBy: { createdAt: 'desc' } },
        bookings: { include: { activity: true, slot: true }, orderBy: { createdAt: 'desc' } },
        subscriptions: { include: { plan: true }, orderBy: { createdAt: 'desc' } },
        productReviews: { include: { product: true }, orderBy: { createdAt: 'desc' } },
        activityReviews: { include: { activity: true }, orderBy: { createdAt: 'desc' } },
      },
    })

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao carregar perfil' })
  }
}

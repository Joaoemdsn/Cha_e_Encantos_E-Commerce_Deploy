import { Response } from 'express'
import { prisma } from '../lib.js'
import { AuthRequest } from '../middleware/auth.js'

const normalizeRating = (rating: any) => {
  const parsed = Number(rating)
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 5) return null
  return parsed
}

export const createProductReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' })
    const { productId } = req.params
    const rating = normalizeRating(req.body.rating)
    if (!rating) return res.status(400).json({ error: 'A avaliação precisa ser de 1 a 5 estrelas' })

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' })

    const review = await prisma.productReview.upsert({
      where: { userId_productId: { userId: req.user.id, productId } },
      create: { userId: req.user.id, productId, rating, comment: req.body.comment || null },
      update: { rating, comment: req.body.comment || null },
      include: { user: { select: { name: true } } },
    })

    return res.status(201).json(review)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao avaliar produto' })
  }
}

export const createActivityReview = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Não autenticado' })
    const { activityId } = req.params
    const rating = normalizeRating(req.body.rating)
    if (!rating) return res.status(400).json({ error: 'A avaliação precisa ser de 1 a 5 estrelas' })

    const activity = await prisma.activity.findUnique({ where: { id: activityId } })
    if (!activity) return res.status(404).json({ error: 'Atividade não encontrada' })

    const review = await prisma.activityReview.upsert({
      where: { userId_activityId: { userId: req.user.id, activityId } },
      create: { userId: req.user.id, activityId, rating, comment: req.body.comment || null },
      update: { rating, comment: req.body.comment || null },
      include: { user: { select: { name: true } } },
    })

    return res.status(201).json(review)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao avaliar atividade' })
  }
}

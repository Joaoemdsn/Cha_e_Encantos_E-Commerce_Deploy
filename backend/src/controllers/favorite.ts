import { Response } from 'express'
import { prisma } from '../lib.js'
import { AuthRequest } from '../middleware/auth.js'

export const getMyFavorites = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })

    return res.json(favorites)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar favoritos' })
  }
}

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const { productId } = req.body
    if (!productId) {
      return res.status(400).json({ error: 'Produto é obrigatório' })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' })
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    })

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } })
      return res.json({ favorited: false, productId })
    }

    const favorite = await prisma.favorite.create({
      data: { userId: req.user.id, productId },
      include: { product: true },
    })

    return res.status(201).json({ favorited: true, favorite })
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar favorito' })
  }
}

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const { productId } = req.params
    await prisma.favorite.deleteMany({ where: { userId: req.user.id, productId } })

    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao remover favorito' })
  }
}

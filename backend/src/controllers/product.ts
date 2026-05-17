import { Request, Response } from 'express'
import { prisma } from '../lib.js'
import { AuthRequest } from '../middleware/auth.js'

const withReviewSummary = (product: any) => {
  const reviews = product.reviews || []
  const reviewCount = reviews.length
  const averageRating = reviewCount ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviewCount : 0
  return { ...product, reviewCount, averageRating }
}

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({ include: { reviews: true }, orderBy: { createdAt: 'desc' } })
    res.json(products.map(withReviewSummary))
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' } } },
    })

    if (!product) return res.status(404).json({ error: 'Produto não encontrado' })
    res.json(withReviewSummary(product))
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produto' })
  }
}

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, tag, price, weight, ingredients, description, image } = req.body
    if (!name || !category || !tag || !price || !weight || !ingredients || !description || !image) {
      return res.status(400).json({ error: 'Preencha todos os campos do produto' })
    }

    const product = await prisma.product.create({
      data: { name, category, tag, price: Number(price), weight, ingredients, description, image },
    })

    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto' })
  }
}

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const data = { ...req.body }
    if (data.price !== undefined) data.price = Number(data.price)
    const product = await prisma.product.update({ where: { id }, data })
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto' })
  }
}

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    await prisma.product.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto' })
  }
}

import { Request, Response } from 'express'
import { prisma } from '../lib.js'
import { AuthRequest } from '../middleware/auth.js'

const withReviewSummary = (activity: any) => {
  const reviews = activity.reviews || []
  const reviewCount = reviews.length
  const averageRating = reviewCount ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviewCount : 0
  return { ...activity, reviewCount, averageRating }
}

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const activities = await prisma.activity.findMany({
      include: { slots: { orderBy: { dateTime: 'asc' } }, reviews: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(activities.map(withReviewSummary))
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar atividades' })
  }
}

export const getActivityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        slots: { orderBy: { dateTime: 'asc' } },
        reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' } },
      },
    })

    if (!activity) return res.status(404).json({ error: 'Atividade não encontrada' })
    res.json(withReviewSummary(activity))
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar atividade' })
  }
}

export const createActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { title, duration, price, description } = req.body
    if (!title || !duration || !price || !description) return res.status(400).json({ error: 'Preencha todos os campos da atividade' })
    const activity = await prisma.activity.create({ data: { title, duration, price: Number(price), description } })
    res.status(201).json(activity)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar atividade' })
  }
}

export const updateActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const data = { ...req.body }
    if (data.price !== undefined) data.price = Number(data.price)
    const activity = await prisma.activity.update({ where: { id }, data })
    res.json(activity)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar atividade' })
  }
}

export const createActivitySlot = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { dateTime, capacity } = req.body
    if (!dateTime) return res.status(400).json({ error: 'Data e horário são obrigatórios' })
    const slot = await prisma.activitySlot.create({
      data: { activityId: id, dateTime: new Date(dateTime), capacity: Number(capacity || 10) },
    })
    res.status(201).json(slot)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar horário da atividade' })
  }
}

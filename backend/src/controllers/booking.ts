import { Response } from 'express'
import { prisma } from '../lib.js'
import { AuthRequest } from '../middleware/auth.js'

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        activity: true,
        slot: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return res.json(bookings)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar reservas' })
  }
}

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    const { activityId, slotId } = req.body

    if (!activityId || !slotId) {
      return res.status(400).json({ error: 'Atividade e horário são obrigatórios' })
    }

    const slot = await prisma.activitySlot.findUnique({
      where: { id: slotId },
      include: { activity: true },
    })

    if (!slot || slot.activityId !== activityId) {
      return res.status(404).json({ error: 'Horário não encontrado para esta atividade' })
    }

    if (slot.booked >= slot.capacity) {
      return res.status(400).json({ error: 'Não há vagas disponíveis neste horário' })
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: req.user.id,
        slotId,
        status: { not: 'cancelled' },
      },
    })

    if (existingBooking) {
      return res.status(400).json({ error: 'Você já possui uma reserva neste horário' })
    }

    const booking = await prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          userId: req.user!.id,
          activityId,
          slotId,
          status: 'confirmed',
        },
        include: {
          activity: true,
          slot: true,
        },
      })

      await tx.activitySlot.update({
        where: { id: slotId },
        data: { booked: { increment: 1 } },
      })

      return created
    })

    return res.status(201).json(booking)
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar reserva' })
  }
}

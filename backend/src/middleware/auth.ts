import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { prisma } from '../lib.js'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role?: string
  }
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string
      email: string
    }
    const user = await prisma.user.findUnique({ where: { id: decoded.id }, select: { id: true, email: true, role: true } })
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' })
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: 'Não autenticado' })
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso restrito ao administrador' })
  next()
}

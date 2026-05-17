import { Request, Response } from 'express'
import crypto from 'crypto'
import { generateToken, hashPassword, comparePassword } from '../utils/auth.js'
import { prisma } from '../lib.js'


const publicUser = (user: { id: string; email: string; name: string; role?: string }) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role || 'customer',
})

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' })
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({ data: { email, password: hashedPassword, name } })
    const token = generateToken(user.id, user.email)

    res.status(201).json({ user: publicUser(user), token })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar usuário' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' })

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) return res.status(401).json({ error: 'Credenciais inválidas' })

    const token = generateToken(user.id, user.email)
    res.json({ user: publicUser(user), token })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email é obrigatório' })

    const user = await prisma.user.findUnique({ where: { email } })
    // Por segurança, respondemos sucesso mesmo se o email não existir.
    if (!user) return res.json({ message: 'Se o email estiver cadastrado, enviaremos instruções de recuperação.' })

    const token = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30)

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: tokenHash, passwordResetExpiresAt: expiresAt },
    })

    const resetUrl = `${process.env.PUBLIC_APP_URL || process.env.FRONTEND_URL || 'http://localhost:5173'}/login?resetToken=${token}&email=${encodeURIComponent(email)}`

    return res.json({
      message: 'Se o email estiver cadastrado, enviaremos instruções de recuperação.',
      // Em produção, envie esse link por email e remova o campo abaixo.
      devResetUrl: resetUrl,
    })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao solicitar recuperação de senha' })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, email, password } = req.body
    if (!token || !email || !password) return res.status(400).json({ error: 'Token, email e nova senha são obrigatórios' })
    if (String(password).length < 6) return res.status(400).json({ error: 'A nova senha deve ter pelo menos 6 caracteres' })

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const user = await prisma.user.findFirst({
      where: {
        email,
        passwordResetToken: tokenHash,
        passwordResetExpiresAt: { gt: new Date() },
      },
    })

    if (!user) return res.status(400).json({ error: 'Token inválido ou expirado' })

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await hashPassword(password),
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      },
    })

    return res.json({ message: 'Senha alterada com sucesso. Você já pode fazer login.' })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao redefinir senha' })
  }
}

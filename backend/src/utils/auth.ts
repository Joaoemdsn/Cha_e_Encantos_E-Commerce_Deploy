import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

export const generateToken = (userId: string, email: string) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  })
}

export const hashPassword = async (password: string) => {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

export const comparePassword = async (password: string, hashedPassword: string) => {
  return bcryptjs.compare(password, hashedPassword)
}

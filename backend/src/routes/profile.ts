import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getMyProfile } from '../controllers/profile.js'

const router = Router()

router.get('/me', authMiddleware, getMyProfile)

export default router

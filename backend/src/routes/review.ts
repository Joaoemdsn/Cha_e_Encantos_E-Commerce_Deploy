import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { createActivityReview, createProductReview } from '../controllers/review.js'

const router = Router()

router.post('/products/:productId', authMiddleware, createProductReview)
router.post('/activities/:activityId', authMiddleware, createActivityReview)

export default router

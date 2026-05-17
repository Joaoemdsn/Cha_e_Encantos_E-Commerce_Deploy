import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { createSubscriptionCheckout, getMySubscriptions, getSubscriptionPlans } from '../controllers/subscription.js'

const router = Router()

router.get('/plans', getSubscriptionPlans)
router.get('/my', authMiddleware, getMySubscriptions)
router.post('/checkout', authMiddleware, createSubscriptionCheckout)

export default router

import { Router } from 'express'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'
import { createSubscriptionPlan, getAdminBookings, getAdminOrders, getAdminOverview, getAdminSubscriptions, updateAdminOrderStatus } from '../controllers/admin.js'

const router = Router()

router.use(authMiddleware, adminMiddleware)
router.get('/overview', getAdminOverview)
router.get('/orders', getAdminOrders)
router.patch('/orders/:id/status', updateAdminOrderStatus)
router.get('/bookings', getAdminBookings)
router.get('/subscriptions', getAdminSubscriptions)
router.post('/subscription-plans', createSubscriptionPlan)

export default router

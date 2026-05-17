import { Router } from 'express'
import { getAllOrders, getCheckoutSession, getOrderById, createOrder, checkoutOrder } from '../controllers/order.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/', authMiddleware, getAllOrders)
router.post('/checkout', authMiddleware, checkoutOrder)
router.get('/checkout/session/:sessionId', authMiddleware, getCheckoutSession)
router.get('/:id', authMiddleware, getOrderById)
router.post('/', authMiddleware, createOrder)

export default router

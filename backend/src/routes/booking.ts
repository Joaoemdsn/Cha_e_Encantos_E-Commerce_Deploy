import { Router } from 'express'
import { createBooking, getMyBookings } from '../controllers/booking.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/', authMiddleware, getMyBookings)
router.post('/', authMiddleware, createBooking)

export default router

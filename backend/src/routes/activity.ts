import { Router } from 'express'
import { getAllActivities, getActivityById, createActivity, updateActivity, createActivitySlot } from '../controllers/activity.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/', getAllActivities)
router.get('/:id', getActivityById)
router.post('/', authMiddleware, adminMiddleware, createActivity)
router.put('/:id', authMiddleware, adminMiddleware, updateActivity)
router.post('/:id/slots', authMiddleware, adminMiddleware, createActivitySlot)

export default router

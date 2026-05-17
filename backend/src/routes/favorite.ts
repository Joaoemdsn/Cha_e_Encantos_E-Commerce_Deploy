import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.js'
import { getMyFavorites, removeFavorite, toggleFavorite } from '../controllers/favorite.js'

const router = Router()

router.get('/', authMiddleware, getMyFavorites)
router.post('/toggle', authMiddleware, toggleFavorite)
router.delete('/:productId', authMiddleware, removeFavorite)

export default router

import express from 'express'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'
import productRoutes from './routes/product.js'
import activityRoutes from './routes/activity.js'
import orderRoutes from './routes/order.js'
import bookingRoutes from './routes/booking.js'
import favoriteRoutes from './routes/favorite.js'
import profileRoutes from './routes/profile.js'
import reviewRoutes from './routes/review.js'
import subscriptionRoutes from './routes/subscription.js'
import adminRoutes from './routes/admin.js'
import { handleStripeWebhook } from './controllers/stripeWebhook.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS global — precisa vir antes de qualquer rota
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

// Webhook da Stripe precisa vir antes do express.json()
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
)

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend Chá e Encantos online com CORS liberado',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/admin', adminRoutes)

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err)

    res.status(err.status || 500).json({
      error: err.message || 'Erro interno do servidor',
    })
  }
)

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
import express from 'express'
import cors from 'cors'
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

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  process.env.PUBLIC_APP_URL,
]
  .filter(Boolean)
  .flatMap((origin) => String(origin).split(','))
  .map((origin) => origin.trim())

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      if (origin.endsWith('.vercel.app')) {
        return callback(null, true)
      }

      return callback(new Error(`Origem não permitida pelo CORS: ${origin}`))
    },
    credentials: true,
  })
)

// Webhook da Stripe precisa vir ANTES do express.json()
app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook
)

app.use(express.json())

// Routes
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    allowedOrigins,
  })
})

// Error handling
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
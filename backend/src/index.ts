import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import coinsRoutes from './api/routes/coinsRoutes'
import transactionsRoutes from './api/routes/transactionsRoutes'
import { logger } from './utils/logger'

// Load environment variables
dotenv.config()

// Create Express server
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }))

// Routes
app.use('/api', coinsRoutes)
app.use('/api', transactionsRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`)
})

export default app

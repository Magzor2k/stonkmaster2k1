import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import marketDataRouter from './routes/market-data'
import tradingRouter from './routes/trading'
import indicatorsRouter from './routes/indicators'
import authRouter from './routes/auth'
import { initializeWebSocket } from './websocket'
import { RedisService } from './services/redis'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 8000
const WS_PORT = process.env.WS_PORT || 8001

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRouter)
app.use('/api/market-data', marketDataRouter)
app.use('/api/trading', tradingRouter)
app.use('/api/indicators', indicatorsRouter)

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

async function startServer() {
  try {
    try {
      await RedisService.getInstance().connect()
      console.log('Connected to Redis')
    } catch (error) {
      console.log('Redis not available, continuing without cache')
    }

    initializeWebSocket(io)
    console.log('WebSocket initialized')

    const wsServer = httpServer.listen(WS_PORT, () => {
      console.log(`WebSocket server running on port ${WS_PORT}`)
    })

    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })

    process.on('SIGINT', () => {
      console.log('Shutting down servers...')
      wsServer.close()
      process.exit(0)
    })

  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()
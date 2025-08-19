import { Server } from 'socket.io'
import { MarketDataService } from '../services/market-data'
import { RedisService } from '../services/redis'

export function initializeWebSocket(io: Server) {
  const marketDataService = new MarketDataService()
  const redis = RedisService.getInstance()

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    socket.on('subscribe:market-data', async (symbols: string[]) => {
      console.log(`Client ${socket.id} subscribing to:`, symbols)
      
      try {
        for (const symbol of symbols) {
          await socket.join(`market-data:${symbol}`)
          
          const cachedData = await redis.get(`quote:${symbol}`)
          if (cachedData) {
            socket.emit('market-data:update', {
              symbol,
              data: JSON.parse(cachedData)
            })
          }
        }

        await marketDataService.subscribe(symbols, (data) => {
          redis.setex(`quote:${data.symbol}`, 60, JSON.stringify(data))
          io.to(`market-data:${data.symbol}`).emit('market-data:update', {
            symbol: data.symbol,
            data
          })
        })

      } catch (error) {
        console.error('Subscription error:', error)
        socket.emit('error', { message: 'Failed to subscribe to market data' })
      }
    })

    socket.on('unsubscribe:market-data', async (symbols: string[]) => {
      console.log(`Client ${socket.id} unsubscribing from:`, symbols)
      
      for (const symbol of symbols) {
        await socket.leave(`market-data:${symbol}`)
      }
    })

    socket.on('subscribe:indicators', async (data: { symbol: string, indicators: string[] }) => {
      await socket.join(`indicators:${data.symbol}`)
      console.log(`Client ${socket.id} subscribed to indicators for ${data.symbol}`)
    })

    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected: ${socket.id}, reason: ${reason}`)
    })

    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error)
    })
  })

  return io
}
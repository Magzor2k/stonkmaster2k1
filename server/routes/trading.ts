import { Router } from 'express'
import { Decimal } from 'decimal.js'

const router = Router()

interface Order {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  type: 'market' | 'limit' | 'stop'
  quantity: number
  price?: number
  status: 'pending' | 'filled' | 'cancelled' | 'rejected'
  timestamp: Date
}

const mockOrders: Order[] = []

router.post('/orders', async (req, res) => {
  try {
    const { symbol, side, type, quantity, price } = req.body

    if (!symbol || !side || !type || !quantity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      })
    }

    const order: Order = {
      id: `order_${Date.now()}`,
      symbol: symbol.toUpperCase(),
      side,
      type,
      quantity: parseInt(quantity),
      price: price ? parseFloat(price) : undefined,
      status: 'pending',
      timestamp: new Date()
    }

    mockOrders.push(order)

    setTimeout(() => {
      const orderIndex = mockOrders.findIndex(o => o.id === order.id)
      if (orderIndex !== -1) {
        mockOrders[orderIndex].status = 'filled'
      }
    }, 2000)

    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Error placing order:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to place order'
    })
  }
})

router.get('/orders', async (req, res) => {
  try {
    const { status, symbol } = req.query

    let filteredOrders = mockOrders

    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status)
    }

    if (symbol) {
      filteredOrders = filteredOrders.filter(order => 
        order.symbol === (symbol as string).toUpperCase()
      )
    }

    res.json({
      success: true,
      data: filteredOrders.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    })
  }
})

router.delete('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params

    const orderIndex = mockOrders.findIndex(order => order.id === orderId)
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      })
    }

    const order = mockOrders[orderIndex]
    
    if (order.status === 'filled') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel filled order'
      })
    }

    mockOrders[orderIndex].status = 'cancelled'

    res.json({
      success: true,
      data: { message: 'Order cancelled successfully' }
    })
  } catch (error) {
    console.error('Error cancelling order:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order'
    })
  }
})

router.get('/positions', async (req, res) => {
  try {
    const positions = [
      {
        symbol: 'AAPL',
        quantity: 100,
        averagePrice: new Decimal(172.50),
        currentPrice: new Decimal(175.43),
        unrealizedPL: new Decimal(293.00),
        realizedPL: new Decimal(0)
      },
      {
        symbol: 'MSFT',
        quantity: 50,
        averagePrice: new Decimal(380.25),
        currentPrice: new Decimal(378.92),
        unrealizedPL: new Decimal(-66.50),
        realizedPL: new Decimal(0)
      },
      {
        symbol: 'TSLA',
        quantity: 25,
        averagePrice: new Decimal(255.00),
        currentPrice: new Decimal(248.15),
        unrealizedPL: new Decimal(-171.25),
        realizedPL: new Decimal(0)
      }
    ]

    res.json({
      success: true,
      data: positions.map(pos => ({
        ...pos,
        averagePrice: pos.averagePrice.toString(),
        currentPrice: pos.currentPrice.toString(),
        unrealizedPL: pos.unrealizedPL.toString(),
        realizedPL: pos.realizedPL.toString(),
        marketValue: pos.currentPrice.mul(pos.quantity).toString()
      }))
    })
  } catch (error) {
    console.error('Error fetching positions:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch positions'
    })
  }
})

router.get('/portfolio', async (req, res) => {
  try {
    const portfolio = {
      totalValue: new Decimal(125420.69),
      cashBalance: new Decimal(45230.50),
      dayPL: new Decimal(1256.75),
      totalPL: new Decimal(8420.69),
      positions: 3
    }

    res.json({
      success: true,
      data: {
        totalValue: portfolio.totalValue.toString(),
        cashBalance: portfolio.cashBalance.toString(),
        dayPL: portfolio.dayPL.toString(),
        totalPL: portfolio.totalPL.toString(),
        positions: portfolio.positions
      }
    })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio'
    })
  }
})

export default router
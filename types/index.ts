import { Decimal } from 'decimal.js'

export interface StockQuote {
  symbol: string
  price: Decimal
  change: Decimal
  changePercent: Decimal
  volume: number
  timestamp: Date
}

export interface ChartData {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Position {
  symbol: string
  quantity: number
  averagePrice: Decimal
  currentPrice: Decimal
  unrealizedPL: Decimal
  realizedPL: Decimal
}

export interface Order {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  type: 'market' | 'limit' | 'stop'
  quantity: number
  price?: Decimal
  status: 'pending' | 'filled' | 'cancelled' | 'rejected'
  timestamp: Date
}

export interface TechnicalIndicator {
  name: string
  value: number
  signal: 'buy' | 'sell' | 'hold'
  timestamp: Date
}

export interface Portfolio {
  totalValue: Decimal
  cashBalance: Decimal
  positions: Position[]
  dayPL: Decimal
  totalPL: Decimal
}
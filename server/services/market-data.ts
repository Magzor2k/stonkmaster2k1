import Alpaca from '@alpacahq/alpaca-trade-api'
import { Decimal } from 'decimal.js'

export interface MarketDataQuote {
  symbol: string
  price: Decimal
  change: Decimal
  changePercent: Decimal
  volume: number
  timestamp: Date
  bid: Decimal
  ask: Decimal
  bidSize: number
  askSize: number
}

export interface MarketDataBar {
  symbol: string
  timestamp: Date
  open: Decimal
  high: Decimal
  low: Decimal
  close: Decimal
  volume: number
}

export class MarketDataService {
  private alpaca: Alpaca | null = null
  private subscriptions: Set<string> = new Set()
  private callbacks: Map<string, (data: MarketDataQuote | MarketDataBar) => void> = new Map()

  constructor() {
    const apiKey = process.env.ALPACA_API_KEY || ''
    const apiSecret = process.env.ALPACA_API_SECRET || ''
    const paper = process.env.ALPACA_PAPER === 'true'

    if (apiKey && apiSecret) {
      this.alpaca = new Alpaca({
        credentials: {
          key: apiKey,
          secret: apiSecret,
          paper: paper
        }
      })
    } else {
      console.warn('Alpaca API credentials not found. Using mock data.')
    }
  }

  public async getQuote(symbol: string): Promise<MarketDataQuote> {
    if (!this.alpaca) {
      return this.getMockQuote(symbol)
    }

    try {
      const quote = await this.alpaca.getLatestQuote(symbol)
      
      return {
        symbol,
        price: new Decimal(quote.askprice || quote.bidprice || 100),
        change: new Decimal(0),
        changePercent: new Decimal(0),
        volume: 0,
        timestamp: new Date(quote.timestamp),
        bid: new Decimal(quote.bidprice || 0),
        ask: new Decimal(quote.askprice || 0),
        bidSize: quote.bidsize || 0,
        askSize: quote.asksize || 0
      }
    } catch (error) {
      console.error(`Failed to fetch quote for ${symbol}:`, error)
      return this.getMockQuote(symbol)
    }
  }

  public async getBars(
    symbol: string,
    timeframe: '1Min' | '5Min' | '15Min' | '1Hour' | '1Day' = '1Day',
    start?: Date,
    end?: Date,
    limit: number = 100
  ): Promise<MarketDataBar[]> {
    if (!this.alpaca) {
      return this.getMockBars(symbol, limit)
    }

    try {
      const options: any = {
        limit,
        adjustment: 'raw',
        feed: 'iex'
      }

      if (start) options.start = start
      if (end) options.end = end

      const bars = await this.alpaca.getBarsV2(symbol, {
        timeframe,
        ...options
      })

      return bars.map((bar: any) => ({
        symbol,
        timestamp: new Date(bar.Timestamp),
        open: new Decimal(bar.OpenPrice),
        high: new Decimal(bar.HighPrice),
        low: new Decimal(bar.LowPrice),
        close: new Decimal(bar.ClosePrice),
        volume: bar.Volume
      }))
    } catch (error) {
      console.error(`Failed to fetch bars for ${symbol}:`, error)
      return this.getMockBars(symbol, limit)
    }
  }

  public async subscribe(
    symbols: string[], 
    callback: (data: MarketDataQuote | MarketDataBar) => void
  ): Promise<void> {
    symbols.forEach(symbol => {
      this.subscriptions.add(symbol)
      this.callbacks.set(symbol, callback)
    })

    if (!this.alpaca) {
      this.startMockStream(symbols, callback)
      return
    }

    try {
      const dataStream = this.alpaca.data_stream_v2

      dataStream.onConnect(() => {
        console.log('Connected to Alpaca data stream')
        dataStream.subscribeForQuotes(symbols)
        dataStream.subscribeForBars(symbols)
      })

      dataStream.onQuote((subject: string, data: any) => {
        const callback = this.callbacks.get(subject)
        if (callback) {
          const quote: MarketDataQuote = {
            symbol: subject,
            price: new Decimal(data.askprice || data.bidprice || 0),
            change: new Decimal(0),
            changePercent: new Decimal(0),
            volume: 0,
            timestamp: new Date(data.timestamp),
            bid: new Decimal(data.bidprice || 0),
            ask: new Decimal(data.askprice || 0),
            bidSize: data.bidsize || 0,
            askSize: data.asksize || 0
          }
          callback(quote)
        }
      })

      dataStream.onBar((subject: string, data: any) => {
        const callback = this.callbacks.get(subject)
        if (callback) {
          const bar: MarketDataBar = {
            symbol: subject,
            timestamp: new Date(data.timestamp),
            open: new Decimal(data.openprice),
            high: new Decimal(data.highprice),
            low: new Decimal(data.lowprice),
            close: new Decimal(data.closeprice),
            volume: data.volume
          }
          callback(bar)
        }
      })

      dataStream.connect()

    } catch (error) {
      console.error('Error setting up Alpaca stream:', error)
      this.startMockStream(symbols, callback)
    }
  }


  private getMockQuote(symbol: string): MarketDataQuote {
    const basePrice = 150 + Math.random() * 50
    const change = (Math.random() - 0.5) * 10
    
    return {
      symbol,
      price: new Decimal(basePrice.toFixed(2)),
      change: new Decimal(change.toFixed(2)),
      changePercent: new Decimal((change / basePrice * 100).toFixed(2)),
      volume: Math.floor(Math.random() * 1000000),
      timestamp: new Date(),
      bid: new Decimal((basePrice - 0.01).toFixed(2)),
      ask: new Decimal((basePrice + 0.01).toFixed(2)),
      bidSize: Math.floor(Math.random() * 1000),
      askSize: Math.floor(Math.random() * 1000)
    }
  }

  private getMockBars(symbol: string, count: number): MarketDataBar[] {
    const bars: MarketDataBar[] = []
    let price = 150 + Math.random() * 50

    for (let i = count - 1; i >= 0; i--) {
      const open = new Decimal(price.toFixed(2))
      const change = (Math.random() - 0.5) * 5
      const close = new Decimal((price + change).toFixed(2))
      const high = new Decimal(Math.max(price, price + change, price + Math.random() * 3).toFixed(2))
      const low = new Decimal(Math.min(price, price + change, price - Math.random() * 3).toFixed(2))

      bars.push({
        symbol,
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000000)
      })

      price += change
    }

    return bars.reverse()
  }

  private startMockStream(symbols: string[], callback: (data: MarketDataQuote) => void): void {
    symbols.forEach(symbol => {
      setInterval(() => {
        const quote = this.getMockQuote(symbol)
        callback(quote)
      }, 1000 + Math.random() * 2000)
    })
  }

  public disconnect(): void {
    if (this.alpaca && this.alpaca.data_stream_v2) {
      this.alpaca.data_stream_v2.disconnect()
    }
    this.subscriptions.clear()
    this.callbacks.clear()
  }
}
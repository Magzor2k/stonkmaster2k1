import { Router } from 'express'
import { MarketDataService } from '../services/market-data'

const router = Router()
const marketDataService = new MarketDataService()

router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params
    const quote = await marketDataService.getQuote(symbol.toUpperCase())
    
    res.json({
      success: true,
      data: {
        symbol: quote.symbol,
        price: quote.price.toString(),
        change: quote.change.toString(),
        changePercent: quote.changePercent.toString(),
        volume: quote.volume,
        timestamp: quote.timestamp,
        bid: quote.bid.toString(),
        ask: quote.ask.toString(),
        bidSize: quote.bidSize,
        askSize: quote.askSize
      }
    })
  } catch (error) {
    console.error('Error fetching quote:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quote'
    })
  }
})

router.get('/bars/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params
    const { 
      timeframe = '1Day',
      start,
      end,
      limit = '100'
    } = req.query

    const startDate = start ? new Date(start as string) : undefined
    const endDate = end ? new Date(end as string) : undefined

    const bars = await marketDataService.getBars(
      symbol.toUpperCase(),
      timeframe as '1Min' | '5Min' | '15Min' | '1Hour' | '1Day',
      startDate,
      endDate,
      parseInt(limit as string)
    )

    res.json({
      success: true,
      data: bars.map(bar => ({
        symbol: bar.symbol,
        timestamp: bar.timestamp,
        open: bar.open.toString(),
        high: bar.high.toString(),
        low: bar.low.toString(),
        close: bar.close.toString(),
        volume: bar.volume
      }))
    })
  } catch (error) {
    console.error('Error fetching bars:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bars'
    })
  }
})

router.get('/watchlist', async (req, res) => {
  try {
    const defaultSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'SPY']
    const quotes = await Promise.all(
      defaultSymbols.map(symbol => marketDataService.getQuote(symbol))
    )

    res.json({
      success: true,
      data: quotes.map(quote => ({
        symbol: quote.symbol,
        price: quote.price.toString(),
        change: quote.change.toString(),
        changePercent: quote.changePercent.toString(),
        volume: quote.volume
      }))
    })
  } catch (error) {
    console.error('Error fetching watchlist:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch watchlist'
    })
  }
})

export default router
import { Router } from 'express'
import { IndicatorService } from '../services/indicators'
import { MarketDataService } from '../services/market-data'

const router = Router()
const indicatorService = new IndicatorService()
const marketDataService = new MarketDataService()

router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params
    const { period = '1Day', limit = '50' } = req.query

    const upperSymbol = symbol.toUpperCase()
    
    indicatorService.initializeIndicators(upperSymbol)
    
    const bars = await marketDataService.getBars(
      upperSymbol,
      period as any,
      undefined,
      undefined,
      parseInt(limit as string)
    )

    const results: any[] = []

    for (const bar of bars) {
      const indicatorResults = indicatorService.updateIndicators(upperSymbol, {
        open: Number(bar.open),
        high: Number(bar.high),
        low: Number(bar.low),
        close: Number(bar.close),
        volume: bar.volume,
        timestamp: bar.timestamp
      })

      if (indicatorResults.length > 0) {
        results.push({
          timestamp: bar.timestamp,
          indicators: indicatorResults
        })
      }
    }

    res.json({
      success: true,
      data: {
        symbol: upperSymbol,
        period,
        results: results.slice(-20)
      }
    })

  } catch (error) {
    console.error('Error calculating indicators:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to calculate indicators'
    })
  }
})

router.get('/:symbol/current', async (req, res) => {
  try {
    const { symbol } = req.params
    const upperSymbol = symbol.toUpperCase()
    
    const values = indicatorService.getIndicatorValues(upperSymbol)

    res.json({
      success: true,
      data: {
        symbol: upperSymbol,
        timestamp: new Date(),
        indicators: values
      }
    })

  } catch (error) {
    console.error('Error getting current indicators:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get current indicators'
    })
  }
})

router.post('/:symbol/signals', async (req, res) => {
  try {
    const { symbol } = req.params
    const { indicators = ['RSI_14', 'MACD', 'SMA_20'] } = req.body

    const upperSymbol = symbol.toUpperCase()
    
    const quote = await marketDataService.getQuote(upperSymbol)
    const bars = await marketDataService.getBars(upperSymbol, '1Day', undefined, undefined, 20)

    if (bars.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No data available for analysis'
      })
    }

    indicatorService.initializeIndicators(upperSymbol)

    let signals: any[] = []

    for (const bar of bars) {
      const indicatorResults = indicatorService.updateIndicators(upperSymbol, {
        open: Number(bar.open),
        high: Number(bar.high),
        low: Number(bar.low),
        close: Number(bar.close),
        volume: bar.volume,
        timestamp: bar.timestamp
      })

      signals = indicatorResults.filter(result => 
        indicators.includes(result.name) && result.signal !== 'hold'
      )
    }

    const overallSignal = this.calculateOverallSignal(signals)

    res.json({
      success: true,
      data: {
        symbol: upperSymbol,
        timestamp: new Date(),
        currentPrice: quote.price.toString(),
        signals,
        overallSignal,
        confidence: this.calculateConfidence(signals)
      }
    })

  } catch (error) {
    console.error('Error generating signals:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate signals'
    })
  }
})

function calculateOverallSignal(signals: any[]): 'buy' | 'sell' | 'hold' {
  if (signals.length === 0) return 'hold'

  const buySignals = signals.filter(s => s.signal === 'buy').length
  const sellSignals = signals.filter(s => s.signal === 'sell').length

  if (buySignals > sellSignals) return 'buy'
  if (sellSignals > buySignals) return 'sell'
  return 'hold'
}

function calculateConfidence(signals: any[]): number {
  if (signals.length === 0) return 0

  const buySignals = signals.filter(s => s.signal === 'buy').length
  const sellSignals = signals.filter(s => s.signal === 'sell').length
  const totalSignals = signals.length

  const dominantSignals = Math.max(buySignals, sellSignals)
  return Math.round((dominantSignals / totalSignals) * 100)
}

export default router
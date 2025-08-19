import { 
  SMA, 
  EMA, 
  RSI, 
  MACD, 
  BollingerBands,
  Stochastic,
  WilliamsR
} from 'trading-signals'
import { Decimal } from 'decimal.js'

export interface IndicatorResult {
  name: string
  value: number | { [key: string]: number }
  signal: 'buy' | 'sell' | 'hold'
  timestamp: Date
}

export interface PriceData {
  open: number
  high: number
  low: number
  close: number
  volume: number
  timestamp: Date
}

export class IndicatorService {
  private indicators: Map<string, any> = new Map()

  public initializeIndicators(symbol: string): void {
    const prefix = `${symbol}:`
    
    this.indicators.set(`${prefix}SMA_20`, new SMA(20))
    this.indicators.set(`${prefix}SMA_50`, new SMA(50))
    this.indicators.set(`${prefix}EMA_12`, new EMA(12))
    this.indicators.set(`${prefix}EMA_26`, new EMA(26))
    this.indicators.set(`${prefix}RSI_14`, new RSI(14))
    this.indicators.set(`${prefix}MACD`, new MACD({ 
      shortInterval: 12, 
      longInterval: 26, 
      signalInterval: 9 
    }))
    this.indicators.set(`${prefix}BB_20`, new BollingerBands(20, 2))
    this.indicators.set(`${prefix}STOCH_14`, new Stochastic(14, 3, 3))
    this.indicators.set(`${prefix}WILLIAMS_R_14`, new WilliamsR(14))
  }

  public updateIndicators(symbol: string, data: PriceData): IndicatorResult[] {
    const prefix = `${symbol}:`
    const results: IndicatorResult[] = []

    try {
      const sma20 = this.indicators.get(`${prefix}SMA_20`)
      if (sma20) {
        sma20.update(data.close)
        if (sma20.isStable) {
          results.push({
            name: 'SMA_20',
            value: Number(sma20.getResult().toFixed(2)),
            signal: this.getSMASignal(data.close, sma20.getResult()),
            timestamp: data.timestamp
          })
        }
      }

      const sma50 = this.indicators.get(`${prefix}SMA_50`)
      if (sma50) {
        sma50.update(data.close)
        if (sma50.isStable) {
          results.push({
            name: 'SMA_50',
            value: Number(sma50.getResult().toFixed(2)),
            signal: this.getSMASignal(data.close, sma50.getResult()),
            timestamp: data.timestamp
          })
        }
      }

      const ema12 = this.indicators.get(`${prefix}EMA_12`)
      if (ema12) {
        ema12.update(data.close)
        if (ema12.isStable) {
          results.push({
            name: 'EMA_12',
            value: Number(ema12.getResult().toFixed(2)),
            signal: this.getEMASignal(data.close, ema12.getResult()),
            timestamp: data.timestamp
          })
        }
      }

      const rsi = this.indicators.get(`${prefix}RSI_14`)
      if (rsi) {
        rsi.update(data.close)
        if (rsi.isStable) {
          const rsiValue = rsi.getResult()
          results.push({
            name: 'RSI_14',
            value: Number(rsiValue.toFixed(2)),
            signal: this.getRSISignal(rsiValue),
            timestamp: data.timestamp
          })
        }
      }

      const macd = this.indicators.get(`${prefix}MACD`)
      if (macd) {
        macd.update(data.close)
        if (macd.isStable) {
          const macdResult = macd.getResult()
          results.push({
            name: 'MACD',
            value: {
              macd: Number(macdResult.macd.toFixed(4)),
              signal: Number(macdResult.signal.toFixed(4)),
              histogram: Number(macdResult.histogram.toFixed(4))
            },
            signal: this.getMACDSignal(macdResult.macd, macdResult.signal, macdResult.histogram),
            timestamp: data.timestamp
          })
        }
      }

      const bb = this.indicators.get(`${prefix}BB_20`)
      if (bb) {
        bb.update(data.close)
        if (bb.isStable) {
          const bbResult = bb.getResult()
          results.push({
            name: 'BOLLINGER_BANDS',
            value: {
              upper: Number(bbResult.upper.toFixed(2)),
              middle: Number(bbResult.middle.toFixed(2)),
              lower: Number(bbResult.lower.toFixed(2))
            },
            signal: this.getBollingerSignal(data.close, bbResult),
            timestamp: data.timestamp
          })
        }
      }

      const stoch = this.indicators.get(`${prefix}STOCH_14`)
      if (stoch) {
        stoch.update({ high: data.high, low: data.low, close: data.close })
        if (stoch.isStable) {
          const stochResult = stoch.getResult()
          results.push({
            name: 'STOCHASTIC',
            value: {
              k: Number(stochResult.stochK.toFixed(2)),
              d: Number(stochResult.stochD.toFixed(2))
            },
            signal: this.getStochasticSignal(stochResult.stochK, stochResult.stochD),
            timestamp: data.timestamp
          })
        }
      }

      const williamsR = this.indicators.get(`${prefix}WILLIAMS_R_14`)
      if (williamsR) {
        williamsR.update({ high: data.high, low: data.low, close: data.close })
        if (williamsR.isStable) {
          const wrValue = williamsR.getResult()
          results.push({
            name: 'WILLIAMS_R',
            value: Number(wrValue.toFixed(2)),
            signal: this.getWilliamsRSignal(wrValue),
            timestamp: data.timestamp
          })
        }
      }

    } catch (error) {
      console.error('Error updating indicators:', error)
    }

    return results
  }

  public getIndicatorValues(symbol: string): { [key: string]: any } {
    const prefix = `${symbol}:`
    const values: { [key: string]: any } = {}

    for (const [key, indicator] of this.indicators.entries()) {
      if (key.startsWith(prefix) && indicator.isStable) {
        const name = key.replace(prefix, '')
        try {
          values[name] = indicator.getResult()
        } catch (error) {
          console.error(`Error getting value for ${name}:`, error)
        }
      }
    }

    return values
  }

  private getSMASignal(price: number, sma: number): 'buy' | 'sell' | 'hold' {
    if (price > sma * 1.02) return 'buy'
    if (price < sma * 0.98) return 'sell'
    return 'hold'
  }

  private getEMASignal(price: number, ema: number): 'buy' | 'sell' | 'hold' {
    if (price > ema * 1.01) return 'buy'
    if (price < ema * 0.99) return 'sell'
    return 'hold'
  }

  private getRSISignal(rsi: number): 'buy' | 'sell' | 'hold' {
    if (rsi < 30) return 'buy'
    if (rsi > 70) return 'sell'
    return 'hold'
  }

  private getMACDSignal(macd: number, signal: number, histogram: number): 'buy' | 'sell' | 'hold' {
    if (macd > signal && histogram > 0) return 'buy'
    if (macd < signal && histogram < 0) return 'sell'
    return 'hold'
  }

  private getBollingerSignal(price: number, bb: any): 'buy' | 'sell' | 'hold' {
    if (price <= bb.lower) return 'buy'
    if (price >= bb.upper) return 'sell'
    return 'hold'
  }

  private getStochasticSignal(k: number, d: number): 'buy' | 'sell' | 'hold' {
    if (k < 20 && d < 20 && k > d) return 'buy'
    if (k > 80 && d > 80 && k < d) return 'sell'
    return 'hold'
  }

  private getWilliamsRSignal(wr: number): 'buy' | 'sell' | 'hold' {
    if (wr < -80) return 'buy'
    if (wr > -20) return 'sell'
    return 'hold'
  }

  public clearIndicators(symbol: string): void {
    const prefix = `${symbol}:`
    for (const key of this.indicators.keys()) {
      if (key.startsWith(prefix)) {
        this.indicators.delete(key)
      }
    }
  }
}
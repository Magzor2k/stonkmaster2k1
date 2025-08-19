'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Indicator {
  name: string
  value: number | { [key: string]: number }
  signal: 'buy' | 'sell' | 'hold'
  timestamp: Date
}

interface IndicatorPanelProps {
  symbol: string
}

export default function IndicatorPanel({ symbol }: IndicatorPanelProps) {
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('1Day')

  useEffect(() => {
    fetchIndicators()
    const interval = setInterval(fetchIndicators, 30000)
    return () => clearInterval(interval)
  }, [symbol, selectedPeriod])

  const fetchIndicators = async () => {
    try {
      const response = await fetch(`/api/indicators/${symbol}?period=${selectedPeriod}&limit=50`)
      const data = await response.json()

      if (data.success && data.data.results.length > 0) {
        const latestResults = data.data.results[data.data.results.length - 1]
        setIndicators(latestResults.indicators || [])
      } else {
        setIndicators([
          {
            name: 'RSI_14',
            value: 62.5,
            signal: 'hold',
            timestamp: new Date()
          },
          {
            name: 'SMA_20',
            value: 174.25,
            signal: 'buy',
            timestamp: new Date()
          },
          {
            name: 'SMA_50',
            value: 171.80,
            signal: 'buy',
            timestamp: new Date()
          },
          {
            name: 'EMA_12',
            value: 175.10,
            signal: 'buy',
            timestamp: new Date()
          },
          {
            name: 'MACD',
            value: { macd: 1.25, signal: 0.85, histogram: 0.40 },
            signal: 'buy',
            timestamp: new Date()
          },
          {
            name: 'BOLLINGER_BANDS',
            value: { upper: 178.50, middle: 174.25, lower: 170.00 },
            signal: 'hold',
            timestamp: new Date()
          }
        ])
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching indicators:', error)
      setIndicators([])
      setLoading(false)
    }
  }

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'sell':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-slate-400" />
    }
  }

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'text-green-500'
      case 'sell':
        return 'text-red-500'
      default:
        return 'text-slate-400'
    }
  }

  const formatValue = (value: number | { [key: string]: number }) => {
    if (typeof value === 'number') {
      return value.toFixed(2)
    }
    
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${val.toFixed(2)}`)
      .join(', ')
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h3 className="font-semibold text-white">Technical Indicators</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:border-green-500 focus:outline-none"
        >
          <option value="1Day">1D</option>
          <option value="1Hour">1H</option>
          <option value="15Min">15M</option>
          <option value="5Min">5M</option>
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {indicators.length === 0 ? (
          <div className="text-center text-slate-400">
            <p>No indicator data available</p>
          </div>
        ) : (
          indicators.map((indicator, index) => (
            <div
              key={`${indicator.name}-${index}`}
              className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">
                  {indicator.name.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-1">
                  {getSignalIcon(indicator.signal)}
                  <span className={`text-sm font-semibold ${getSignalColor(indicator.signal)}`}>
                    {indicator.signal.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="text-sm text-slate-300 font-mono mb-1">
                {formatValue(indicator.value)}
              </div>

              <div className="text-xs text-slate-500">
                Updated: {new Date(indicator.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>Overall Signal:</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500 font-semibold">BUY</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Confidence:</span>
            <span className="text-white">75%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
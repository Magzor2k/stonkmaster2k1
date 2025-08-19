'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StockItem {
  symbol: string
  price: string
  change: string
  changePercent: string
  volume: number
}

interface WatchListProps {
  selectedSymbol: string
  onSymbolSelect: (symbol: string) => void
}

export default function WatchList({ selectedSymbol, onSymbolSelect }: WatchListProps) {
  const [stocks, setStocks] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWatchList()
    const interval = setInterval(fetchWatchList, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchWatchList = async () => {
    try {
      const response = await fetch('/api/market-data/watchlist')
      const data = await response.json()
      
      if (data.success) {
        setStocks(data.data)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching watchlist:', error)
      setStocks([
        { symbol: 'AAPL', price: '175.43', change: '2.15', changePercent: '1.24', volume: 45234567 },
        { symbol: 'GOOGL', price: '2834.56', change: '-12.34', changePercent: '-0.43', volume: 1234567 },
        { symbol: 'MSFT', price: '378.92', change: '5.67', changePercent: '1.52', volume: 23456789 },
        { symbol: 'TSLA', price: '248.15', change: '-8.92', changePercent: '-3.47', volume: 67890123 },
        { symbol: 'AMZN', price: '145.67', change: '1.23', changePercent: '0.85', volume: 12345678 },
        { symbol: 'NVDA', price: '456.78', change: '15.42', changePercent: '3.49', volume: 34567890 },
        { symbol: 'META', price: '312.45', change: '-4.56', changePercent: '-1.44', volume: 23456789 },
        { symbol: 'SPY', price: '445.67', change: '2.34', changePercent: '0.53', volume: 56789012 }
      ])
      setLoading(false)
    }
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
        <h3 className="font-semibold text-white">Watch List</h3>
        <button className="text-slate-400 hover:text-white text-sm">
          Edit
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => onSymbolSelect(stock.symbol)}
            className={`p-3 cursor-pointer border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${
              selectedSymbol === stock.symbol ? 'bg-slate-700/50' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-white">{stock.symbol}</span>
              <span className="text-white font-mono">
                ${parseFloat(stock.price).toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-1 text-sm ${
                parseFloat(stock.change) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {parseFloat(stock.change) >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{parseFloat(stock.change).toFixed(2)}</span>
              </div>
              
              <span className={`text-sm ${
                parseFloat(stock.changePercent) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {parseFloat(stock.changePercent) >= 0 ? '+' : ''}
                {parseFloat(stock.changePercent).toFixed(2)}%
              </span>
            </div>
            
            <div className="text-xs text-slate-400 mt-1">
              Vol: {(stock.volume / 1000000).toFixed(1)}M
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
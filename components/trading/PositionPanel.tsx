'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Position {
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
  unrealizedPL: number
  unrealizedPLPercent: number
}

export default function PositionPanel() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPositions()
    const interval = setInterval(fetchPositions, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchPositions = async () => {
    try {
      setPositions([
        {
          symbol: 'AAPL',
          quantity: 100,
          averagePrice: 172.50,
          currentPrice: 175.43,
          unrealizedPL: 293.00,
          unrealizedPLPercent: 1.70
        },
        {
          symbol: 'MSFT',
          quantity: 50,
          averagePrice: 380.25,
          currentPrice: 378.92,
          unrealizedPL: -66.50,
          unrealizedPLPercent: -0.35
        },
        {
          symbol: 'TSLA',
          quantity: 25,
          averagePrice: 255.00,
          currentPrice: 248.15,
          unrealizedPL: -171.25,
          unrealizedPLPercent: -2.69
        }
      ])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching positions:', error)
      setLoading(false)
    }
  }

  const totalPL = positions.reduce((sum, pos) => sum + pos.unrealizedPL, 0)

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-semibold text-white">Positions</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-slate-400">Total P&L</span>
          <span className={`font-mono font-semibold ${
            totalPL >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {positions.length === 0 ? (
          <div className="p-4 text-center text-slate-400">
            <p>No open positions</p>
          </div>
        ) : (
          positions.map((position) => (
            <div
              key={position.symbol}
              className="p-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{position.symbol}</span>
                <div className="flex items-center space-x-1">
                  {position.unrealizedPL >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-sm font-mono ${
                    position.unrealizedPL >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {position.unrealizedPL >= 0 ? '+' : ''}${position.unrealizedPL.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div>
                  <span>Qty: </span>
                  <span className="text-white">{position.quantity}</span>
                </div>
                <div>
                  <span>Avg: </span>
                  <span className="text-white font-mono">${position.averagePrice.toFixed(2)}</span>
                </div>
                <div>
                  <span>Current: </span>
                  <span className="text-white font-mono">${position.currentPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span>Return: </span>
                  <span className={`font-mono ${
                    position.unrealizedPLPercent >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {position.unrealizedPLPercent >= 0 ? '+' : ''}{position.unrealizedPLPercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-500">
                Market Value: ${(position.quantity * position.currentPrice).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-700 space-y-2 text-sm">
        <div className="flex justify-between text-slate-400">
          <span>Portfolio Value:</span>
          <span className="text-white font-mono">$125,420.69</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Cash Balance:</span>
          <span className="text-white font-mono">$45,230.50</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Day P&L:</span>
          <span className={`font-mono ${totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalPL >= 0 ? '+' : ''}${totalPL.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
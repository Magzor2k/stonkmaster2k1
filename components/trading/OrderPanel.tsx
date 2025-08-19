'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface OrderPanelProps {
  symbol: string
}

export default function OrderPanel({ symbol }: OrderPanelProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit' | 'stop'>('market')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const order = {
        symbol,
        side,
        type: orderType,
        quantity: parseInt(quantity),
        price: orderType !== 'market' ? parseFloat(price) : undefined
      }

      console.log('Submitting order:', order)
      
      setTimeout(() => {
        alert(`${side.toUpperCase()} order for ${quantity} shares of ${symbol} submitted successfully!`)
        setQuantity('')
        setPrice('')
        setLoading(false)
      }, 1000)

    } catch (error) {
      console.error('Error submitting order:', error)
      alert('Failed to submit order')
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h3 className="font-semibold text-white">Order Entry</h3>
        <p className="text-sm text-slate-400">{symbol}</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="flex-1 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSide('buy')}
            className={`p-3 rounded font-semibold transition-colors flex items-center justify-center ${
              side === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            BUY
          </button>
          <button
            type="button"
            onClick={() => setSide('sell')}
            className={`p-3 rounded font-semibold transition-colors flex items-center justify-center ${
              side === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <TrendingDown className="mr-2 h-4 w-4" />
            SELL
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Order Type
          </label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as 'market' | 'limit' | 'stop')}
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white focus:border-green-500 focus:outline-none"
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Number of shares"
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:border-green-500 focus:outline-none"
            required
          />
        </div>

        {orderType !== 'market' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {orderType === 'limit' ? 'Limit Price' : 'Stop Price'}
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:border-green-500 focus:outline-none"
              required
            />
          </div>
        )}

        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex justify-between">
            <span>Buying Power:</span>
            <span className="text-white font-mono">$45,230.50</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Cost:</span>
            <span className="text-white font-mono">
              ${quantity && price ? (parseInt(quantity) * parseFloat(price || '0')).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !quantity}
          className={`w-full p-4 rounded font-semibold transition-colors ${
            side === 'buy'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? 'Submitting...' : `${side.toUpperCase()} ${symbol}`}
        </button>
      </form>

      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 space-y-1">
          <p>• Market orders execute immediately at current market price</p>
          <p>• Limit orders execute only at your specified price or better</p>
          <p>• Stop orders become market orders when stop price is reached</p>
        </div>
      </div>
    </div>
  )
}
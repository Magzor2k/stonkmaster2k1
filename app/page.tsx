'use client'

import Link from 'next/link'
import { TrendingUp, BarChart3, Activity, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            StonkMaster<span className="text-green-500">2K1</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Professional-grade trading platform with real-time data, advanced charting, 
            and intelligent technical analysis
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            Launch Trading Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <BarChart3 className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Advanced Charting</h3>
            <p className="text-slate-300">
              TradingView Lightweight Charts with real-time data streaming and 
              professional drawing tools
            </p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <Activity className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Technical Analysis</h3>
            <p className="text-slate-300">
              50+ built-in indicators including SMA, EMA, RSI, MACD, and Bollinger Bands
              with custom strategy backtesting
            </p>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <Zap className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Real-Time Trading</h3>
            <p className="text-slate-300">
              Sub-second latency WebSocket connections to Alpaca Markets with 
              instant order execution
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center space-x-4 text-slate-400">
            <span>Powered by</span>
            <div className="flex items-center space-x-6">
              <span className="font-semibold">Next.js 14</span>
              <span>•</span>
              <span className="font-semibold">TypeScript</span>
              <span>•</span>
              <span className="font-semibold">Alpaca Markets</span>
              <span>•</span>
              <span className="font-semibold">Redis</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
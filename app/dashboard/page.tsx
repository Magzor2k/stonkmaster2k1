'use client'

import { useState } from 'react'
import TradingChart from '@/components/charts/TradingChart'
import OrderPanel from '@/components/trading/OrderPanel'
import PositionPanel from '@/components/trading/PositionPanel'
import WatchList from '@/components/trading/WatchList'
import IndicatorPanel from '@/components/trading/IndicatorPanel'

export default function DashboardPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL')

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            StonkMaster<span className="text-green-500">2K1</span>
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-300">
              Market Status: <span className="text-green-500 font-semibold">Open</span>
            </div>
            <div className="text-sm text-slate-300">
              Account: <span className="text-white font-semibold">$125,420.69</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 grid-rows-12 gap-2 p-2">
        <div className="col-span-3 row-span-6 trading-panel">
          <WatchList
            selectedSymbol={selectedSymbol}
            onSymbolSelect={setSelectedSymbol}
          />
        </div>

        <div className="col-span-6 row-span-8 chart-container">
          <TradingChart symbol={selectedSymbol} />
        </div>

        <div className="col-span-3 row-span-8 trading-panel">
          <OrderPanel symbol={selectedSymbol} />
        </div>

        <div className="col-span-3 row-span-6 trading-panel">
          <PositionPanel />
        </div>

        <div className="col-span-6 row-span-4 trading-panel">
          <IndicatorPanel symbol={selectedSymbol} />
        </div>
      </div>
    </div>
  )
}
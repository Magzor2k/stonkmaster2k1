'use client'

import { useEffect, useRef } from 'react'
import { 
  createChart, 
  IChartApi, 
  ISeriesApi, 
  CandlestickData,
  ColorType,
  LineStyle
} from 'lightweight-charts'
import { ChartData } from '@/types'

interface TradingChartProps {
  symbol: string
}

export default function TradingChart({ symbol }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#e2e8f0',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          width: 1,
          color: '#64748b',
          style: LineStyle.Dashed,
        },
        horzLine: {
          width: 1,
          color: '#64748b',
          style: LineStyle.Dashed,
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#475569',
      },
      rightPriceScale: {
        borderColor: '#475569',
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    })

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    })

    chartRef.current = chart
    candlestickSeriesRef.current = candlestickSeries

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
      }
    }
  }, [])

  useEffect(() => {
    if (candlestickSeriesRef.current) {
      const sampleData: CandlestickData[] = [
        { time: '2024-01-01', open: 150, high: 155, low: 148, close: 152 },
        { time: '2024-01-02', open: 152, high: 158, low: 151, close: 157 },
        { time: '2024-01-03', open: 157, high: 160, low: 154, close: 159 },
        { time: '2024-01-04', open: 159, high: 162, low: 157, close: 161 },
        { time: '2024-01-05', open: 161, high: 164, low: 158, close: 163 },
      ]
      
      candlestickSeriesRef.current.setData(sampleData)
    }
  }, [symbol])

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-xl font-bold text-white mb-1">{symbol}</h2>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-green-500 font-semibold">$163.00</span>
          <span className="text-green-500">+2.15 (+1.34%)</span>
          <span className="text-slate-400">Vol: 45.2M</span>
        </div>
      </div>
      
      <div ref={chartContainerRef} className="w-full h-full" />
      
      <div className="absolute bottom-4 left-4 flex space-x-2">
        <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded">
          1D
        </button>
        <button className="px-3 py-1 bg-green-600 text-white text-xs rounded">
          1W
        </button>
        <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded">
          1M
        </button>
        <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded">
          3M
        </button>
        <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded">
          1Y
        </button>
      </div>
    </div>
  )
}
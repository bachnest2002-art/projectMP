'use client'

import { useEffect, useState } from 'react'

interface PortfolioData {
  startDate: string
  initialValue: number
  currentValue: number
  absoluteProfit: number
  absoluteReturns: number
  cagr: number
  nifty50Returns: number
  nifty50Cagr: number
  niftySmallcap50Returns: number
  niftySmallcap50Cagr: number
  mdd: number
  mddRecovery: number
  returnToMdd: number
  calmarRatio: number
  returnsGraph: any[]
  industryPie: any[]
  trades: number
  winRate: number
  riskReward: number
  avgHolding: number
  profitFactor: number
}

export default function PortfolioOverview() {
  const [data, setData] = useState<PortfolioData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/customer/portfolio/overview')
      if (res.ok) {
        const data = await res.json()
        setData(data)
      }
    }
    fetchData()
  }, [])

  if (!data) return <div>Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Portfolio Overview</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>Start Date: {data.startDate}</div>
        <div>Initial Value: {data.initialValue}</div>
        <div>Current Value: {data.currentValue}</div>
        <div>Absolute Profit: {data.absoluteProfit}</div>
        <div>Absolute Returns: {data.absoluteReturns}%</div>
        <div>CAGR: {data.cagr}%</div>
        <div>Nifty 50 Returns: {data.nifty50Returns}%</div>
        <div>Nifty 50 CAGR: {data.nifty50Cagr}%</div>
        <div>Nifty Smallcap 50 Returns: {data.niftySmallcap50Returns}%</div>
        <div>Nifty Smallcap 50 CAGR: {data.niftySmallcap50Cagr}%</div>
        <div>MDD: {data.mdd}%</div>
        <div>MDD Recovery: {data.mddRecovery}%</div>
        <div>Return to MDD: {data.returnToMdd}%</div>
        <div>Calmar Ratio: {data.calmarRatio}</div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Returns Graph</h2>
        {/* Placeholder for chart */}
        <div className="h-64 bg-gray-200">Chart here</div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Industry Distribution</h2>
        {/* Placeholder for pie chart */}
        <div className="h-64 bg-gray-200">Pie chart here</div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div>Total Trades: {data.trades}</div>
        <div>Win Rate: {data.winRate}%</div>
        <div>Risk Reward: {data.riskReward}</div>
        <div>Avg Holding: {data.avgHolding} days</div>
        <div>Profit Factor: {data.profitFactor}</div>
      </div>
    </div>
  )
}
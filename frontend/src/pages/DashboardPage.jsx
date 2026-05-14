import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { clearHistory, getHistory } from '../services/history'

const COLORS = ['#0e7490', '#14b8a6', '#7dd3fc', '#99f6e4']

const normalizeSeverity = (value = '') => {
  const text = value.toLowerCase()
  if (text.includes('severe')) return 'Severe'
  if (text.includes('moderate')) return 'Moderate'
  if (text.includes('mild') || text.includes('low')) return 'Mild'
  return 'Unknown'
}

export default function DashboardPage() {
  const [history, setHistory] = useState(() => getHistory())

  const computed = useMemo(() => {
    const total = history.length
    const floodCount = history.filter((item) => item.prediction?.toLowerCase() === 'flood').length
    const noFloodCount = total - floodCount

    const severityCounts = history.reduce(
      (acc, item) => {
        const bucket = normalizeSeverity(item.severity)
        if (bucket in acc) acc[bucket] += 1
        return acc
      },
      { Mild: 0, Moderate: 0, Severe: 0 },
    )

    const averageArea =
      total > 0
        ? history.reduce((sum, item) => sum + (Number(item.flood_area_percentage) || 0), 0) / total
        : 0

    const severityPieData = Object.entries(severityCounts)
      .map(([name, value]) => ({ name, value }))
      .filter((item) => item.value > 0)

    const floodBarData = [
      { name: 'Flood', count: floodCount },
      { name: 'No Flood', count: noFloodCount },
    ]

    return { total, floodCount, noFloodCount, severityCounts, averageArea, severityPieData, floodBarData }
  }, [history])

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  return (
    <div className="page-container space-y-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-brand-ocean">Analytics Dashboard</h1>
        <button onClick={handleClear} className="rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">
          Clear History
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Total Analyses" value={computed.total} />
        <StatCard label="Flood Detected" value={computed.floodCount} />
        <StatCard label="No Flood" value={computed.noFloodCount} />
        <StatCard label="Mild Flood" value={computed.severityCounts.Mild} />
        <StatCard label="Moderate Flood" value={computed.severityCounts.Moderate} />
        <StatCard label="Severe Flood" value={computed.severityCounts.Severe} />
      </div>

      <div className="glass-card p-5">
        <p className="text-sm text-slate-500">Average Flood Area Percentage</p>
        <p className="text-3xl font-bold text-brand-teal">{computed.averageArea.toFixed(2)}%</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card h-80 p-5">
          <h2 className="mb-3 font-semibold text-brand-ocean">Severity Distribution</h2>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={computed.severityPieData.length ? computed.severityPieData : [{ name: 'No Data', value: 1 }]} dataKey="value" nameKey="name" outerRadius={90}>
                {(computed.severityPieData.length ? computed.severityPieData : [{ name: 'No Data', value: 1 }]).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card h-80 p-5">
          <h2 className="mb-3 font-semibold text-brand-ocean">Flood vs No Flood</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={computed.floodBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0e7490" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card overflow-x-auto p-5">
        <h2 className="mb-4 text-xl font-semibold text-brand-ocean">Recent Analyses</h2>
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="pb-2 pr-4">Time</th>
              <th className="pb-2 pr-4">File</th>
              <th className="pb-2 pr-4">Prediction</th>
              <th className="pb-2 pr-4">Severity</th>
              <th className="pb-2 pr-4">Confidence</th>
              <th className="pb-2 pr-4">Flood Area</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(0, 10).map((item, idx) => (
              <tr key={`${item.timestamp}-${idx}`} className="border-b border-slate-100">
                <td className="py-2 pr-4">{new Date(item.timestamp).toLocaleString()}</td>
                <td className="py-2 pr-4">{item.original_filename || '-'}</td>
                <td className="py-2 pr-4">{item.prediction}</td>
                <td className="py-2 pr-4">{item.severity}</td>
                <td className="py-2 pr-4">{Number(item.confidence).toFixed(2)}%</td>
                <td className="py-2 pr-4">{Number(item.flood_area_percentage).toFixed(2)}%</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td className="py-4 text-slate-500" colSpan={6}>No analysis history yet. Run analysis to populate dashboard.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-brand-ocean">{value}</p>
    </div>
  )
}

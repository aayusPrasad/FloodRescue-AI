import {
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'

const severityData = [
  { name: 'Low', value: 35 },
  { name: 'Moderate', value: 45 },
  { name: 'High', value: 20 },
]

const trendData = [
  { month: 'Jan', area: 11 },
  { month: 'Feb', area: 14 },
  { month: 'Mar', area: 13 },
  { month: 'Apr', area: 17 },
  { month: 'May', area: 15 },
]

export default function DashboardPage() {
  return (
    <div className="page-container space-y-6 py-10">
      <h1 className="text-3xl font-bold text-brand-ocean">Analytics Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {['Total Analyses: 12,540', 'Active Alerts: 7', 'Avg Response Window: 24 min'].map((item) => (
          <div key={item} className="glass-card p-5 font-semibold text-brand-ocean">{item}</div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card h-80 p-5">
          <h2 className="mb-3 font-semibold text-brand-ocean">Flood Severity Distribution</h2>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={severityData} dataKey="value" nameKey="name" outerRadius={90}>
                {['#0e7490', '#14b8a6', '#7dd3fc'].map((color) => <Cell key={color} fill={color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card h-80 p-5">
          <h2 className="mb-3 font-semibold text-brand-ocean">Flood Area Trend (%)</h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={trendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="area" stroke="#0e7490" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
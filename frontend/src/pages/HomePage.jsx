import { Link } from 'react-router-dom'

const features = [
  'AI-based flood classification with confidence scoring',
  'Segmentation overlays to visualize affected flood areas',
  'FastAPI integration for real-time response workflows',
]

export default function HomePage() {
  return (
    <div className="page-container space-y-14 py-10">
      <section className="glass-card grid items-center gap-8 p-8 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold text-brand-ocean">FloodRescue AI: Early Detection, Faster Response</h1>
          <p className="mt-4 text-lg">A humanitarian AI platform that helps teams detect flood risk and coordinate disaster response quickly and reliably.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/analyze" className="rounded-full bg-brand-teal px-5 py-3 font-semibold text-white">Start Analysis</Link>
            <Link to="/dashboard" className="rounded-full border border-brand-ocean px-5 py-3 font-semibold text-brand-ocean">View Dashboard</Link>
          </div>
        </div>
        <img className="h-80 w-full rounded-2xl object-cover" src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80" alt="Flood response" />
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-brand-ocean">Core Capability</h3>
            <p className="mt-2">{feature}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          { label: 'Analyses Processed', value: '12,500+' },
          { label: 'Avg. Detection Confidence', value: '98.7%' },
          { label: 'Regions Monitored', value: '140+' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-6 text-center">
            <p className="text-3xl font-bold text-brand-teal">{stat.value}</p>
            <p className="mt-1 text-sm">{stat.label}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
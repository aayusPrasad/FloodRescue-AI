const tips = [
  'Keep emergency kits with water, medicine, and flashlights ready.',
  'Store important documents in waterproof bags.',
  'Avoid walking or driving through floodwaters.',
  'Follow official evacuation routes immediately.',
]

export default function SafetyTipsPage() {
  return (
    <div className="page-container space-y-6 py-10">
      <h1 className="text-3xl font-bold text-brand-ocean">Flood Safety Tips</h1>
      <img className="h-72 w-full rounded-2xl object-cover" src="https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=1400&q=80" alt="Emergency response" />
      <div className="grid gap-4 md:grid-cols-2">
        {tips.map((tip) => (
          <div key={tip} className="glass-card p-5">{tip}</div>
        ))}
      </div>
      <section className="glass-card p-6">
        <h2 className="text-xl font-semibold text-brand-ocean">Emergency Contacts</h2>
        <p className="mt-2">Contact local emergency services, municipal response teams, and nearby shelters during high-risk flooding conditions.</p>
      </section>
    </div>
  )
}
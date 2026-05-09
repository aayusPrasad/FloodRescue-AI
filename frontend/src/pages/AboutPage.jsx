export default function AboutPage() {
  return (
    <div className="page-container space-y-6 py-10">
      <h1 className="text-3xl font-bold text-brand-ocean">About FloodRescue AI</h1>
      <section className="glass-card p-6">
        <h2 className="text-xl font-semibold text-brand-ocean">Project Objective</h2>
        <p className="mt-2">FloodRescue AI supports early warning and response planning by combining image classification and segmentation for flood event analysis.</p>
      </section>
      <section className="glass-card p-6">
        <h2 className="text-xl font-semibold text-brand-ocean">AI Pipeline & Architecture</h2>
        <p className="mt-2">The inference pipeline uses EfficientNetB0 for classification and U-Net for segmentation, served through FastAPI and PyTorch, with a React frontend for real-time user interaction.</p>
      </section>
      <section className="glass-card p-6">
        <h2 className="text-xl font-semibold text-brand-ocean">Mission Statement</h2>
        <p className="mt-2">Our mission is to make flood intelligence accessible to emergency teams, NGOs, and communities through reliable AI tools.</p>
      </section>
    </div>
  )
}
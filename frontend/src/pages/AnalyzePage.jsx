import { useMemo, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAssetUrl, predictFlood } from '../services/api'
import { getHistory, saveAnalysisToHistory } from '../services/history'
import { generateFloodReportPdf } from '../services/report'
import { useAuth } from '../context/AuthContext'

export default function AnalyzePage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const { user } = useAuth()
  const history = useMemo(() => getHistory(), [result])

  const handleFile = (selectedFile) => {
    setFile(selectedFile)
    setResult(null)
    setError('')
    setPreview(URL.createObjectURL(selectedFile))
  }



  const handleDownloadReport = async () => {
    await generateFloodReportPdf({
      user,
      result,
      previewUrl: preview,
      overlayUrl: getAssetUrl(result?.overlay_url),
      history,
      dashboardSelectors: {
        severityChartSelector: '#severity-chart-card',
        floodBarSelector: '#flood-bar-card',
        statsSelector: '#dashboard-stats-grid',
      },
    })
  }

  const handleSubmit = async () => {
    if (!file) return setError('Please upload an image first.')
    try {
      setLoading(true)
      setError('')
      const data = await predictFlood(file)
      setResult(data)
      saveAnalysisToHistory(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container py-10">
      <h1 className="mb-6 text-3xl font-bold text-brand-ocean">Analyze Flood Imagery</h1>
      <div className="glass-card p-6">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/40 p-8 text-center">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <p className="font-semibold text-brand-ocean">Drag & drop or click to upload image</p>
        </label>
        {preview && <img src={preview} alt="preview" className="mt-4 max-h-72 rounded-xl object-cover" />}
        <button onClick={handleSubmit} className="mt-5 rounded-xl bg-brand-teal px-5 py-3 font-semibold text-white">Run Prediction</button>
        {loading && <LoadingSpinner />}
        {error && <p className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">{error}</p>}
      </div>

      {result && (
        <>
        <div className="mt-6">
          <button onClick={handleDownloadReport} className="rounded-xl border border-brand-teal bg-teal-50 px-5 py-3 font-semibold text-brand-ocean">Download AI Report</button>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-brand-ocean">Prediction Results</h2>
            <ul className="mt-4 space-y-2">
              <li><strong>Prediction:</strong> {result.prediction}</li>
              <li><strong>Confidence:</strong> {result.confidence}%</li>
              <li><strong>Severity:</strong> {result.severity}</li>
              <li><strong>Flood Area:</strong> {result.flood_area_percentage}%</li>
            </ul>
          </div>
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-brand-ocean">Visual Comparison</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div><p className="mb-2 text-sm">Uploaded Image</p><img src={preview} alt="uploaded" className="rounded-lg" /></div>
              <div><p className="mb-2 text-sm">Overlay Result</p><img src={getAssetUrl(result.overlay_url)} alt={result.overlay_image} className="rounded-lg" /></div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  )
}

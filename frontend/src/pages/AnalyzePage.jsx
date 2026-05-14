import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAssetUrl, predictFlood } from '../services/api'
import { saveAnalysisToHistory } from '../services/history'

export default function AnalyzePage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleFile = (selectedFile) => {
    setFile(selectedFile)
    setResult(null)
    setError('')
    setPreview(URL.createObjectURL(selectedFile))
  }

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload an image first.')
      return
    }

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
      <h1 className="mb-6 text-3xl font-bold text-brand-ocean">
        Analyze Flood Imagery
      </h1>

      <div className="glass-card p-6">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/40 p-8 text-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFile(e.target.files[0])
              }
            }}
          />

          <p className="font-semibold text-brand-ocean">
            Drag & drop or click to upload image
          </p>
        </label>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-4 max-h-72 rounded-xl object-cover"
          />
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 rounded-xl bg-brand-teal px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Analyzing...' : 'Run Prediction'}
        </button>

        {loading && <LoadingSpinner />}

        {error && (
          <p className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}
      </div>

      {result && (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-brand-ocean">
              Prediction Results
            </h2>

            <ul className="mt-4 space-y-2">
              <li><strong>Prediction:</strong> {result.prediction}</li>
              <li><strong>Confidence:</strong> {result.confidence}%</li>
              <li><strong>Severity:</strong> {result.severity}</li>
              <li><strong>Flood Area:</strong> {result.flood_area_percentage}%</li>

              {result.gps && (
                <>
                  <li><strong>Latitude:</strong> {result.gps.latitude}</li>
                  <li><strong>Longitude:</strong> {result.gps.longitude}</li>
                </>
              )}
            </ul>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-brand-ocean">
              Visual Comparison
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm">Uploaded Image</p>
                <img src={preview} alt="uploaded" className="rounded-lg" />
              </div>

              <div>
                <p className="mb-2 text-sm">Overlay Result</p>

                {result.overlay_url ? (
                  <img
                    src={getAssetUrl(result.overlay_url)}
                    alt={result.overlay_image || 'overlay result'}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="flex min-h-40 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    No overlay generated
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

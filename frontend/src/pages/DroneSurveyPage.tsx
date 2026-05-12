import { useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAssetUrl, predictBatchFlood } from '../services/api'

type BatchItem = {
  prediction: string
  confidence: number
  severity: string
  flood_area_percentage: number
  overlay_image?: string | null
  overlay_url?: string | null
  original_filename: string
}

type BatchResult = {
  total_images: number
  flood_detected: number
  non_flood_detected: number
  average_flood_area: number
  most_severe: string
  results: BatchItem[]
}

export default function DroneSurveyPage() {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null)

  const handleFiles = (selectedFiles: FileList) => {
    const fileArray = Array.from(selectedFiles)

    setFiles(fileArray)
    setBatchResult(null)
    setError('')

    const previewUrls = fileArray.map((file) => URL.createObjectURL(file))
    setPreviews(previewUrls)
  }

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please upload drone survey images first.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await predictBatchFlood(files)
      setBatchResult(data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Batch prediction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal">
          Drone Survey Mode
        </p>

        <h1 className="mt-2 text-3xl font-bold text-brand-ocean">
          Batch Flood Analysis from Drone Images
        </h1>

        <p className="mt-3 max-w-3xl text-slate-600">
          Upload multiple drone-captured flood images and let FloodRescue AI analyze
          flood presence, severity, flood coverage, and rescue priority indicators.
        </p>
      </div>

      <div className="glass-card p-6">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-teal-300 bg-teal-50/50 p-8 text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFiles(e.target.files)
              }
            }}
          />

          <p className="text-lg font-semibold text-brand-ocean">
            Upload Drone Survey Images
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Select multiple JPG/PNG images captured from drone survey.
          </p>
        </label>

        {previews.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 font-semibold text-brand-ocean">
              Selected Images: {previews.length}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {previews.map((preview, index) => (
                <img
                  key={preview}
                  src={preview}
                  alt={`Drone preview ${index + 1}`}
                  className="h-40 w-full rounded-xl object-cover shadow-sm"
                />
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 rounded-xl bg-brand-teal px-6 py-3 font-semibold text-white shadow-md hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Analyzing Survey...' : 'Run Batch Analysis'}
        </button>

        {loading && <LoadingSpinner />}

        {error && (
          <p className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}
      </div>

      {batchResult && (
        <div className="mt-10 space-y-8">
          <div className="grid gap-5 md:grid-cols-4">
            <div className="glass-card p-5">
              <p className="text-sm text-slate-500">Total Images</p>
              <h3 className="mt-2 text-3xl font-bold text-brand-ocean">
                {batchResult.total_images}
              </h3>
            </div>

            <div className="glass-card p-5">
              <p className="text-sm text-slate-500">Flood Detected</p>
              <h3 className="mt-2 text-3xl font-bold text-brand-ocean">
                {batchResult.flood_detected}
              </h3>
            </div>

            <div className="glass-card p-5">
              <p className="text-sm text-slate-500">Average Flood Area</p>
              <h3 className="mt-2 text-3xl font-bold text-brand-ocean">
                {batchResult.average_flood_area}%
              </h3>
            </div>

            <div className="glass-card p-5">
              <p className="text-sm text-slate-500">Most Severe</p>
              <h3 className="mt-2 text-xl font-bold text-brand-ocean">
                {batchResult.most_severe}
              </h3>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-2xl font-bold text-brand-ocean">
              Drone Image Analysis Results
            </h2>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {batchResult.results.map((item, index) => (
                <div
                  key={`${item.original_filename}-${index}`}
                  className="rounded-2xl border border-teal-100 bg-white/80 p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-slate-500">
                    {item.original_filename}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm text-slate-500">
                        Original Image
                      </p>

                      <img
                        src={previews[index]}
                        alt="Original drone"
                        className="h-48 w-full rounded-xl object-cover"
                      />
                    </div>

                    <div>
                      <p className="mb-2 text-sm text-slate-500">
                        AI Overlay
                      </p>

                      {item.overlay_url ? (
                        <img
                          src={getAssetUrl(item.overlay_url)}
                          alt={item.overlay_image || 'Flood overlay'}
                          className="h-48 w-full rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-48 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                          No overlay generated
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <p>
                      <strong>Prediction:</strong> {item.prediction}
                    </p>

                    <p>
                      <strong>Confidence:</strong> {item.confidence}%
                    </p>

                    <p>
                      <strong>Severity:</strong> {item.severity}
                    </p>

                    <p>
                      <strong>Flood Area:</strong>{' '}
                      {item.flood_area_percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
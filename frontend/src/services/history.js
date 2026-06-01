const HISTORY_KEY = 'floodrescue_history'

export const saveAnalysisToHistory = (result) => {
  if (!result) return
  const history = getHistory()
  const entry = {
    prediction: result.prediction,
    confidence: Number(result.confidence) || 0,
    severity: result.severity || 'Unknown',
    flood_area_percentage: Number(result.flood_area_percentage) || 0,
    overlay_url: result.overlay_url || '',
    gps: result.gps || null,
    original_filename: result.original_filename || 'uploaded-image',
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...history]))
}

export const getHistory = () => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY)
}

export { HISTORY_KEY }

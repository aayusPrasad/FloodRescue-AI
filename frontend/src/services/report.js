import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const THEME = {
  teal: [20, 140, 130],
  mint: [223, 247, 239],
  slate: [55, 65, 81],
}

const loadImage = (src) =>
  new Promise((resolve) => {
    if (!src) return resolve(null)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })

const captureElement = async (selector) => {
  const node = document.querySelector(selector)
  if (!node) return null
  const canvas = await html2canvas(node, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
  })
  return canvas.toDataURL('image/png')
}

const addFooter = (pdf) => {
  const pageCount = pdf.getNumberOfPages()
  for (let i = 1; i <= pageCount; i += 1) {
    pdf.setPage(i)
    pdf.setFontSize(9)
    pdf.setTextColor(90, 100, 120)
    pdf.text('Generated automatically by FloodRescue AI', 105, 290, {
      align: 'center',
    })
  }
}

export const generateFloodReportPdf = async ({
  user,
  result,
  previewUrl,
  overlayUrl,
  history = [],
  dashboardSelectors = {},
}) => {
  // ensure history is always an array
  const safeHistory = Array.isArray(history) ? history : []

  const now = new Date()
  const timestamp = now.toISOString().replace(/[:.]/g, '-')
  const reportId = `FR-${Math.random().toString(36).slice(2, 10).toUpperCase()}`
  const pdf = new jsPDF('p', 'mm', 'a4')

  let y = 16
  const margin = 12
  const pageWidth = 210
  const contentWidth = pageWidth - margin * 2

  const drawPageBorder = () => {
    pdf.setDrawColor(...THEME.teal)
    pdf.setLineWidth(0.8)
    pdf.rect(6, 6, 198, 285)
  }

  const addPageIfNeeded = (needed = 14) => {
    if (y + needed > 278) {
      pdf.addPage()
      drawPageBorder()
      y = 16
    }
  }

  const sectionTitle = (text) => {
    addPageIfNeeded(12)
    pdf.setFillColor(...THEME.mint)
    pdf.roundedRect(margin, y, contentWidth, 9, 2, 2, 'F')
    pdf.setFontSize(12)
    pdf.setTextColor(...THEME.slate)
    pdf.text(text, margin + 3, y + 6)
    y += 12
  }

  const line = (label, value = '-') => {
    addPageIfNeeded(8)
    pdf.setFontSize(10)
    pdf.setTextColor(...THEME.slate)
    pdf.text(`${label}: ${value}`, margin, y)
    y += 6
  }

  drawPageBorder()
  pdf.setFontSize(18)
  pdf.setTextColor(...THEME.teal)
  pdf.text('FloodRescue AI - Disaster Analysis Report', margin, y)
  y += 10

  // SECTION 1
  sectionTitle('Section 1: Report Metadata')
  line('Date & Time', now.toLocaleString())
  line('Report ID', reportId)
  line('User', user?.fullName || user?.email || 'Guest')

  const [uploadedImg, overlayImg] = await Promise.all([
    loadImage(previewUrl),
    loadImage(overlayUrl),
  ])

  addPageIfNeeded(80)
  if (uploadedImg) {
    pdf.setFontSize(10)
    pdf.text('Uploaded Image', margin, y)
    pdf.addImage(uploadedImg, 'JPEG', margin, y + 2, 85, 55)
  }
  if (overlayImg) {
    pdf.setFontSize(10)
    pdf.text('AI Overlay Image', margin + 95, y)
    pdf.addImage(overlayImg, 'JPEG', margin + 95, y + 2, 85, 55)
  }
  y += 62

  // SECTION 2
  sectionTitle('Section 2: Prediction Details')
  line('Prediction', result?.prediction || '-')
  line(
    'Confidence',
    result?.confidence != null
      ? `${Number(result.confidence).toFixed(2)}%`
      : '-',
  )
  line('Severity', result?.severity || '-')
  line(
    'Flood Area Percentage',
    result?.flood_area_percentage != null
      ? `${Number(result.flood_area_percentage).toFixed(2)}%`
      : '-',
  )

  const gpsValue =
    typeof result?.gps === 'object' && result?.gps
      ? `${result.gps.latitude}, ${result.gps.longitude}`
      : result?.gps || '-'
  line('GPS Coordinates', gpsValue)

  line(
    'Rescue Priority Score',
    result?.rescue_priority_score != null
      ? String(result.rescue_priority_score)
      : '-',
  )

  // SECTION 3
  sectionTitle('Section 3: Dashboard Analytics Summary')
  const [severityChart, floodBar, statsCard] = await Promise.all([
    captureElement(
      dashboardSelectors.severityChartSelector || '#severity-chart-card',
    ),
    captureElement(dashboardSelectors.floodBarSelector || '#flood-bar-card'),
    captureElement(dashboardSelectors.statsSelector || '#dashboard-stats-grid'),
  ])

  if (statsCard) {
    addPageIfNeeded(60)
    pdf.text('Analysis Statistics', margin, y)
    pdf.addImage(statsCard, 'PNG', margin, y + 2, 182, 42)
    y += 48
  }

  if (severityChart) {
    addPageIfNeeded(62)
    pdf.text('Severity Pie Chart', margin, y)
    pdf.addImage(severityChart, 'PNG', margin, y + 2, 85, 52)
  }

  if (floodBar) {
    pdf.text('Flood vs No Flood Chart', margin + 95, y)
    pdf.addImage(floodBar, 'PNG', margin + 95, y + 2, 85, 52)
  }
  y += 58

  // SECTION 4 (History part)
  sectionTitle('Section 4: Recent Analysis History')
  line('Columns', 'Prediction | Confidence | Severity | Flood Area | Date')

  const rows = safeHistory.slice(0, 12)
  rows.forEach((row) => {
    const rowText = `${row?.prediction || '-'} | ${Number(
      row?.confidence || 0,
    ).toFixed(2)}% | ${row?.severity || '-'} | ${Number(
      row?.flood_area_percentage || 0,
    ).toFixed(2)}% | ${
      row?.timestamp ? new Date(row.timestamp).toLocaleString() : '-'
    }`
    addPageIfNeeded(8)
    pdf.setFontSize(8.5)
    pdf.text(rowText, margin, y, { maxWidth: contentWidth })
    y += 5.5
  })

  if (rows.length === 0) {
    line('History', 'No analysis history found.')
  }

  // SECTION 5
  sectionTitle('Section 5: Emergency Notes')
  const sev = (result?.severity || '').toLowerCase()
  let note = 'Continuous monitoring advised.'
  if (sev.includes('severe')) note = 'Immediate rescue operation recommended.'
  else if (sev.includes('mild') || sev.includes('low'))
    note = 'Low-risk flood activity detected.'
  line('Recommended Action', note)

  addFooter(pdf)
  pdf.save(`FloodReport_${timestamp}.pdf`)
}
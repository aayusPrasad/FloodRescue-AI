import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import DroneSurveyPage from './pages/DroneSurveyPage'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'
import SafetyTipsPage from './pages/SafetyTipsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/drone-survey" element={<DroneSurveyPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/safety-tips" element={<SafetyTipsPage />} />
      </Route>
    </Routes>
  )
}

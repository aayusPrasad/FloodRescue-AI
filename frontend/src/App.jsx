import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import AnalyzePage from './pages/AnalyzePage'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'
import SafetyTipsPage from './pages/SafetyTipsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DroneSurveyPage from './pages/DroneSurveyPage'
import FloodMapPage from './pages/FloodMapPage'
import Impact3DPage from './pages/FloodImpact3DPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/safety-tips" element={<SafetyTipsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/analyze" element={<ProtectedRoute><AnalyzePage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/drone-survey" element={<ProtectedRoute><DroneSurveyPage /></ProtectedRoute>} />
        <Route path="/flood-map" element={<ProtectedRoute><FloodMapPage /></ProtectedRoute>} />
        <Route path="/impact-3d" element={<ProtectedRoute><Impact3DPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

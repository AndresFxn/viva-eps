import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Queue from './pages/Queue'
import NewTriage from './pages/NewTriage'
import TriageDetail from './pages/TriageDetail'
import Patients from './pages/Patients'
import Consultations from './pages/Consultations'
import Rooms from './pages/Rooms'
import Reports from './pages/Reports'

const queryClient = new QueryClient()

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
      } />
      <Route path="/queue" element={
        <ProtectedRoute><Layout><Queue /></Layout></ProtectedRoute>
      } />
      <Route path="/triage/new" element={
        <ProtectedRoute roles={['admin', 'nurse']}><Layout><NewTriage /></Layout></ProtectedRoute>
      } />
      <Route path="/triage/:id" element={
        <ProtectedRoute><Layout><TriageDetail /></Layout></ProtectedRoute>
      } />
      <Route path="/patients" element={
        <ProtectedRoute><Layout><Patients /></Layout></ProtectedRoute>
      } />
      <Route path="/consultations" element={
        <ProtectedRoute roles={['admin', 'doctor']}><Layout><Consultations /></Layout></ProtectedRoute>
      } />
      <Route path="/rooms" element={
        <ProtectedRoute roles={['admin']}><Layout><Rooms /></Layout></ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute roles={['admin', 'doctor']}><Layout><Reports /></Layout></ProtectedRoute>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

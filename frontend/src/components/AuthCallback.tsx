import { useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ValidationScreen from "./ValidationScreen"
import { useAuth } from "../hooks/useAuth"

export default function AuthCallback() {
  const navigate = useNavigate()
  const { refresh, isAuthenticated } = useAuth()

  const handleValidated = useCallback(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Fetch user info when this page loads (cookie auto-sent)
  useEffect(() => {
    refresh().catch(() => navigate('/login', { replace: true }))
  }, [refresh, navigate])

  return <ValidationScreen onValidated={handleValidated} />
}
import { useCallback, useEffect, useState, type ReactNode } from "react"
import { AuthContext, type Usuario } from "./AuthContext"
import { axiosInstance } from "../libs/axios"

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Usuario | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const refresh = useCallback(async () => {
        try {
            const res = await axiosInstance.get('/auth/me')
            setUser(res.data)
            setError(null)
        } catch {
            setUser(null)
        }
    }, [])

    // On mount: check auth via cookie (auto-sent by browser)
    useEffect(() => {
        refresh().finally(() => setIsLoading(false))
    }, [refresh])

    const login = useCallback(() => {
        window.location.href = '/api/v1/auth/lti/login'
    }, [])

    const logout = useCallback(async () => {
        await axiosInstance.post('/auth/logout')
        setUser(null)
    }, [])

    return (
        <AuthContext.Provider value={{
            user, isAuthenticated: !!user, isLoading, error, login, logout, refresh,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
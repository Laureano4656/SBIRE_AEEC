// src/context/AuthContext.ts
import { createContext } from 'react'

// We define the interface here so it can be imported by the Provider and the Hook
export interface Usuario {
    id: number
    carrera_id: number | null
    nombre: string
    apellido: string
    email: string
    moodle_id: string
    rol: string
    max_casos_activos: number | null
    activo: boolean
}

export interface AuthContextType {
    user: Usuario | null
    isAuthenticated: boolean
    isLoading: boolean       // true while checking /auth/me on mount
    error: Error | null
    login: () => void        // redirect to backend LTI login
    logout: () => void       // call backend /auth/logout + clear state
    refresh: () => Promise<void>  // re-fetch /auth/me
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

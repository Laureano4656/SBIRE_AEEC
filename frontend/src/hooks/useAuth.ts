// src/hooks/useAuth.ts
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext' // Pointing to the .ts file

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
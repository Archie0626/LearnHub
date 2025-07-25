"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  username: string
  email: string
  achievements: string[]
  studyStreak: number
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  signup: (username: string, email: string, password: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem("learnhub_token")
    const userData = localStorage.getItem("learnhub_user")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem("learnhub_token")
        localStorage.removeItem("learnhub_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in real app, this would call your PHP backend
    if (username && password) {
      const mockUser: User = {
        id: "1",
        username,
        email: `${username}@example.com`,
        achievements: ["First Login", "Quiz Master"],
        studyStreak: 5,
      }

      const mockToken = "mock_jwt_token_" + Date.now()

      localStorage.setItem("learnhub_token", mockToken)
      localStorage.setItem("learnhub_user", JSON.stringify(mockUser))
      setUser(mockUser)
      return true
    }
    return false
  }

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username && email && password) {
      const mockUser: User = {
        id: "1",
        username,
        email,
        achievements: ["Welcome to LearnHub!"],
        studyStreak: 0,
      }

      const mockToken = "mock_jwt_token_" + Date.now()

      localStorage.setItem("learnhub_token", mockToken)
      localStorage.setItem("learnhub_user", JSON.stringify(mockUser))
      setUser(mockUser)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("learnhub_token")
    localStorage.removeItem("learnhub_user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, signup, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

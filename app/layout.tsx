import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LearnHub - Semiconductor Learning Platform",
  description: "Master semiconductor concepts with personalized learning",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-r from-[#FFB996] to-[#FFCF81]">
            <Navigation />
            <main className="pt-16">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

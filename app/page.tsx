"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BookOpen,
  FileText,
  Brain,
  MessageSquare,
  GraduationCap,
  Calendar,
  Trophy,
  Flame,
  Bell,
  TrendingUp,
} from "lucide-react"
import { useEffect, useState } from "react"

interface TermOfDay {
  term: string
  definition: string
}

interface TrendingQuestion {
  question: string
  company: string
  views: number
}

export default function HomePage() {
  const { user } = useAuth()
  const [termOfDay, setTermOfDay] = useState<TermOfDay | null>(null)
  const [trendingQuestions, setTrendingQuestions] = useState<TrendingQuestion[]>([])

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setTermOfDay({
      term: "MOSFET",
      definition:
        "Metal-Oxide-Semiconductor Field-Effect Transistor - a type of transistor used for switching and amplifying electronic signals.",
    })

    setTrendingQuestions([
      { question: "Explain the working principle of a MOSFET", company: "Intel", views: 1250 },
      { question: "What is the difference between NMOS and PMOS?", company: "AMD", views: 980 },
      { question: "How does doping affect semiconductor properties?", company: "NVIDIA", views: 756 },
    ])
  }, [])

  const quickLinks = [
    { href: "/glossary", label: "Glossary", icon: BookOpen, color: "mint-green" },
    { href: "/quicknotes", label: "Quicknotes", icon: FileText, color: "peach" },
    { href: "/mcqs", label: "MCQs", icon: Brain, color: "light-orange" },
    { href: "/interview-qa", label: "Interview Q&A", icon: MessageSquare, color: "light-yellow" },
    { href: "/tutorials", label: "Tutorials", icon: GraduationCap, color: "mint-green" },
    { href: "/study-planner", label: "Study Planner", icon: Calendar, color: "peach" },
  ]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            {user ? `Welcome back, ${user.username}!` : "Welcome to LearnHub"}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Master semiconductor concepts with personalized learning, practice quizzes, and comprehensive study
            materials.
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className={`${link.color} hover:scale-105 transition-transform cursor-pointer h-full`}>
                <CardContent className="p-4 text-center">
                  <link.icon className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                  <p className="font-semibold text-gray-800 text-sm">{link.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Term of the Day */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Term of the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              {termOfDay && (
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-blue-600">{termOfDay.term}</h3>
                  <p className="text-gray-700">{termOfDay.definition}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/glossary">View Full Glossary</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Achievements */}
          {user && (
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Your Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="font-semibold">{user.studyStreak} day study streak!</span>
                </div>
                <div className="space-y-2">
                  {user.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Trending Questions */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingQuestions.map((q, index) => (
                <div key={index} className="border-b pb-2 last:border-b-0">
                  <p className="text-sm font-medium text-gray-800">{q.question}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-blue-600">{q.company}</span>
                    <span className="text-xs text-gray-500">{q.views} views</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" asChild>
                <Link href="/interview-qa">View All Questions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">New MCQ Set Available!</p>
                <p className="text-sm text-blue-600">Practice advanced CMOS logic design questions.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-green-800">Study Planner Updated</p>
                <p className="text-sm text-green-600">New templates for semiconductor device physics.</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-800">Interview Prep Week</p>
                <p className="text-sm text-purple-600">Special focus on analog circuit design questions.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        {!user && (
          <Card className="bg-white/95 backdrop-blur text-center">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
              <p className="text-gray-600 mb-6">Join thousands of students mastering semiconductor concepts</p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

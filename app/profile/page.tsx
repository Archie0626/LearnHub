"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { User, Trophy, Flame, BookOpen, Brain, Calendar, Star, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface BookmarkedNote {
  id: string
  title: string
  category: string
  dateBookmarked: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookmarkedNotes, setBookmarkedNotes] = useState<BookmarkedNote[]>([])
  const [stats, setStats] = useState({
    quizzesCompleted: 0,
    averageScore: 0,
    totalStudyTime: 0,
    notesBookmarked: 0,
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Load bookmarked notes from localStorage
    const saved = localStorage.getItem("bookmarked_notes")
    if (saved) {
      setBookmarkedNotes(JSON.parse(saved))
    }

    // Mock stats - in real app, fetch from API
    setStats({
      quizzesCompleted: 15,
      averageScore: 87,
      totalStudyTime: 24,
      notesBookmarked: 8,
    })
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Your Profile</h1>
          <p className="text-xl text-white/90">Track your learning progress and achievements</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Info */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-[#FFB996] to-[#FFCF81] rounded-full flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold">{user.username}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="font-semibold">{user.studyStreak} day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Level: Intermediate</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Stats */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Study Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.quizzesCompleted}</div>
                  <div className="text-sm text-blue-800">Quizzes Completed</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
                  <div className="text-sm text-green-800">Average Score</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalStudyTime}h</div>
                  <div className="text-sm text-purple-800">Study Time</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.notesBookmarked}</div>
                  <div className="text-sm text-orange-800">Notes Saved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-medium">{achievement}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bookmarked Notes */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Bookmarked Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookmarkedNotes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarkedNotes.map((note) => (
                  <div key={note.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <h4 className="font-semibold">{note.title}</h4>
                    <Badge variant="secondary" className="mt-2">
                      {note.category}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-2">
                      Bookmarked: {new Date(note.dateBookmarked).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No bookmarked notes yet</p>
                <Button variant="outline" className="mt-4 bg-transparent" asChild>
                  <Link href="/quicknotes">Browse Notes</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-20 flex flex-col gap-2" asChild>
                <Link href="/mcqs">
                  <Brain className="h-6 w-6" />
                  Take a Quiz
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/quicknotes">
                  <BookOpen className="h-6 w-6" />
                  Review Notes
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                <Link href="/study-planner">
                  <Calendar className="h-6 w-6" />
                  Plan Study
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VideoPlayer } from "@/components/video-player"
import { VideoPlaylist } from "@/components/video-playlist"
import { VideoNotes } from "@/components/video-notes"
import { VideoComments } from "@/components/video-comments"
import { PlayCircle, Clock, BookOpen, Star, Users, TrendingUp, ArrowLeft, Download, Share2 } from "lucide-react"

interface Tutorial {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: number // in minutes
  rating: number
  students: number
  thumbnail: string
  isNew: boolean
  isTrending: boolean
  videoUrl: string
  instructor: string
  chapters: { time: number; title: string }[]
  subtitles: { time: number; text: string }[]
}

interface PlaylistVideo {
  id: string
  title: string
  duration: number
  isCompleted: boolean
  isLocked: boolean
  thumbnail: string
  description: string
  videoUrl: string
}

export default function TutorialsPage() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null)
  const [currentVideoId, setCurrentVideoId] = useState<string>("")
  const [videoProgress, setVideoProgress] = useState<{ [key: string]: number }>({})
  const [currentTime, setCurrentTime] = useState(0)

  const tutorials: Tutorial[] = [
    {
      id: "1",
      title: "Introduction to Semiconductor Physics",
      description: "Learn the fundamental concepts of semiconductor materials, energy bands, and charge carriers.",
      category: "Fundamentals",
      difficulty: "Beginner",
      duration: 45,
      rating: 4.8,
      students: 1250,
      thumbnail: "/placeholder.svg?height=200&width=300",
      isNew: true,
      isTrending: false,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      instructor: "Dr. Sarah Johnson",
      chapters: [
        { time: 0, title: "Introduction" },
        { time: 300, title: "Atomic Structure" },
        { time: 600, title: "Energy Bands" },
        { time: 1200, title: "Charge Carriers" },
        { time: 1800, title: "Summary" },
      ],
      subtitles: [
        { time: 0, text: "Welcome to Introduction to Semiconductor Physics" },
        { time: 5, text: "In this lesson, we'll explore the fundamental concepts" },
        { time: 10, text: "that govern semiconductor behavior" },
      ],
    },
    {
      id: "2",
      title: "MOSFET Operation and Characteristics",
      description: "Deep dive into MOSFET physics, I-V characteristics, and different regions of operation.",
      category: "Devices",
      difficulty: "Intermediate",
      duration: 60,
      rating: 4.9,
      students: 980,
      thumbnail: "/placeholder.svg?height=200&width=300",
      isNew: false,
      isTrending: true,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      instructor: "Prof. Michael Chen",
      chapters: [
        { time: 0, title: "MOSFET Structure" },
        { time: 450, title: "Operating Regions" },
        { time: 900, title: "I-V Characteristics" },
        { time: 1350, title: "Small Signal Model" },
        { time: 1800, title: "Applications" },
      ],
      subtitles: [
        { time: 0, text: "Let's explore MOSFET operation in detail" },
        { time: 5, text: "Starting with the basic structure" },
      ],
    },
    {
      id: "3",
      title: "CMOS Logic Design Fundamentals",
      description: "Master CMOS inverter design, logic gates, and power consumption analysis.",
      category: "Digital Design",
      difficulty: "Intermediate",
      duration: 75,
      rating: 4.7,
      students: 756,
      thumbnail: "/placeholder.svg?height=200&width=300",
      isNew: false,
      isTrending: true,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      instructor: "Dr. Lisa Wang",
      chapters: [
        { time: 0, title: "CMOS Basics" },
        { time: 600, title: "Inverter Design" },
        { time: 1200, title: "Logic Gates" },
        { time: 1800, title: "Power Analysis" },
        { time: 2400, title: "Design Examples" },
      ],
      subtitles: [],
    },
  ]

  // Create playlist videos from tutorial
  const createPlaylistVideos = (tutorial: Tutorial): PlaylistVideo[] => {
    return tutorial.chapters.map((chapter, index) => ({
      id: `${tutorial.id}_${index}`,
      title: chapter.title,
      duration: index < tutorial.chapters.length - 1 ? tutorial.chapters[index + 1].time - chapter.time : 300, // Default 5 minutes for last chapter
      isCompleted: videoProgress[`${tutorial.id}_${index}`] >= 90,
      isLocked: index > 0 && !videoProgress[`${tutorial.id}_${index - 1}`],
      thumbnail: tutorial.thumbnail,
      description: `Chapter ${index + 1} of ${tutorial.title}`,
      videoUrl: tutorial.videoUrl,
    }))
  }

  const handleVideoProgress = (progress: number) => {
    setCurrentTime(progress)
    if (currentVideoId) {
      const progressPercentage = selectedTutorial ? (progress / (selectedTutorial.duration * 60)) * 100 : 0
      setVideoProgress((prev) => ({
        ...prev,
        [currentVideoId]: Math.max(prev[currentVideoId] || 0, progressPercentage),
      }))
    }
  }

  const handleVideoComplete = () => {
    if (currentVideoId) {
      setVideoProgress((prev) => ({
        ...prev,
        [currentVideoId]: 100,
      }))
    }
  }

  const handleVideoSelect = (videoId: string) => {
    setCurrentVideoId(videoId)
    // In a real app, you would load the specific chapter/video
  }

  const seekToTime = (time: number) => {
    setCurrentTime(time)
    // In a real implementation, you would seek the video player to this time
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  // Video Player View
  if (selectedTutorial) {
    const playlistVideos = createPlaylistVideos(selectedTutorial)

    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => setSelectedTutorial(null)} className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutorials
          </Button>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Video Player */}
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer
                videoUrl={selectedTutorial.videoUrl}
                title={selectedTutorial.title}
                description={selectedTutorial.description}
                duration={selectedTutorial.duration * 60}
                onProgress={handleVideoProgress}
                onComplete={handleVideoComplete}
                subtitles={selectedTutorial.subtitles}
                chapters={selectedTutorial.chapters}
              />

              {/* Video Info */}
              <Card className="bg-white/95 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{selectedTutorial.title}</h1>
                      <p className="text-gray-600 mb-4">{selectedTutorial.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{selectedTutorial.students} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{selectedTutorial.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(selectedTutorial.duration)}</span>
                        </div>
                        <Badge className={getDifficultyColor(selectedTutorial.difficulty)}>
                          {selectedTutorial.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedTutorial.instructor
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedTutorial.instructor}</h3>
                        <p className="text-sm text-gray-600">Instructor</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video Comments */}
              <VideoComments videoId={selectedTutorial.id} currentTime={currentTime} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Playlist */}
              <VideoPlaylist
                videos={playlistVideos}
                currentVideoId={currentVideoId || `${selectedTutorial.id}_0`}
                onVideoSelect={handleVideoSelect}
                progress={videoProgress}
              />

              {/* Video Notes */}
              <VideoNotes videoId={selectedTutorial.id} currentTime={currentTime} onSeekTo={seekToTime} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Tutorial List View
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Video Tutorials</h1>
          <p className="text-xl text-white/90">Comprehensive video courses on semiconductor concepts</p>
        </div>

        {/* Featured Section */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Now
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {tutorials
                .filter((t) => t.isTrending)
                .map((tutorial) => (
                  <Card
                    key={tutorial.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedTutorial(tutorial)}
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={tutorial.thumbnail || "/placeholder.svg"}
                        alt={tutorial.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <PlayCircle className="h-16 w-16 text-white/80" />
                      </div>
                      <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{tutorial.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{tutorial.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(tutorial.difficulty)}>{tutorial.difficulty}</Badge>
                          <Badge variant="secondary">{tutorial.category}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDuration(tutorial.duration)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{tutorial.rating}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* All Tutorials */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              All Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial) => (
                <Card
                  key={tutorial.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedTutorial(tutorial)}
                >
                  <div className="aspect-video bg-gray-200 relative">
                    <img
                      src={tutorial.thumbnail || "/placeholder.svg"}
                      alt={tutorial.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <PlayCircle className="h-12 w-12 text-white" />
                    </div>
                    {tutorial.isNew && <Badge className="absolute top-2 left-2 bg-green-600 text-white">New</Badge>}
                    {tutorial.isTrending && (
                      <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{tutorial.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{tutorial.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(tutorial.difficulty)}>{tutorial.difficulty}</Badge>
                      <Badge variant="secondary">{tutorial.category}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(tutorial.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{tutorial.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{tutorial.students}</span>
                      </div>
                    </div>

                    <Button className="w-full">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Watch Tutorial
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <h4 className="font-semibold mb-2">Advanced VLSI Design</h4>
                <p className="text-sm text-gray-600 mb-3">Complete course on VLSI design methodologies</p>
                <Badge variant="outline">Coming in March</Badge>
              </div>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <h4 className="font-semibold mb-2">RF Circuit Design</h4>
                <p className="text-sm text-gray-600 mb-3">Radio frequency circuit design principles</p>
                <Badge variant="outline">Coming in April</Badge>
              </div>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <h4 className="font-semibold mb-2">Power Electronics</h4>
                <p className="text-sm text-gray-600 mb-3">Power semiconductor devices and applications</p>
                <Badge variant="outline">Coming in May</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Master Semiconductors?</h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of students learning with our comprehensive video tutorials
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Start Learning
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                View All Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

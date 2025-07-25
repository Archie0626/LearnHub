"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Clock, CheckCircle, Lock, PlayCircle } from "lucide-react"

interface PlaylistVideo {
  id: string
  title: string
  duration: number
  isCompleted: boolean
  isLocked: boolean
  thumbnail: string
  description: string
}

interface VideoPlaylistProps {
  videos: PlaylistVideo[]
  currentVideoId: string
  onVideoSelect: (videoId: string) => void
  progress: { [videoId: string]: number }
}

export function VideoPlaylist({ videos, currentVideoId, onVideoSelect, progress }: VideoPlaylistProps) {
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null)

  const completedVideos = videos.filter((v) => v.isCompleted).length
  const totalVideos = videos.length
  const overallProgress = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="bg-white/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Course Content</span>
          <Badge variant="secondary">
            {completedVideos}/{totalVideos} completed
          </Badge>
        </CardTitle>
        <div className="space-y-2">
          <Progress value={overallProgress} className="w-full" />
          <p className="text-sm text-gray-600">{Math.round(overallProgress)}% complete</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {videos.map((video, index) => (
          <Card
            key={video.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              currentVideoId === video.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
            } ${video.isLocked ? "opacity-60" : ""}`}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0">
                  <img
                    src={video.thumbnail || "/placeholder.svg?height=60&width=100"}
                    alt={video.title}
                    className="w-20 h-12 object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded">
                    {video.isLocked ? (
                      <Lock className="h-4 w-4 text-white" />
                    ) : video.isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <PlayCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                  {progress[video.id] > 0 && !video.isCompleted && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300 rounded-b">
                      <div className="h-full bg-blue-500 rounded-b" style={{ width: `${progress[video.id]}%` }} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm leading-tight mb-1">
                        {index + 1}. {video.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(video.duration)}</span>
                        {video.isCompleted && (
                          <>
                            <span>•</span>
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-green-600">Completed</span>
                          </>
                        )}
                      </div>
                    </div>

                    {!video.isLocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onVideoSelect(video.id)}
                        className="flex-shrink-0"
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Expandable Description */}
                  {expandedVideo === video.id && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-gray-600">{video.description}</p>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedVideo(expandedVideo === video.id ? null : video.id)}
                    className="mt-1 h-6 px-0 text-xs text-blue-600 hover:text-blue-800"
                  >
                    {expandedVideo === video.id ? "Show less" : "Show more"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

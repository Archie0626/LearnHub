"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Rewind,
  FastForward,
  Subtitles,
  Download,
  Share2,
  BookmarkPlus,
} from "lucide-react"

interface VideoPlayerProps {
  videoUrl: string
  title: string
  description: string
  duration: number
  onProgress?: (progress: number) => void
  onComplete?: () => void
  subtitles?: { time: number; text: string }[]
  chapters?: { time: number; title: string }[]
}

export function VideoPlayer({
  videoUrl,
  title,
  description,
  duration,
  onProgress,
  onComplete,
  subtitles = [],
  chapters = [],
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSubtitles, setShowSubtitles] = useState(false)
  const [currentSubtitle, setCurrentSubtitle] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [quality, setQuality] = useState("720p")
  const [isBuffering, setIsBuffering] = useState(false)

  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const current = video.currentTime
      setCurrentTime(current)
      onProgress?.(current)

      // Update subtitles
      if (showSubtitles && subtitles.length > 0) {
        const currentSub = subtitles.find((sub, index) => {
          const nextSub = subtitles[index + 1]
          return current >= sub.time && (!nextSub || current < nextSub.time)
        })
        setCurrentSubtitle(currentSub?.text || "")
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      onComplete?.()
    }

    const handleWaiting = () => setIsBuffering(true)
    const handleCanPlay = () => setIsBuffering(false)

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("canplay", handleCanPlay)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("canplay", handleCanPlay)
    }
  }, [onProgress, onComplete, showSubtitles, subtitles])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement
    if (!container) return

    if (!isFullscreen) {
      container.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = rate
    setPlaybackRate(rate)
    setShowSettings(false)
  }

  const skipTime = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds))
  }

  const jumpToChapter = (time: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video"
        onMouseMove={showControlsTemporarily}
        onClick={togglePlay}
        poster="/placeholder.svg?height=400&width=800"
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Subtitles */}
      {showSubtitles && currentSubtitle && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded text-center max-w-[80%]">
          {currentSubtitle}
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
        onMouseMove={showControlsTemporarily}
      >
        {/* Play/Pause Button (Center) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlay}
            className="text-white hover:bg-white/20 w-16 h-16 rounded-full"
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Progress Bar */}
          <div className="space-y-1">
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              className="w-full"
              step={0.1}
            />
            <div className="flex justify-between text-xs text-white/80">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <Button variant="ghost" size="sm" onClick={() => skipTime(-10)} className="text-white hover:bg-white/20">
                <Rewind className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => skipTime(10)} className="text-white hover:bg-white/20">
                <FastForward className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                  step={1}
                />
              </div>

              <span className="text-white/80 text-sm">{playbackRate}x</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`text-white hover:bg-white/20 ${showSubtitles ? "bg-white/20" : ""}`}
              >
                <Subtitles className="h-4 w-4" />
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-white hover:bg-white/20"
                >
                  <Settings className="h-4 w-4" />
                </Button>

                {showSettings && (
                  <Card className="absolute bottom-full right-0 mb-2 w-48 bg-black/90 border-white/20">
                    <CardContent className="p-3 space-y-2">
                      <div>
                        <p className="text-white text-sm font-medium mb-2">Playback Speed</p>
                        <div className="grid grid-cols-3 gap-1">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                            <Button
                              key={rate}
                              variant={playbackRate === rate ? "default" : "ghost"}
                              size="sm"
                              onClick={() => changePlaybackRate(rate)}
                              className="text-xs text-white hover:bg-white/20"
                            >
                              {rate}x
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium mb-2">Quality</p>
                        <div className="space-y-1">
                          {["1080p", "720p", "480p", "360p"].map((q) => (
                            <Button
                              key={q}
                              variant={quality === q ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setQuality(q)}
                              className="w-full justify-start text-xs text-white hover:bg-white/20"
                            >
                              {q}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">{title}</h3>
              <p className="text-white/80 text-sm">{description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <BookmarkPlus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Sidebar */}
      {chapters.length > 0 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Card className="w-64 bg-black/90 border-white/20">
            <CardContent className="p-3">
              <h4 className="text-white font-medium mb-2">Chapters</h4>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {chapters.map((chapter, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => jumpToChapter(chapter.time)}
                    className="w-full justify-start text-left text-white hover:bg-white/20 p-2"
                  >
                    <div>
                      <div className="text-xs text-white/60">{formatTime(chapter.time)}</div>
                      <div className="text-sm">{chapter.title}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

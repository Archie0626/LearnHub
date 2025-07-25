"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, Reply, Flag } from "lucide-react"
import { useAuth } from "./auth-provider"

interface Comment {
  id: string
  userId: string
  username: string
  content: string
  timestamp: number
  createdAt: string
  likes: number
  replies: Comment[]
  isLiked: boolean
}

interface VideoCommentsProps {
  videoId: string
  currentTime: number
}

export function VideoComments({ videoId, currentTime }: VideoCommentsProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest")

  useEffect(() => {
    // Load comments from localStorage
    const savedComments = localStorage.getItem(`video_comments_${videoId}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    } else {
      // Mock initial comments
      const mockComments: Comment[] = [
        {
          id: "1",
          userId: "user1",
          username: "john_doe",
          content: "Great explanation of MOSFET operation! The diagrams really helped me understand the concept.",
          timestamp: 120,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          likes: 5,
          replies: [
            {
              id: "1-1",
              userId: "user2",
              username: "jane_smith",
              content: "I agree! The visual representation makes it so much clearer.",
              timestamp: 0,
              createdAt: new Date(Date.now() - 82800000).toISOString(),
              likes: 2,
              replies: [],
              isLiked: false,
            },
          ],
          isLiked: false,
        },
        {
          id: "2",
          userId: "user3",
          username: "mike_wilson",
          content:
            "Could you explain more about the threshold voltage at 3:45? I'm still a bit confused about that part.",
          timestamp: 225,
          createdAt: new Date(Date.now() - 43200000).toISOString(),
          likes: 3,
          replies: [],
          isLiked: false,
        },
      ]
      setComments(mockComments)
    }
  }, [videoId])

  const saveComments = (updatedComments: Comment[]) => {
    setComments(updatedComments)
    localStorage.setItem(`video_comments_${videoId}`, JSON.stringify(updatedComments))
  }

  const addComment = () => {
    if (!newComment.trim() || !user) return

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      content: newComment.trim(),
      timestamp: currentTime,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      isLiked: false,
    }

    const updatedComments = [comment, ...comments]
    saveComments(updatedComments)
    setNewComment("")
  }

  const addReply = (parentId: string) => {
    if (!replyContent.trim() || !user) return

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      userId: user.id,
      username: user.username,
      content: replyContent.trim(),
      timestamp: currentTime,
      createdAt: new Date().toISOString(),
      likes: 0,
      replies: [],
      isLiked: false,
    }

    const updatedComments = comments.map((comment) =>
      comment.id === parentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
    )

    saveComments(updatedComments)
    setReplyingTo(null)
    setReplyContent("")
  }

  const toggleLike = (commentId: string, isReply = false, parentId?: string) => {
    const updatedComments = comments.map((comment) => {
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === commentId
              ? {
                  ...reply,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiked: !reply.isLiked,
                }
              : reply,
          ),
        }
      } else if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked,
        }
      }
      return comment
    })

    saveComments(updatedComments)
  }

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "popular":
        return b.likes - a.likes
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="bg-white/95 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
            <Badge variant="secondary">{comments.length}</Badge>
          </CardTitle>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "popular")}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="popular">Most liked</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Comment */}
        {user ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">Timestamp: {formatTime(currentTime)}</span>
                  <Button onClick={addComment} disabled={!newComment.trim()}>
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>Please log in to add comments</p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sortedComments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.username}</span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                    {comment.timestamp > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {formatTime(comment.timestamp)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(comment.id)}
                      className={`text-xs ${comment.isLiked ? "text-blue-600" : "text-gray-500"}`}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {comment.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(comment.id)}
                      className="text-xs text-gray-500"
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-gray-500">
                      <Flag className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment.id && user && (
                    <div className="mt-3 flex gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          className="min-h-[60px] text-sm"
                        />
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={() => addReply(comment.id)} disabled={!replyContent.trim()}>
                            Reply
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-3 space-y-3 border-l-2 border-gray-200 pl-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {reply.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-xs">{reply.username}</span>
                              <span className="text-xs text-gray-500">{formatTimeAgo(reply.createdAt)}</span>
                            </div>
                            <p className="text-xs text-gray-700 mb-1">{reply.content}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLike(reply.id, true, comment.id)}
                              className={`text-xs ${reply.isLiked ? "text-blue-600" : "text-gray-500"}`}
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {reply.likes}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

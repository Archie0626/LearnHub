"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Plus, Edit, Trash2, Clock } from "lucide-react"

interface VideoNote {
  id: string
  timestamp: number
  content: string
  createdAt: string
}

interface VideoNotesProps {
  videoId: string
  currentTime: number
  onSeekTo: (time: number) => void
}

export function VideoNotes({ videoId, currentTime, onSeekTo }: VideoNotesProps) {
  const [notes, setNotes] = useState<VideoNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem(`video_notes_${videoId}`)
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [videoId])

  const saveNotes = (updatedNotes: VideoNote[]) => {
    setNotes(updatedNotes)
    localStorage.setItem(`video_notes_${videoId}`, JSON.stringify(updatedNotes))
  }

  const addNote = () => {
    if (!newNote.trim()) return

    const note: VideoNote = {
      id: Date.now().toString(),
      timestamp: currentTime,
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
    }

    const updatedNotes = [...notes, note].sort((a, b) => a.timestamp - b.timestamp)
    saveNotes(updatedNotes)
    setNewNote("")
  }

  const updateNote = (noteId: string) => {
    if (!editContent.trim()) return

    const updatedNotes = notes.map((note) => (note.id === noteId ? { ...note, content: editContent.trim() } : note))
    saveNotes(updatedNotes)
    setEditingNote(null)
    setEditContent("")
  }

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    saveNotes(updatedNotes)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="bg-white/95 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Video Notes
          <Badge variant="secondary">{notes.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Note */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Current time: {formatTime(currentTime)}</span>
          </div>
          <Textarea
            placeholder="Add a note at the current timestamp..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[80px]"
          />
          <Button onClick={addNote} disabled={!newNote.trim()} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>

        {/* Notes List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No notes yet. Add your first note!</p>
            </div>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSeekTo(note.timestamp)}
                      className="text-blue-600 hover:text-blue-800 p-0 h-auto font-mono text-sm"
                    >
                      {formatTime(note.timestamp)}
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingNote(note.id)
                          setEditContent(note.content)
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  {editingNote === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateNote(note.id)}>
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingNote(null)
                            setEditContent("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                  )}

                  <div className="text-xs text-gray-500 mt-2">{new Date(note.createdAt).toLocaleDateString()}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

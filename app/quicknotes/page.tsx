"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Bookmark, BookmarkCheck, Download, Printer, Volume2, Filter, Clock } from "lucide-react"

interface QuickNote {
  id: string
  title: string
  content: string
  category: string
  readTime: number
  isBookmarked: boolean
  tags: string[]
  lastUpdated: string
}

export default function QuicknotesPage() {
  const [notes, setNotes] = useState<QuickNote[]>([])
  const [filteredNotes, setFilteredNotes] = useState<QuickNote[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [bookmarkedNotes, setBookmarkedNotes] = useState<string[]>([])

  const categories = ["All", "Devices", "Fabrication", "Logic Design", "Materials", "Physics", "Circuits"]

  useEffect(() => {
    // Load bookmarked notes from localStorage
    const saved = localStorage.getItem("bookmarked_notes")
    if (saved) {
      const bookmarked = JSON.parse(saved)
      setBookmarkedNotes(bookmarked.map((note: any) => note.id))
    }

    // Mock data - in real app, fetch from API
    const mockNotes: QuickNote[] = [
      {
        id: "1",
        title: "MOSFET in 5 Minutes",
        content: `# MOSFET Basics

## What is a MOSFET?
- **M**etal **O**xide **S**emiconductor **F**ield **E**ffect **T**ransistor
- Acts as a voltage-controlled switch
- Building block of modern digital circuits

## Key Components:
• **Gate**: Controls the transistor (like a switch)
• **Source**: Where current enters
• **Drain**: Where current exits
• **Body/Substrate**: The base material

## Types:
1. **NMOS**: Conducts when gate voltage is HIGH
2. **PMOS**: Conducts when gate voltage is LOW

## Key Equation:
I_D = μ_n C_ox (W/L) [(V_GS - V_th)V_DS - V_DS²/2]

## Applications:
- Digital logic gates
- Memory cells
- Power switches
- Amplifiers`,
        category: "Devices",
        readTime: 5,
        isBookmarked: false,
        tags: ["transistor", "switching", "digital"],
        lastUpdated: "2024-01-15",
      },
      {
        id: "2",
        title: "Doping Process Quick Guide",
        content: `# Semiconductor Doping

## What is Doping?
Adding impurities to pure silicon to change its electrical properties.

## Types of Doping:

### N-Type Doping
- **Dopant**: Phosphorus, Arsenic, Antimony
- **Effect**: Extra electrons (negative charge carriers)
- **Conductivity**: Increased

### P-Type Doping
- **Dopant**: Boron, Aluminum, Gallium
- **Effect**: Creates "holes" (positive charge carriers)
- **Conductivity**: Increased

## Doping Methods:
1. **Ion Implantation**: High-energy ions shot into silicon
2. **Diffusion**: Dopants heated and diffused into wafer
3. **Epitaxial Growth**: Growing doped layers

## Key Points:
• Concentration typically 10¹⁵ - 10¹⁹ atoms/cm³
• Higher doping = lower resistance
• Creates P-N junctions when combined`,
        category: "Fabrication",
        readTime: 3,
        isBookmarked: false,
        tags: ["doping", "fabrication", "silicon"],
        lastUpdated: "2024-01-14",
      },
      {
        id: "3",
        title: "CMOS Logic Gates",
        content: `# CMOS Logic Gates

## What is CMOS?
**C**omplementary **M**etal **O**xide **S**emiconductor
- Uses both NMOS and PMOS transistors
- Low power consumption
- High noise immunity

## Basic Gates:

### NOT Gate (Inverter)
- 1 PMOS + 1 NMOS
- Input HIGH → Output LOW
- Input LOW → Output HIGH

### NAND Gate
- 2 PMOS in parallel + 2 NMOS in series
- Output LOW only when both inputs HIGH

### NOR Gate
- 2 PMOS in series + 2 NMOS in parallel
- Output HIGH only when both inputs LOW

## Advantages:
✓ Very low static power consumption
✓ High integration density
✓ Good noise margins
✓ Wide supply voltage range

## Power Consumption:
P = P_static + P_dynamic
P_dynamic = α × C_L × V_DD² × f`,
        category: "Logic Design",
        readTime: 4,
        isBookmarked: false,
        tags: ["CMOS", "logic gates", "power"],
        lastUpdated: "2024-01-13",
      },
    ]

    // Update bookmark status
    const updatedNotes = mockNotes.map((note) => ({
      ...note,
      isBookmarked: bookmarkedNotes.includes(note.id),
    }))

    setNotes(updatedNotes)
    setFilteredNotes(updatedNotes)
  }, [])

  useEffect(() => {
    let filtered = notes

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((note) => note.category === selectedCategory)
    }

    setFilteredNotes(filtered)
  }, [notes, searchQuery, selectedCategory])

  const toggleBookmark = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return

    const updatedBookmarks = bookmarkedNotes.includes(noteId)
      ? bookmarkedNotes.filter((id) => id !== noteId)
      : [...bookmarkedNotes, noteId]

    setBookmarkedNotes(updatedBookmarks)

    // Update localStorage
    const bookmarkedNotesData = notes
      .filter((n) => updatedBookmarks.includes(n.id))
      .map((n) => ({
        id: n.id,
        title: n.title,
        category: n.category,
        dateBookmarked: new Date().toISOString(),
      }))

    localStorage.setItem("bookmarked_notes", JSON.stringify(bookmarkedNotesData))

    // Update notes state
    setNotes(notes.map((n) => (n.id === noteId ? { ...n, isBookmarked: !n.isBookmarked } : n)))
  }

  const downloadPDF = (note: QuickNote) => {
    // In a real app, you would use jsPDF here
    const element = document.createElement("a")
    const file = new Blob([note.content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${note.title.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const printNote = (note: QuickNote) => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${note.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${note.title}</h1>
            <pre>${note.content}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const speakNote = (content: string) => {
    if ("speechSynthesis" in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(content.replace(/[#*•]/g, ""))
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Quick Notes</h1>
          <p className="text-xl text-white/90">Bite-sized semiconductor concepts for quick learning</p>
        </div>

        {/* Controls */}
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes, tags, and content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Category:</span>
                <div className="flex flex-wrap gap-1">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Grid */}
        <div className="grid gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="bg-white/95 backdrop-blur">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{note.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{note.readTime} min read</span>
                      </div>
                      <Badge variant="secondary">{note.category}</Badge>
                      <span>Updated: {new Date(note.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleBookmark(note.id)}>
                      {note.isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => speakNote(note.content)}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => downloadPDF(note)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => printNote(note)}>
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{note.content}</pre>
                </div>

                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <Card className="bg-white/95 backdrop-blur">
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No notes found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Bookmark, BookmarkCheck, MessageSquare, Building, User, ThumbsUp, Eye } from "lucide-react"

interface InterviewQuestion {
  id: string
  question: string
  answer: string
  company: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  tags: string[]
  views: number
  likes: number
  isBookmarked: boolean
  userNotes?: string
  submittedBy: string
  dateSubmitted: string
}

export default function InterviewQAPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<InterviewQuestion[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "views">("popular")
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)
  const [userNotes, setUserNotes] = useState<{ [key: string]: string }>({})

  const companies = ["All", "Intel", "AMD", "NVIDIA", "Qualcomm", "Broadcom", "Apple", "Samsung"]
  const difficulties = ["All", "Easy", "Medium", "Hard"]
  const categories = [
    "All",
    "Analog Design",
    "Digital Design",
    "VLSI",
    "Device Physics",
    "Fabrication",
    "Memory Design",
  ]

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockQuestions: InterviewQuestion[] = [
      {
        id: "1",
        question: "Explain the working principle of a MOSFET and its different regions of operation.",
        answer: `A MOSFET (Metal-Oxide-Semiconductor Field-Effect Transistor) works based on the field effect principle:

Structure:
- Gate (G): Controls the transistor
- Source (S): Current enters here
- Drain (D): Current exits here  
- Body/Substrate (B): Base semiconductor material

Working Principle:
When voltage is applied to the gate, it creates an electric field that either attracts or repels charge carriers in the channel between source and drain.

Regions of Operation:

1. Cut-off Region (VGS < Vth):
   - No channel formation
   - ID ≈ 0 (only leakage current)
   - Transistor acts as open switch

2. Linear/Triode Region (VGS > Vth, VDS < VGS - Vth):
   - Channel exists but not pinched off
   - ID = μnCox(W/L)[(VGS - Vth)VDS - VDS²/2]
   - Acts as voltage-controlled resistor

3. Saturation Region (VGS > Vth, VDS ≥ VGS - Vth):
   - Channel pinched off at drain end
   - ID = (μnCox/2)(W/L)(VGS - Vth)²
   - Current independent of VDS
   - Used for amplification

Key Parameters:
- Vth: Threshold voltage
- μn: Electron mobility  
- Cox: Gate oxide capacitance
- W/L: Width to length ratio`,
        company: "Intel",
        difficulty: "Medium",
        category: "Device Physics",
        tags: ["MOSFET", "transistor", "regions", "IV characteristics"],
        views: 1250,
        likes: 89,
        isBookmarked: false,
        submittedBy: "john_doe",
        dateSubmitted: "2024-01-15",
      },
      {
        id: "2",
        question: "What is the difference between NMOS and PMOS transistors? How are they used in CMOS?",
        answer: `**NMOS vs PMOS Transistors:**

NMOS (N-channel MOSFET):
- Uses electrons as majority carriers
- Substrate is P-type silicon
- Source/Drain are N+ regions
- Conducts when VGS > Vth (positive threshold)
- Faster switching (higher electron mobility)
- Good at passing '0' (VSS)
- Poor at passing '1' (VDD - Vth)

PMOS (P-channel MOSFET):
- Uses holes as majority carriers  
- Substrate is N-type silicon (or N-well in P-substrate)
- Source/Drain are P+ regions
- Conducts when VGS < Vth (negative threshold)
- Slower switching (lower hole mobility)
- Good at passing '1' (VDD)
- Poor at passing '0' (VSS + |Vth|)

CMOS Usage:
CMOS (Complementary MOS) uses both NMOS and PMOS together:

1. Complementary Operation:
   - When input is HIGH: NMOS ON, PMOS OFF
   - When input is LOW: NMOS OFF, PMOS ON
   - Never both ON simultaneously (ideally)

2. Advantages:
   - Very low static power consumption
   - Full voltage swing (0V to VDD)
   - High noise immunity
   - Good drive capability

3. Example - CMOS Inverter:
   - PMOS connected between VDD and output
   - NMOS connected between output and VSS
   - Both gates connected to input
   - Output is complement of input

Applications:
- Logic gates (AND, OR, NOT, etc.)
- Memory cells (SRAM, DRAM)
- Analog circuits (op-amps, comparators)`,
        company: "AMD",
        difficulty: "Medium",
        category: "Digital Design",
        tags: ["NMOS", "PMOS", "CMOS", "complementary"],
        views: 980,
        likes: 67,
        isBookmarked: false,
        submittedBy: "jane_smith",
        dateSubmitted: "2024-01-14",
      },
      {
        id: "3",
        question: "Explain the concept of doping in semiconductors and its effects on conductivity.",
        answer: `**Doping in Semiconductors:**

Doping is the process of adding impurities to pure (intrinsic) semiconductor material to modify its electrical properties.

Pure Silicon:
- 4 valence electrons
- Forms covalent bonds with 4 neighboring atoms
- Very low conductivity at room temperature
- Equal number of electrons and holes

Types of Doping:

1. N-Type Doping:
- Dopants: Group V elements (P, As, Sb)
- Valence electrons: 5
- Effect: Extra electron becomes free carrier
- Majority carriers: Electrons
- Minority carriers: Holes
- Conductivity: Increased significantly

2. P-Type Doping:
- Dopants: Group III elements (B, Al, Ga)  
- Valence electrons: 3
- Effect: Creates "hole" (missing electron)
- Majority carriers: Holes
- Minority carriers: Electrons
- Conductivity: Increased significantly

Effects on Conductivity:

Conductivity Formula:
σ = q(nμn + pμp)

Where:
- σ = conductivity
- q = electronic charge
- n = electron concentration
- p = hole concentration  
- μn, μp = electron and hole mobilities

Doping Effects:
1. Increased Carrier Concentration:
   - N-type: n >> ni (intrinsic concentration)
   - P-type: p >> ni

2. Fermi Level Shift:
   - N-type: EF moves toward conduction band
   - P-type: EF moves toward valence band

3. Temperature Dependence:
   - Lightly doped: temperature dependent
   - Heavily doped: less temperature sensitive

Applications:
- P-N junction formation
- Transistor operation
- Solar cells
- Diodes and rectifiers`,
        company: "NVIDIA",
        difficulty: "Easy",
        category: "Device Physics",
        tags: ["doping", "N-type", "P-type", "conductivity"],
        views: 756,
        likes: 45,
        isBookmarked: false,
        submittedBy: "mike_wilson",
        dateSubmitted: "2024-01-13",
      },
    ]

    setQuestions(mockQuestions)
    setFilteredQuestions(mockQuestions)

    // Load user notes from localStorage
    const savedNotes = localStorage.getItem("interview_notes")
    if (savedNotes) {
      setUserNotes(JSON.parse(savedNotes))
    }
  }, [])

  useEffect(() => {
    let filtered = questions

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by company
    if (selectedCompany !== "All") {
      filtered = filtered.filter((q) => q.company === selectedCompany)
    }

    // Filter by difficulty
    if (selectedDifficulty !== "All") {
      filtered = filtered.filter((q) => q.difficulty === selectedDifficulty)
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((q) => q.category === selectedCategory)
    }

    // Sort questions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likes - a.likes
        case "views":
          return b.views - a.views
        case "recent":
          return new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
        default:
          return 0
      }
    })

    setFilteredQuestions(filtered)
  }, [questions, searchQuery, selectedCompany, selectedDifficulty, selectedCategory, sortBy])

  const toggleBookmark = (questionId: string) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q)))
  }

  const likeQuestion = (questionId: string) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, likes: q.likes + 1 } : q)))
  }

  const saveUserNote = (questionId: string, note: string) => {
    const updatedNotes = { ...userNotes, [questionId]: note }
    setUserNotes(updatedNotes)
    localStorage.setItem("interview_notes", JSON.stringify(updatedNotes))
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Interview Q&A</h1>
          <p className="text-xl text-white/90">Real interview questions from top semiconductor companies</p>
        </div>

        {/* Filters */}
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions, answers, and tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Controls */}
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Company</label>
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "recent" | "popular" | "views")}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="popular">Most Liked</option>
                  <option value="views">Most Viewed</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((question) => (
            <Card key={question.id} className="bg-white/95 backdrop-blur">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg leading-relaxed pr-4">{question.question}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{question.company}</span>
                      </div>
                      <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                      <Badge variant="secondary">{question.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{question.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{question.likes}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => toggleBookmark(question.id)}>
                      {question.isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => likeQuestion(question.id)}>
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedQuestion === question.id && (
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {question.answer}
                    </pre>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* User Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Notes:</label>
                    <Textarea
                      placeholder="Add your personal notes about this question..."
                      value={userNotes[question.id] || ""}
                      onChange={(e) => saveUserNote(question.id, e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* Question Meta */}
                  <div className="text-xs text-gray-500 border-t pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Submitted by {question.submittedBy}</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(question.dateSubmitted).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              )}

              <div className="px-6 pb-4">
                <Button
                  variant="outline"
                  onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                  className="w-full"
                >
                  {expandedQuestion === question.id ? "Hide Answer" : "View Answer"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <Card className="bg-white/95 backdrop-blur">
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No questions found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Check, Clock, Target, Lightbulb, Share, Download, Moon, Sun } from "lucide-react"

interface StudyGoal {
  id: string
  title: string
  description: string
  category: string
  dueDate: string
  isCompleted: boolean
  priority: "Low" | "Medium" | "High"
  estimatedTime: number // in minutes
}

interface StudyTemplate {
  id: string
  name: string
  level: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  goals: Omit<StudyGoal, "id" | "isCompleted">[]
}

export default function StudyPlannerPage() {
  const [goals, setGoals] = useState<StudyGoal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "General",
    dueDate: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    estimatedTime: 60,
  })

  const categories = ["General", "MOSFET", "CMOS", "Analog Design", "Digital Design", "Memory", "Fabrication"]

  const templates: StudyTemplate[] = [
    {
      id: "beginner",
      name: "Semiconductor Fundamentals",
      level: "Beginner",
      duration: "4 weeks",
      goals: [
        {
          title: "Learn Basic Semiconductor Physics",
          description: "Understand atoms, electrons, and basic semiconductor properties",
          category: "General",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          priority: "High",
          estimatedTime: 120,
        },
        {
          title: "Study P-N Junction",
          description: "Learn about P-N junction formation and characteristics",
          category: "General",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          priority: "High",
          estimatedTime: 90,
        },
        {
          title: "Introduction to Diodes",
          description: "Understand diode operation and applications",
          category: "General",
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          priority: "Medium",
          estimatedTime: 75,
        },
      ],
    },
    {
      id: "intermediate",
      name: "MOSFET and CMOS Design",
      level: "Intermediate",
      duration: "6 weeks",
      goals: [
        {
          title: "Master MOSFET Operation",
          description: "Deep dive into MOSFET physics and characteristics",
          category: "MOSFET",
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          priority: "High",
          estimatedTime: 150,
        },
        {
          title: "CMOS Logic Design",
          description: "Learn CMOS inverter and logic gate design",
          category: "CMOS",
          dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          priority: "High",
          estimatedTime: 180,
        },
        {
          title: "Power and Performance Analysis",
          description: "Analyze power consumption and performance metrics",
          category: "CMOS",
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          priority: "Medium",
          estimatedTime: 120,
        },
      ],
    },
    {
      id: "advanced",
      name: "Advanced VLSI Design",
      level: "Advanced",
      duration: "8 weeks",
      goals: [
        {
          title: "Memory Design Principles",
          description: "Study SRAM, DRAM, and Flash memory design",
          category: "Memory",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          priority: "High",
          estimatedTime: 200,
        },
        {
          title: "Analog Circuit Design",
          description: "Learn op-amp and analog circuit design techniques",
          category: "Analog Design",
          dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          priority: "High",
          estimatedTime: 240,
        },
        {
          title: "Fabrication Process",
          description: "Understand semiconductor fabrication and process technology",
          category: "Fabrication",
          dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          priority: "Medium",
          estimatedTime: 180,
        },
      ],
    },
  ]

  const studyTips = [
    "Break complex topics into smaller, manageable chunks",
    "Use active recall - test yourself regularly",
    "Create visual diagrams for circuit concepts",
    "Practice problems daily, even if just for 15 minutes",
    "Join study groups or online communities",
    "Take regular breaks using the Pomodoro technique",
    "Review previous topics weekly to maintain retention",
    "Apply concepts through hands-on projects when possible",
  ]

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem("study_goals")
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }

    // Load dark mode preference
    const darkMode = localStorage.getItem("dark_mode") === "true"
    setIsDarkMode(darkMode)
  }, [])

  const saveGoals = (updatedGoals: StudyGoal[]) => {
    setGoals(updatedGoals)
    localStorage.setItem("study_goals", JSON.stringify(updatedGoals))
  }

  const addGoal = () => {
    if (!newGoal.title.trim()) return

    const goal: StudyGoal = {
      id: Date.now().toString(),
      ...newGoal,
      isCompleted: false,
    }

    saveGoals([...goals, goal])
    setNewGoal({
      title: "",
      description: "",
      category: "General",
      dueDate: "",
      priority: "Medium",
      estimatedTime: 60,
    })
    setShowAddGoal(false)
  }

  const toggleGoalCompletion = (goalId: string) => {
    const updatedGoals = goals.map((goal) => (goal.id === goalId ? { ...goal, isCompleted: !goal.isCompleted } : goal))
    saveGoals(updatedGoals)
  }

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter((goal) => goal.id !== goalId)
    saveGoals(updatedGoals)
  }

  const loadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (!template) return

    const templateGoals: StudyGoal[] = template.goals.map((goal, index) => ({
      ...goal,
      id: `${templateId}_${index}`,
      isCompleted: false,
    }))

    saveGoals([...goals, ...templateGoals])
    setSelectedTemplate(null)
  }

  const exportPlan = () => {
    const planData = {
      goals,
      exportDate: new Date().toISOString(),
      totalGoals: goals.length,
      completedGoals: goals.filter((g) => g.isCompleted).length,
    }

    const dataStr = JSON.stringify(planData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = "study-plan.json"
    link.click()

    URL.revokeObjectURL(url)
  }

  const sharePlan = () => {
    const shareText = `My LearnHub Study Plan:\n${goals.length} goals, ${goals.filter((g) => g.isCompleted).length} completed\n\nJoin me at LearnHub!`

    if (navigator.share) {
      navigator.share({
        title: "My Study Plan",
        text: shareText,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert("Study plan copied to clipboard!")
    }
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem("dark_mode", newDarkMode.toString())
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const completedGoals = goals.filter((g) => g.isCompleted).length
  const totalGoals = goals.length
  const completionPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isDarkMode ? "dark" : ""}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Study Planner</h1>
            <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="text-white hover:bg-white/20">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-xl text-white/90">Organize your semiconductor learning journey</p>
        </div>

        {/* Progress Overview */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalGoals}</div>
                <div className="text-sm text-blue-800">Total Goals</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
                <div className="text-sm text-green-800">Completed</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{totalGoals - completedGoals}</div>
                <div className="text-sm text-orange-800">Remaining</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{completionPercentage}%</div>
                <div className="text-sm text-purple-800">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Study Goals */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Study Goals
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedTemplate("templates")}>
                      Load Template
                    </Button>
                    <Button size="sm" onClick={() => setShowAddGoal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Goal
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Goal Form */}
                {showAddGoal && (
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="p-4 space-y-4">
                      <Input
                        placeholder="Goal title..."
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      />
                      <Textarea
                        placeholder="Goal description..."
                        value={newGoal.description}
                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                      />
                      <div className="grid md:grid-cols-4 gap-4">
                        <select
                          value={newGoal.category}
                          onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                          className="p-2 border rounded-md"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <select
                          value={newGoal.priority}
                          onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as any })}
                          className="p-2 border rounded-md"
                        >
                          <option value="Low">Low Priority</option>
                          <option value="Medium">Medium Priority</option>
                          <option value="High">High Priority</option>
                        </select>
                        <Input
                          type="date"
                          value={newGoal.dueDate}
                          onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Minutes"
                          value={newGoal.estimatedTime}
                          onChange={(e) =>
                            setNewGoal({ ...newGoal, estimatedTime: Number.parseInt(e.target.value) || 60 })
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={addGoal}>Add Goal</Button>
                        <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Goals List */}
                {goals.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No study goals yet. Add your first goal or load a template!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {goals.map((goal) => (
                      <Card
                        key={goal.id}
                        className={`border-l-4 ${goal.isCompleted ? "border-green-500 bg-green-50" : "border-blue-500"}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleGoalCompletion(goal.id)}
                                className="mt-1"
                              >
                                <Check className={`h-4 w-4 ${goal.isCompleted ? "text-green-600" : "text-gray-400"}`} />
                              </Button>
                              <div className="flex-1">
                                <h4 className={`font-semibold ${goal.isCompleted ? "line-through text-gray-500" : ""}`}>
                                  {goal.title}
                                </h4>
                                {goal.description && (
                                  <p className={`text-sm mt-1 ${goal.isCompleted ? "text-gray-400" : "text-gray-600"}`}>
                                    {goal.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                  <Badge variant="secondary">{goal.category}</Badge>
                                  <Badge className={getPriorityColor(goal.priority)}>{goal.priority}</Badge>
                                  {goal.dueDate && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Calendar className="h-3 w-3" />
                                      <span>{new Date(goal.dueDate).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    <span>{goal.estimatedTime} min</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteGoal(goal.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ×
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={exportPlan}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Plan
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={sharePlan}>
                  <Share className="h-4 w-4 mr-2" />
                  Share Plan
                </Button>
              </CardContent>
            </Card>

            {/* Study Tips */}
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Study Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studyTips.slice(0, 4).map((tip, index) => (
                    <div key={index} className="text-sm p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-800">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Templates Modal */}
        {selectedTemplate === "templates" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Study Plan Templates</CardTitle>
                  <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <Card key={template.id} className="border-2 hover:border-blue-500 transition-colors">
                      <CardHeader>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{template.level}</Badge>
                          <Badge variant="outline">{template.duration}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {template.goals.map((goal, index) => (
                            <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                              <div className="font-medium">{goal.title}</div>
                              <div className="text-gray-600 text-xs">
                                {goal.category} • {goal.estimatedTime} min
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full" onClick={() => loadTemplate(template.id)}>
                          Load Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

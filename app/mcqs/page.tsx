"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Clock, CheckCircle, XCircle, RotateCcw, Trophy, Target } from "lucide-react"

interface MCQOption {
  id: string
  text: string
  isCorrect: boolean
}

interface MCQQuestion {
  id: string
  question: string
  options: MCQOption[]
  explanation: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  diagram?: string
}

interface QuizSession {
  questions: MCQQuestion[]
  currentQuestionIndex: number
  answers: { [questionId: string]: string }
  score: number
  isCompleted: boolean
  timeStarted: number
  timeLimit?: number
}

export default function MCQsPage() {
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [quizType, setQuizType] = useState<"topic" | "random" | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string>("")

  const topics = ["MOSFET", "CMOS Logic", "Doping", "P-N Junction", "Memory Devices", "Fabrication"]

  // Mock questions data
  const mockQuestions: MCQQuestion[] = [
    {
      id: "1",
      question: "What does MOSFET stand for?",
      options: [
        { id: "a", text: "Metal-Oxide-Semiconductor Field-Effect Transistor", isCorrect: true },
        { id: "b", text: "Metal-Organic-Silicon Field-Effect Transistor", isCorrect: false },
        { id: "c", text: "Metal-Oxide-Silicon Frequency-Effect Transistor", isCorrect: false },
        { id: "d", text: "Metal-Organic-Semiconductor Field-Effect Transistor", isCorrect: false },
      ],
      explanation:
        "MOSFET stands for Metal-Oxide-Semiconductor Field-Effect Transistor. It is a type of transistor used for switching and amplifying electronic signals.",
      category: "MOSFET",
      difficulty: "Easy",
    },
    {
      id: "2",
      question: "In CMOS technology, what happens when both NMOS and PMOS transistors are OFF?",
      options: [
        { id: "a", text: "High current flows", isCorrect: false },
        { id: "b", text: "No static current flows", isCorrect: true },
        { id: "c", text: "Output is undefined", isCorrect: false },
        { id: "d", text: "Circuit becomes unstable", isCorrect: false },
      ],
      explanation:
        "In CMOS, when both transistors are OFF, no static current flows, which is why CMOS has very low static power consumption.",
      category: "CMOS Logic",
      difficulty: "Medium",
    },
    {
      id: "3",
      question: "Which dopant is commonly used to create N-type silicon?",
      options: [
        { id: "a", text: "Boron", isCorrect: false },
        { id: "b", text: "Phosphorus", isCorrect: true },
        { id: "c", text: "Aluminum", isCorrect: false },
        { id: "d", text: "Gallium", isCorrect: false },
      ],
      explanation:
        "Phosphorus is a Group V element with 5 valence electrons. When added to silicon (Group IV), it provides an extra electron, creating N-type semiconductor.",
      category: "Doping",
      difficulty: "Easy",
    },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (quizSession && !quizSession.isCompleted && timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Time's up - auto submit
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [quizSession, timeRemaining])

  const startQuiz = (type: "topic" | "random", topic?: string, timed = false) => {
    let questions = mockQuestions

    if (type === "topic" && topic) {
      questions = mockQuestions.filter((q) => q.category === topic)
    }

    // Shuffle questions for random quiz
    if (type === "random") {
      questions = [...mockQuestions].sort(() => Math.random() - 0.5)
    }

    const session: QuizSession = {
      questions: questions.slice(0, 5), // Limit to 5 questions
      currentQuestionIndex: 0,
      answers: {},
      score: 0,
      isCompleted: false,
      timeStarted: Date.now(),
      timeLimit: timed ? 300 : undefined, // 5 minutes if timed
    }

    setQuizSession(session)
    setSelectedAnswer("")
    setShowExplanation(false)
    setTimeRemaining(timed ? 300 : null)
  }

  const handleAnswerSelect = (optionId: string) => {
    if (showExplanation) return
    setSelectedAnswer(optionId)
  }

  const handleSubmitAnswer = () => {
    if (!quizSession || !selectedAnswer) return

    const currentQuestion = quizSession.questions[quizSession.currentQuestionIndex]
    const isCorrect = currentQuestion.options.find((opt) => opt.id === selectedAnswer)?.isCorrect || false

    const updatedAnswers = {
      ...quizSession.answers,
      [currentQuestion.id]: selectedAnswer,
    }

    const updatedScore = isCorrect ? quizSession.score + 1 : quizSession.score

    setQuizSession({
      ...quizSession,
      answers: updatedAnswers,
      score: updatedScore,
    })

    setShowExplanation(true)
  }

  const handleNextQuestion = () => {
    if (!quizSession) return

    const nextIndex = quizSession.currentQuestionIndex + 1

    if (nextIndex >= quizSession.questions.length) {
      // Quiz completed
      setQuizSession({
        ...quizSession,
        isCompleted: true,
      })

      // Save score to localStorage
      const scores = JSON.parse(localStorage.getItem("quiz_scores") || "[]")
      scores.push({
        score: quizSession.score,
        total: quizSession.questions.length,
        date: new Date().toISOString(),
        type: quizType,
      })
      localStorage.setItem("quiz_scores", JSON.stringify(scores))
    } else {
      setQuizSession({
        ...quizSession,
        currentQuestionIndex: nextIndex,
      })
      setSelectedAnswer("")
      setShowExplanation(false)
    }
  }

  const handleTimeUp = () => {
    if (!quizSession) return

    setQuizSession({
      ...quizSession,
      isCompleted: true,
    })
  }

  const resetQuiz = () => {
    setQuizSession(null)
    setQuizType(null)
    setSelectedTopic("")
    setTimeRemaining(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!quizSession) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">MCQ Practice</h1>
            <p className="text-xl text-white/90">Test your semiconductor knowledge with interactive quizzes</p>
          </div>

          {/* Quiz Type Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className="bg-white/95 backdrop-blur hover:scale-105 transition-transform cursor-pointer"
              onClick={() => setQuizType("topic")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-blue-600" />
                  Topic-wise Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Focus on specific semiconductor topics</p>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <Badge key={topic} variant="outline">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-white/95 backdrop-blur hover:scale-105 transition-transform cursor-pointer"
              onClick={() => startQuiz("random")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  Random Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Mixed questions from all topics</p>
                <div className="mt-4 space-y-2">
                  <Button className="w-full" onClick={() => startQuiz("random")}>
                    Start Random Quiz
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => startQuiz("random", undefined, true)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Timed Quiz (5 min)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Topic Selection */}
          {quizType === "topic" && (
            <Card className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle>Select a Topic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {topics.map((topic) => (
                    <Button
                      key={topic}
                      variant={selectedTopic === topic ? "default" : "outline"}
                      onClick={() => setSelectedTopic(topic)}
                      className="h-20 flex flex-col gap-2"
                    >
                      <span className="font-semibold">{topic}</span>
                      <span className="text-xs opacity-70">
                        {mockQuestions.filter((q) => q.category === topic).length} questions
                      </span>
                    </Button>
                  ))}
                </div>
                {selectedTopic && (
                  <div className="mt-6 space-y-2">
                    <Button className="w-full" onClick={() => startQuiz("topic", selectedTopic)}>
                      Start {selectedTopic} Quiz
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => startQuiz("topic", selectedTopic, true)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Timed Quiz (5 min)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  }

  if (quizSession.isCompleted) {
    const percentage = Math.round((quizSession.score / quizSession.questions.length) * 100)

    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card className="bg-white/95 backdrop-blur text-center">
            <CardHeader>
              <div className="w-20 h-20 bg-gradient-to-r from-[#FFB996] to-[#FFCF81] rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {quizSession.score}/{quizSession.questions.length}
                </div>
                <div className="text-xl text-gray-600">{percentage}% Correct</div>
              </div>

              <Progress value={percentage} className="w-full" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-800">Correct</div>
                  <div className="text-2xl font-bold text-green-600">{quizSession.score}</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="font-semibold text-red-800">Incorrect</div>
                  <div className="text-2xl font-bold text-red-600">
                    {quizSession.questions.length - quizSession.score}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" onClick={resetQuiz}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Take Another Quiz
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => (window.location.href = "/profile")}
                >
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = quizSession.questions[quizSession.currentQuestionIndex]
  const progress = ((quizSession.currentQuestionIndex + 1) / quizSession.questions.length) * 100

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress Header */}
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  Question {quizSession.currentQuestionIndex + 1} of {quizSession.questions.length}
                </span>
                <Badge variant="outline">{currentQuestion.difficulty}</Badge>
                <Badge variant="secondary">{currentQuestion.category}</Badge>
              </div>
              {timeRemaining !== null && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className={timeRemaining < 60 ? "text-red-600 font-bold" : ""}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>
            <Progress value={progress} className="w-full" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                let buttonClass = "w-full text-left p-4 border-2 transition-all"

                if (showExplanation) {
                  if (option.isCorrect) {
                    buttonClass += " border-green-500 bg-green-50 text-green-800"
                  } else if (selectedAnswer === option.id) {
                    buttonClass += " border-red-500 bg-red-50 text-red-800"
                  } else {
                    buttonClass += " border-gray-200 bg-gray-50 text-gray-600"
                  }
                } else if (selectedAnswer === option.id) {
                  buttonClass += " border-blue-500 bg-blue-50 text-blue-800"
                } else {
                  buttonClass += " border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={buttonClass}
                    disabled={showExplanation}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                        {option.id.toUpperCase()}
                      </div>
                      <span>{option.text}</span>
                      {showExplanation && option.isCorrect && (
                        <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                      )}
                      {showExplanation && selectedAnswer === option.id && !option.isCorrect && (
                        <XCircle className="h-5 w-5 text-red-600 ml-auto" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                <p className="text-blue-700">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!showExplanation ? (
                <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="flex-1">
                  Submit Answer
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} className="flex-1">
                  {quizSession.currentQuestionIndex + 1 >= quizSession.questions.length
                    ? "Finish Quiz"
                    : "Next Question"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

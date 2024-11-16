'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, Video, FileText, CheckCircle, AlertCircle, Filter, Play, BarChart } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const patientData = {
  name: "John Doe",
  treatments: ["Orthodontics", "Periodontal Care"],
  riskFactors: ["Gingivitis"],
}

const learningPaths = [
  {
    id: 1,
    name: "Orthodontic Care",
    description: "Learn about your orthodontic treatment and how to care for your braces",
    progress: 60,
    modules: [
      { id: 1, title: "Introduction to Orthodontics", type: "article", completed: true },
      { id: 2, title: "Caring for Your Braces", type: "video", completed: true },
      { id: 3, title: "Foods to Avoid", type: "infographic", completed: false },
      { id: 4, title: "Orthodontic Emergencies", type: "article", completed: false },
    ],
  },
  {
    id: 2,
    name: "Periodontal Health",
    description: "Understand periodontal disease and learn how to maintain gum health",
    progress: 25,
    modules: [
      { id: 5, title: "What is Periodontal Disease?", type: "article", completed: true },
      { id: 6, title: "Proper Brushing Techniques", type: "video", completed: false },
      { id: 7, title: "The Importance of Flossing", type: "infographic", completed: false },
      { id: 8, title: "Nutrition for Gum Health", type: "article", completed: false },
    ],
  },
]

const contentLibrary = [
  { id: 1, title: "Dental Hygiene Basics", type: "article", category: "Preventive Care", language: "English" },
  { id: 2, title: "Understanding Cavities", type: "video", category: "Common Procedures", language: "English" },
  { id: 3, title: "Post-Extraction Care", type: "infographic", category: "Recovery Tips", language: "English" },
  { id: 4, "title": "Cuidado dental diario", type: "article", category: "Preventive Care", language: "Spanish" },
]

const quizData = {
  title: "Orthodontic Care Quiz",
  questions: [
    {
      id: 1,
      question: "How often should you brush your teeth when wearing braces?",
      options: ["Once a day", "Twice a day", "After every meal", "Once a week"],
      correctAnswer: 2,
    },
    {
      id: 2,
      question: "Which of the following foods should you avoid with braces?",
      options: ["Soft fruits", "Popcorn", "Yogurt", "Cooked vegetables"],
      correctAnswer: 1,
    },
  ],
}

export default function PatientEducationPortal({ patientId }: { patientId: string }) {
  const [activeTab, setActiveTab] = useState('learning-paths')
  const [selectedPath, setSelectedPath] = useState<typeof learningPaths[0] | null>(null)
  const [showQuizDialog, setShowQuizDialog] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [contentFilter, setContentFilter] = useState({ category: 'all', language: 'all' })

  useEffect(() => {
    // In a real application, fetch patient data, learning paths, and content from Supabase here
  }, [patientId])

  const handleStartQuiz = () => {
    setQuizAnswers(new Array(quizData.questions.length).fill(-1))
    setQuizSubmitted(false)
    setShowQuizDialog(true)
  }

  const handleQuizSubmit = () => {
    setQuizSubmitted(true)
    const score = quizAnswers.reduce((acc, answer, index) => {
      return answer === quizData.questions[index].correctAnswer ? acc + 1 : acc
    }, 0)
    toast({
      title: "Quiz Completed",
      description: `You scored ${score} out of ${quizData.questions.length}`,
    })
  }

  const filteredContent = contentLibrary.filter(content => 
    (contentFilter.category === 'all' || content.category === contentFilter.category) &&
    (contentFilter.language === 'all' || content.language === contentFilter.language)
  )

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      case 'infographic':
        return <FileText className="h-4 w-4" />
      default:
        return <Book className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Book className="mr-2 h-6 w-6" />
          Patient Education Portal
        </CardTitle>
        <CardDescription>Personalized learning paths and resources for your dental health</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="learning-paths">My Learning Paths</TabsTrigger>
            <TabsTrigger value="content-library">Content Library</TabsTrigger>
          </TabsList>

          <TabsContent value="learning-paths">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Welcome back, {patientData.name}!</h3>
              <p>Continue your personalized learning journey:</p>
              {learningPaths.map((path) => (
                <Card key={path.id} className="mt-4">
                  <CardHeader>
                    <CardTitle>{path.name}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span>Progress: {path.progress}%</span>
                      <Progress value={path.progress} className="w-1/2" />
                    </div>
                    <ScrollArea className="h-[200px]">
                      {path.modules.map((module) => (
                        <div key={module.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            {getContentTypeIcon(module.type)}
                            <span className="ml-2">{module.title}</span>
                          </div>
                          {module.completed ? (
                            <Badge variant="secondary"><CheckCircle className="mr-1 h-3 w-3" /> Completed</Badge>
                          ) : (
                            <Button size="sm" onClick={() => setSelectedPath(path)}>Start</Button>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleStartQuiz}>Take Quiz</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content-library">
            <Card>
              <CardHeader>
                <CardTitle>Content Library</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select
                    value={contentFilter.category}
                    onValueChange={(value) => setContentFilter({ ...contentFilter, category: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Preventive Care">Preventive Care</SelectItem>
                      <SelectItem value="Common Procedures">Common Procedures</SelectItem>
                      <SelectItem value="Recovery Tips">Recovery Tips</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={contentFilter.language}
                    onValueChange={(value) => setContentFilter({ ...contentFilter, language: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Languages</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {filteredContent.map((content) => (
                    <Card key={content.id} className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg">{content.title}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline" className="mr-2">
                            {getContentTypeIcon(content.type)}
                            <span className="ml-1">{content.type}</span>
                          </Badge>
                          <Badge variant="outline">{content.category}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Language: {content.language}</p>
                      </CardContent>
                      <CardFooter>
                        <Button>View Content</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{quizData.title}</DialogTitle>
            <DialogDescription>
              Test your knowledge on orthodontic care
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {quizData.questions.map((question, index) => (
              <div key={question.id} className="mb-4">
                <p className="font-semibold mb-2">{question.question}</p>
                <RadioGroup
                  value={quizAnswers[index].toString()}
                  onValueChange={(value) => {
                    const newAnswers = [...quizAnswers]
                    newAnswers[index] = parseInt(value)
                    setQuizAnswers(newAnswers)
                  }}
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={optionIndex.toString()} id={`q${question.id}-o${optionIndex}`} />
                      <Label htmlFor={`q${question.id}-o${optionIndex}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {quizSubmitted && (
                  <p className={`mt-2 ${quizAnswers[index] === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                    {quizAnswers[index] === question.correctAnswer ? (
                      <span className="flex items-center"><CheckCircle className="mr-1 h-4 w-4" /> Correct</span>
                    ) : (
                      <span className="flex items-center"><AlertCircle className="mr-1 h-4 w-4" /> Incorrect. The correct answer is: {question.options[question.correctAnswer]}</span>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            {!quizSubmitted ? (
              <Button onClick={handleQuizSubmit}>Submit Quiz</Button>
            ) : (
              <Button onClick={() => setShowQuizDialog(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
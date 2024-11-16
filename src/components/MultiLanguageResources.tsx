'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Book, Video, FileText, HelpCircle, Globe, Search, CheckCircle } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'ar', name: 'Arabic' },
]

const resources = [
  { id: '1', type: 'article', title: 'Proper Brushing Techniques', languages: ['en', 'es', 'fr', 'ar'] },
  { id: '2', type: 'video', title: 'Understanding Gum Disease', languages: ['en', 'es'] },
  { id: '3', type: 'infographic', title: 'Foods That Promote Oral Health', languages: ['en', 'fr', 'ar'] },
  { id: '4', type: 'guide', title: 'Preparing for Your Dental Appointment', languages: ['en', 'es', 'fr', 'ar'] },
  { id: '5', type: 'quiz', title: 'Test Your Oral Health Knowledge', languages: ['en', 'es'] },
]

export default function MultiLanguageResources({ userId }: { userId: string }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showQuizDialog, setShowQuizDialog] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  useEffect(() => {
    // In a real application, fetch user language preference and resources from Supabase here
  }, [userId])

  const filteredResources = resources.filter(resource => 
    resource.languages.includes(selectedLanguage) &&
    (activeTab === 'all' || resource.type === activeTab) &&
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    // In a real application, update user language preference in Supabase here
  }

  const handleResourceClick = (resource: typeof resources[0]) => {
    if (resource.type === 'quiz') {
      setShowQuizDialog(true)
    } else {
      // In a real application, log resource access and redirect to the resource
      toast({
        title: "Resource Accessed",
        description: `You are now viewing: ${resource.title}`,
      })
    }
  }

  const handleQuizSubmit = (score: number) => {
    setQuizScore(score)
    // In a real application, save quiz results to Supabase here
    toast({
      title: "Quiz Completed",
      description: `Your score: ${score}/5`,
    })
    setShowQuizDialog(false)
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Book className="mr-2 h-6 w-6" />
          Multi-Language Patient Education Resources
        </CardTitle>
        <CardDescription>Access dental education materials in your preferred language</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="article">Articles</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="infographic">Infographics</TabsTrigger>
            <TabsTrigger value="guide">Guides</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell>{resource.title}</TableCell>
                        <TableCell>
                          {resource.type === 'article' && <FileText className="h-4 w-4" />}
                          {resource.type === 'video' && <Video className="h-4 w-4" />}
                          {resource.type === 'infographic' && <FileText className="h-4 w-4" />}
                          {resource.type === 'guide' && <HelpCircle className="h-4 w-4" />}
                          {resource.type === 'quiz' && <CheckCircle className="h-4 w-4" />}
                          {' '}{resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleResourceClick(resource)}>
                            {resource.type === 'quiz' ? 'Take Quiz' : 'View'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Resources
        </Button>
        <Button variant="link" onClick={() => window.open('/resources-help', '_blank')}>
          Learn More About Patient Education Resources
        </Button>
      </CardFooter>

      <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Oral Health Knowledge Quiz</DialogTitle>
            <DialogDescription>
              Test your dental health knowledge with this quick quiz!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="q1">1. How often should you brush your teeth?</Label>
              <Select onValueChange={(value) => console.log(value)}>
                <SelectTrigger id="q1">
                  <SelectValue placeholder="Select your answer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once a day</SelectItem>
                  <SelectItem value="twice">Twice a day</SelectItem>
                  <SelectItem value="after-meals">After every meal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Add more quiz questions here */}
          </div>
          <DialogFooter>
            <Button onClick={() => handleQuizSubmit(Math.floor(Math.random() * 6))}>Submit Quiz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
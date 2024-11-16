'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, DollarSign, Package, BarChart, Star, HelpCircle } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type TutorialStep = {
  title: string
  content: string
  target: string
}

type FeatureTutorial = {
  id: string
  title: string
  steps: TutorialStep[]
}

const featureTutorials: FeatureTutorial[] = [
  {
    id: 'appointments',
    title: 'Appointment Scheduling',
    steps: [
      { title: 'Dashboard Overview', content: 'This is your appointment dashboard. Here you can see all scheduled appointments.', target: '#appointment-dashboard' },
      { title: 'Creating an Appointment', content: 'Click the "New Appointment" button to schedule a new appointment.', target: '#new-appointment-btn' },
      { title: 'Managing Appointments', content: 'You can edit or cancel appointments by clicking on them in the calendar view.', target: '#calendar-view' }
    ]
  },
  {
    id: 'pricing',
    title: 'Dynamic Pricing',
    steps: [
      { title: 'Pricing Dashboard', content: 'Here you can manage your service prices and apply dynamic pricing rules.', target: '#pricing-dashboard' },
      { title: 'Setting Base Prices', content: 'Set your base prices for each service in this section.', target: '#base-prices' },
      { title: 'Dynamic Rules', content: 'Create rules for automatic price adjustments based on demand or time of day.', target: '#dynamic-rules' }
    ]
  },
  {
    id: 'inventory',
    title: 'Inventory Management',
    steps: [
      { title: 'Inventory Overview', content: 'This screen shows your current inventory levels for all items.', target: '#inventory-overview' },
      { title: 'Adding Items', content: 'Click "Add Item" to include new products or supplies to your inventory.', target: '#add-inventory-item' },
      { title: 'Stock Alerts', content: 'Set up low stock alerts to never run out of essential items.', target: '#stock-alerts' }
    ]
  },
  {
    id: 'reporting',
    title: 'Financial Reporting',
    steps: [
      { title: 'Reports Dashboard', content: 'Access all your financial reports from this central dashboard.', target: '#reports-dashboard' },
      { title: 'Generating Reports', content: 'Select the type of report and date range, then click "Generate" to create a new report.', target: '#generate-report' },
      { title: 'Analyzing Data', content: 'Use the interactive charts to gain insights into your clinic\'s financial performance.', target: '#report-charts' }
    ]
  },
  {
    id: 'reviews',
    title: 'Reviews Management',
    steps: [
      { title: 'Reviews Overview', content: 'View and manage all patient reviews from this screen.', target: '#reviews-overview' },
      { title: 'Responding to Reviews', content: 'Click on a review to read and respond to patient feedback.', target: '#respond-review' },
      { title: 'Analytics', content: 'Check your overall rating and review trends in the analytics section.', target: '#review-analytics' }
    ]
  }
]

export default function UserOnboardingAndTutorial({ userId }: { userId: string }) {
  const [isFirstLogin, setIsFirstLogin] = useState(true)
  const [showTutorial, setShowTutorial] = useState(false)
  const [currentTutorial, setCurrentTutorial] = useState<FeatureTutorial | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [tutorialProgress, setTutorialProgress] = useState<{ [key: string]: number }>({})
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState<string | null>(null)
  const [feedbackComment, setFeedbackComment] = useState('')

  useEffect(() => {
    checkFirstLogin()
    loadTutorialProgress()
  }, [])

  const checkFirstLogin = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('first_login')
        .eq('id', userId)
        .single()

      if (error) throw error

      setIsFirstLogin(data.first_login)
      if (data.first_login) {
        setShowTutorial(true)
        updateFirstLoginStatus()
      }
    } catch (error) {
      console.error('Error checking first login status:', error)
    }
  }

  const updateFirstLoginStatus = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ first_login: false })
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating first login status:', error)
    }
  }

  const loadTutorialProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('tutorial_progress')
        .select('progress')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No progress found, initialize with empty progress
          setTutorialProgress({})
        } else {
          throw error
        }
      } else {
        setTutorialProgress(data.progress)
      }
    } catch (error) {
      console.error('Error loading tutorial progress:', error)
    }
  }

  const saveTutorialProgress = async () => {
    try {
      const { error } = await supabase
        .from('tutorial_progress')
        .upsert({ user_id: userId, progress: tutorialProgress })

      if (error) throw error
    } catch (error) {
      console.error('Error saving tutorial progress:', error)
    }
  }

  const startTutorial = (tutorial: FeatureTutorial) => {
    setCurrentTutorial(tutorial)
    setCurrentStepIndex(0)
    setShowTutorial(true)
  }

  const nextStep = () => {
    if (currentTutorial && currentStepIndex < currentTutorial.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
    } else {
      endTutorial()
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  const endTutorial = () => {
    if (currentTutorial) {
      const newProgress = { ...tutorialProgress, [currentTutorial.id]: 100 }
      setTutorialProgress(newProgress)
      saveTutorialProgress()
    }
    setShowTutorial(false)
    setCurrentTutorial(null)
    setCurrentStepIndex(0)
    setShowFeedbackDialog(true)
  }

  const submitFeedback = async () => {
    try {
      const { error } = await supabase
        .from('onboarding_feedback')
        .insert({ user_id: userId, rating: feedbackRating, comment: feedbackComment })

      if (error) throw error

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setShowFeedbackDialog(false)
    }
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Welcome to DentEase</CardTitle>
        <CardDescription>Get started with our interactive tutorials</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quickstart">
          <TabsList>
            <TabsTrigger value="quickstart">Quick Start Guide</TabsTrigger>
            <TabsTrigger value="tutorials">Feature Tutorials</TabsTrigger>
          </TabsList>
          <TabsContent value="quickstart">
            <Card>
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Set up your clinic profile in the Settings section</li>
                  <li>Add your services and set prices in the Pricing dashboard</li>
                  <li>Start scheduling appointments using the Appointments calendar</li>
                  <li>Manage your inventory in the Inventory section</li>
                  <li>View your clinic's performance in the Reports dashboard</li>
                </ol>
              </CardContent>
              <CardFooter>
                <Button onClick={() => window.open('/documentation', '_blank')}>View Full Documentation</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="tutorials">
            <div className="grid grid-cols-2 gap-4">
              {featureTutorials.map((tutorial) => (
                <Card key={tutorial.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {tutorial.id === 'appointments' && <Calendar className="mr-2 h-4 w-4" />}
                      {tutorial.id === 'pricing' && <DollarSign className="mr-2 h-4 w-4" />}
                      {tutorial.id === 'inventory' && <Package className="mr-2 h-4 w-4" />}
                      {tutorial.id === 'reporting' && <BarChart className="mr-2 h-4 w-4" />}
                      {tutorial.id === 'reviews' && <Star className="mr-2 h-4 w-4" />}
                      {tutorial.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={tutorialProgress[tutorial.id] || 0} className="w-full" />
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => startTutorial(tutorial)}>
                      {tutorialProgress[tutorial.id] === 100 ? 'Revisit Tutorial' : 'Start Tutorial'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {showTutorial && currentTutorial && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 w-80">
                <h3 className="text-lg font-semibold mb-2">{currentTutorial.steps[currentStepIndex].title}</h3>
                <p className="mb-4">{currentTutorial.steps[currentStepIndex].content}</p>
                <div className="flex justify-between">
                  <Button onClick={prevStep} disabled={currentStepIndex === 0}>Previous</Button>
                  <Button onClick={nextStep}>
                    {currentStepIndex === currentTutorial.steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Click on the highlighted area to continue</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How was your onboarding experience?</DialogTitle>
            <DialogDescription>Your feedback helps us improve our onboarding process.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <RadioGroup value={feedbackRating} onValueChange={setFeedbackRating}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent">Excellent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="average" id="average" />
                <Label htmlFor="average">Average</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="poor" />
                <Label htmlFor="poor">Poor</Label>
              </div>
            </RadioGroup>
            <div className="space-y-2">
              <Label htmlFor="comment">Additional Comments</Label>
              <Textarea
                id="comment"
                placeholder="Tell us how we can improve..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={submitFeedback}>Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardFooter className="justify-between">
        <Button variant="outline" onClick={() => setShowTutorial(true)}>
          <HelpCircle className="mr-2 h-4 w-4" />
          Start Tutorial
        </Button>
        <Button variant="link" onClick={() => window.open('/help', 
        '_blank')}>
          Visit Help Center
        </Button>
      </CardFooter>
    </Card>
  )
}
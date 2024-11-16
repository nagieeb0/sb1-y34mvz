'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { User, Calendar, MessageSquare, Star, TrendingUp, Users, Zap, ChevronRight, Plus } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const patientJourneySteps = [
  { id: 1, name: 'Initial Contact', description: 'Patient reaches out for information or to schedule an appointment', satisfactionScore: 85 },
  { id: 2, name: 'Appointment Scheduling', description: 'Patient books their appointment', satisfactionScore: 90 },
  { id: 3, name: 'Pre-Appointment Reminders', description: 'Patient receives reminders and preparation instructions', satisfactionScore: 88 },
  { id: 4, name: 'Check-In', description: 'Patient arrives and completes necessary paperwork', satisfactionScore: 82 },
  { id: 5, name: 'Treatment', description: 'Patient receives dental care', satisfactionScore: 95 },
  { id: 6, name: 'Check-Out', description: 'Patient completes payment and schedules follow-up', satisfactionScore: 87 },
  { id: 7, name: 'Post-Treatment Follow-up', description: 'Patient receives follow-up care instructions and check-in', satisfactionScore: 89 },
]

const recentFeedback = [
  { id: 1, patientName: 'John Doe', date: '2023-07-20', rating: 5, comment: 'Excellent service and care. The staff was very friendly and professional.' },
  { id: 2, patientName: 'Jane Smith', date: '2023-07-19', rating: 4, comment: 'Good experience overall, but had to wait a bit longer than expected.' },
  { id: 3, patientName: 'Bob Johnson', date: '2023-07-18', rating: 5, comment: 'Dr. Thompson was amazing! Very thorough and explained everything clearly.' },
]

const satisfactionTrends = [
  { month: 'Jan', score: 85 },
  { month: 'Feb', score: 87 },
  { month: 'Mar', score: 86 },
  { month: 'Apr', score: 89 },
  { month: 'May', score: 90 },
  { month: 'Jun', score: 92 },
]

const engagementMetrics = [
  { name: 'Appointment Attendance', value: 95 },
  { name: 'Communication Response Rate', value: 80 },
  { name: 'Loyalty Program Participation', value: 70 },
  { name: 'Follow-up Compliance', value: 85 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function PatientExperienceManagement() {
  const [activeTab, setActiveTab] = useState('journey-map')
  const [selectedStep, setSelectedStep] = useState<any | null>(null)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [newFeedback, setNewFeedback] = useState({ patientName: '', rating: 5, comment: '' })

  useEffect(() => {
    // In a real application, fetch patient experience data from Supabase here
  }, [])

  const handleSubmitFeedback = () => {
    // In a real application, save the feedback to Supabase
    toast({
      title: "Feedback Submitted",
      description: `Thank you for your feedback, ${newFeedback.patientName}!`,
    })
    setShowFeedbackDialog(false)
    setNewFeedback({ patientName: '', rating: 5, comment: '' })
  }

  const renderJourneyStep = (step: any) => (
    <Card key={step.id} className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <span className="mr-2">{step.name}</span>
          <Badge variant={step.satisfactionScore >= 90 ? 'default' : step.satisfactionScore >= 80 ? 'secondary' : 'destructive'}>
            {step.satisfactionScore}% Satisfaction
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{step.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setSelectedStep(step)}>View Details</Button>
      </CardFooter>
    </Card>
  )

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <User className="mr-2 h-6 w-6" />
          Patient Experience Management
        </CardTitle>
        <CardDescription>Track and enhance every aspect of the patient journey</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="journey-map">Journey Map</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="journey-map">
            <Card>
              <CardHeader>
                <CardTitle>Patient Journey Map</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {patientJourneySteps.map(renderJourneyStep)}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patient Feedback</CardTitle>
                <Button onClick={() => setShowFeedbackDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feedback
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentFeedback.map((feedback) => (
                      <TableRow key={feedback.id}>
                        <TableCell>{feedback.patientName}</TableCell>
                        <TableCell>{feedback.date}</TableCell>
                        <TableCell>
                          {Array.from({ length: feedback.rating }).map((_, i) => (
                            <Star key={i} className="inline-block h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </TableCell>
                        <TableCell>{feedback.comment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satisfaction">
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={satisfactionTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" name="Satisfaction Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Patient Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Engagement Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={engagementMetrics}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {engagementMetrics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Engagement Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {engagementMetrics.map((metric) => (
                          <div key={metric.name} className="flex items-center">
                            <span className="w-48 truncate">{metric.name}</span>
                            <Progress value={metric.value} className="flex-1 ml-2" />
                            <span className="ml-2 w-10 text-right">{metric.value}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={selectedStep !== null} onOpenChange={() => setSelectedStep(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedStep?.name}</DialogTitle>
            <DialogDescription>
              Detailed information about this step in the patient journey.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="mb-4">{selectedStep?.description}</p>
            <h4 className="font-semibold mb-2">Satisfaction Score</h4>
            <div className="flex items-center">
              <Progress value={selectedStep?.satisfactionScore} className="flex-1 mr-2" />
              <span>{selectedStep?.satisfactionScore}%</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedStep(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Submit Patient Feedback</DialogTitle>
            <DialogDescription>
              Record feedback from a patient about their experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientName" className="text-right">
                Patient Name
              </Label>
              <Input
                id="patientName"
                value={newFeedback.patientName}
                onChange={(e) => setNewFeedback({ ...newFeedback, patientName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <Select
                value={newFeedback.rating.toString()}
                onValueChange={(value) => setNewFeedback({ ...newFeedback, rating: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} {rating === 1 ? 'Star' : 'Stars'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comment" className="text-right">
                Comment
              </Label>
              <Textarea
                id="comment"
                value={newFeedback.comment}
                onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value  })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
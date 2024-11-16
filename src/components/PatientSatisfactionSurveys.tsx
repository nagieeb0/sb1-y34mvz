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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Smile, Frown, Meh, Star, TrendingUp, Users, Calendar, Filter } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const surveyResponses = [
  { id: '1', patientName: 'John Doe', appointmentDate: '2023-07-01', overallRating: 4, waitTime: 3, treatmentQuality: 5, staffFriendliness: 5, nps: 9 },
  { id: '2', patientName: 'Jane Smith', appointmentDate: '2023-07-02', overallRating: 5, waitTime: 4, treatmentQuality: 5, staffFriendliness: 5, nps: 10 },
  { id: '3', patientName: 'Bob Johnson', appointmentDate: '2023-07-03', overallRating: 3, waitTime: 2, treatmentQuality: 4, staffFriendliness: 4, nps: 7 },
]

const npsData = [
  { month: 'Jan', score: 8.5 },
  { month: 'Feb', score: 8.7 },
  { month: 'Mar', score: 8.9 },
  { month: 'Apr', score: 9.1 },
  { month: 'May', score: 9.0 },
  { month: 'Jun', score: 9.2 },
]

const satisfactionData = [
  { aspect: 'Overall Rating', score: 4.2 },
  { aspect: 'Wait Time', score: 3.8 },
  { aspect: 'Treatment Quality', score: 4.7 },
  { aspect: 'Staff Friendliness', score: 4.5 },
]

export default function PatientSatisfactionSurveys({ clinicId }: { clinicId: string }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('last30days')
  const [patientSegment, setPatientSegment] = useState('all')
  const [showSurveyDialog, setShowSurveyDialog] = useState(false)
  const [selectedSurvey, setSelectedSurvey] = useState<typeof surveyResponses[0] | null>(null)

  useEffect(() => {
    // In a real application, fetch survey data from Supabase here
  }, [clinicId, dateRange, patientSegment])

  const handleDateRangeChange = (range: string) => {
    setDateRange(range)
    // In a real application, fetch new data based on the selected date range
  }

  const handlePatientSegmentChange = (segment: string) => {
    setPatientSegment(segment)
    // In a real application, fetch new data based on the selected patient segment
  }

  const handleSendSurvey = () => {
    // In a real application, trigger the survey sending process here
    toast({
      title: "Survey Sent",
      description: "The satisfaction survey has been sent to the patient.",
    })
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Star className="mr-2 h-6 w-6" />
          Patient Satisfaction Surveys and NPS Tracking
        </CardTitle>
        <CardDescription>Monitor patient satisfaction and loyalty metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="last3months">Last 3 Months</SelectItem>
              <SelectItem value="last6months">Last 6 Months</SelectItem>
              <SelectItem value="lastyear">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={patientSegment} onValueChange={handlePatientSegmentChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select patient segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              <SelectItem value="new">New Patients</SelectItem>
              <SelectItem value="returning">Returning Patients</SelectItem>
              <SelectItem value="pediatric">Pediatric Patients</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <TrendingUp className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="nps">
              <Star className="mr-2 h-4 w-4" />
              NPS Trends
            </TabsTrigger>
            <TabsTrigger value="responses">
              <Users className="mr-2 h-4 w-4" />
              Survey Responses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={satisfactionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="aspect" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Overall Satisfaction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-center">4.2</div>
                      <div className="text-center text-muted-foreground">out of 5</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">NPS Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-center">42</div>
                      <div className="text-center text-muted-foreground">Promoters - Detractors</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Response Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-center">68%</div>
                      <div className="text-center text-muted-foreground">of patients</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nps">
            <Card>
              <CardHeader>
                <CardTitle>Net Promoter Score (NPS) Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={npsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Smile className="mr-2 h-4 w-4 text-green-500" />
                        Promoters
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-center">58%</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Meh className="mr-2 h-4 w-4 text-yellow-500" />
                        Passives
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-center">26%</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Frown className="mr-2 h-4 w-4 text-red-500" />
                        Detractors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-center">16%</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses">
            <Card>
              <CardHeader>
                <CardTitle>Individual Survey Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Overall Rating</TableHead>
                      <TableHead>NPS</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {surveyResponses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell>{response.patientName}</TableCell>
                        <TableCell>{response.appointmentDate}</TableCell>
                        <TableCell>{response.overallRating}/5</TableCell>
                        <TableCell>{response.nps}/10</TableCell>
                        <TableCell>
                          <Button onClick={() => {
                            setSelectedSurvey(response)
                            setShowSurveyDialog(true)
                          }}>
                            View Details
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
          Refresh Data
        </Button>
        <Button onClick={handleSendSurvey}>
          Send New Survey
        </Button>
      </CardFooter>

      <Dialog open={showSurveyDialog} onOpenChange={setShowSurveyDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Survey Response Details</DialogTitle>
            <DialogDescription>
              Detailed feedback from {selectedSurvey?.patientName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Date</Label>
              <div className="col-span-3">{selectedSurvey?.appointmentDate}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Overall Rating</Label>
              <div className="col-span-3">{selectedSurvey?.overallRating}/5</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Wait Time</Label>
              <div className="col-span-3">{selectedSurvey?.waitTime}/5</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Treatment Quality</Label>
              <div className="col-span-3">{selectedSurvey?.treatmentQuality}/5</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Staff Friendliness</Label>
              <div className="col-span-3">{selectedSurvey?.staffFriendliness}/5</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">NPS</Label>
              <div className="col-span-3">{selectedSurvey?.nps}/10</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSurveyDialog(false)}>Close</Button>
          
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
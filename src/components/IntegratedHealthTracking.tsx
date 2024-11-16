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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar } from "@/components/ui/calendar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Activity, Book, Calendar as CalendarIcon, FileText, AlertTriangle, Bell } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const patientProfile = {
  id: 1,
  name: "John Doe",
  condition: "Periodontal Disease",
  medicalHistory: "Type 2 Diabetes, Hypertension",
  treatmentPlan: "Regular deep cleaning, daily flossing, antibiotic treatment",
}

const symptomLogs = [
  { date: '2023-07-01', gumHealth: 3, bleeding: 2, sensitivity: 4 },
  { date: '2023-07-08', gumHealth: 4, bleeding: 2, sensitivity: 3 },
  { date: '2023-07-15', gumHealth: 5, bleeding: 1, sensitivity: 3 },
  { date: '2023-07-22', gumHealth: 6, bleeding: 1, sensitivity: 2 },
]

const carePlan = [
  { id: 1, task: "Brush teeth twice daily", frequency: "Twice daily", completed: true },
  { id: 2, task: "Floss thoroughly", frequency: "Once daily", completed: false },
  { id: 3, task: "Use prescribed mouthwash", frequency: "Once daily", completed: true },
  { id: 4, task: "Take antibiotic medication", frequency: "Twice daily", completed: true },
]

const upcomingAppointments = [
  { id: 1, date: '2023-08-15', time: '10:00 AM', type: 'Deep Cleaning' },
  { id: 2, date: '2023-09-01', time: '2:00 PM', type: 'Check-up' },
]

const educationalResources = [
  { id: 1, title: "Understanding Periodontal Disease", type: "Article", url: "#" },
  { id: 2, title: "Proper Flossing Techniques", type: "Video", url: "#" },
  { id: 3, title: "Nutrition for Gum Health", type: "Article", url: "#" },
  { id: 4, title: "Managing Diabetes and Oral Health", type: "Video", url: "#" },
]

export default function IntegratedHealthTracking({ userType }: { userType: 'patient' | 'provider' }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [showSymptomDialog, setShowSymptomDialog] = useState(false)
  const [newSymptom, setNewSymptom] = useState({ gumHealth: 5, bleeding: 1, sensitivity: 1 })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    // In a real application, fetch patient data from Supabase here
  }, [])

  const handleLogSymptom = () => {
    // In a real application, save the symptom log to Supabase
    toast({
      title: "Symptoms Logged",
      description: "Your symptom log has been recorded and will be reviewed by your provider.",
    })
    setShowSymptomDialog(false)
    setNewSymptom({ gumHealth: 5, bleeding: 1, sensitivity: 1 })
  }

  const renderPatientView = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Activity className="mr-2 h-6 w-6" />
          Chronic Condition Management
        </CardTitle>
        <CardDescription>Track and manage your periodontal health</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="care-plan">Care Plan</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Patient Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <strong>Name:</strong> {patientProfile.name}
                  </div>
                  <div>
                    <strong>Condition:</strong> {patientProfile.condition}
                  </div>
                  <div>
                    <strong>Medical History:</strong> {patientProfile.medicalHistory}
                  </div>
                  <div>
                    <strong>Treatment Plan:</strong> {patientProfile.treatmentPlan}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Update Profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="symptoms">
            <Card>
              <CardHeader>
                <CardTitle>Symptom Tracking</CardTitle>
                <Button onClick={() => setShowSymptomDialog(true)}>Log New Symptoms</Button>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={symptomLogs}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="gumHealth" stroke="#8884d8" name="Gum Health" />
                      <Line type="monotone" dataKey="bleeding" stroke="#82ca9d" name="Bleeding" />
                      <Line type="monotone" dataKey="sensitivity" stroke="#ffc658" name="Sensitivity" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="care-plan">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Care Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carePlan.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.task}</TableCell>
                        <TableCell>{task.frequency}</TableCell>
                        <TableCell>
                          {task.completed ? (
                            <Badge variant="success">Completed</Badge>
                          ) : (
                            <Badge variant="destructive">Pending</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Button variant="outline">Update Progress</Button>
                  <Button>View Full Care Plan</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Educational Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {educationalResources.map((resource) => (
                    <Card key={resource.id} className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.type}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button variant="outline" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">View Resource</a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  const renderProviderView = () => (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Activity className="mr-2 h-6 w-6" />
          Chronic Condition Management Dashboard
        </CardTitle>
        <CardDescription>Monitor and manage patients with chronic dental conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Patient Overview</TabsTrigger>
            <TabsTrigger value="symptoms">Symptom Trends</TabsTrigger>
            <TabsTrigger value="care-plans">Care Plans</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Patient Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Last Check-up</TableHead>
                      <TableHead>Next Appointment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{patientProfile.name}</TableCell>
                      <TableCell>{patientProfile.condition}</TableCell>
                      <TableCell>2023-07-15</TableCell>
                      <TableCell>{upcomingAppointments[0].date}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                    {/* Add more rows for other patients */}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symptoms">
            <Card>
              <CardHeader>
                <CardTitle>Symptom Trends for {patientProfile.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={symptomLogs}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="gumHealth" stroke="#8884d8" name="Gum Health" />
                      <Line type="monotone" dataKey="bleeding" stroke="#82ca9d" name="Bleeding" />
                      <Line type="monotone" dataKey="sensitivity" stroke="#ffc658" name="Sensitivity" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Adjust Treatment Plan</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="care-plans">
            <Card>
              <CardHeader>
                <CardTitle>Care Plan for {patientProfile.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Adherence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carePlan.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.task}</TableCell>
                        <TableCell>{task.frequency}</TableCell>
                        <TableCell>
                          <Progress value={task.completed ? 100 : 0} className="w-[60px]" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button>Modify Care Plan</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Patient Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Alert  Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{patientProfile.name}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Missed Appointment
                        </Badge>
                      </TableCell>
                      <TableCell>2023-07-20</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Contact Patient</Button>
                      </TableCell>
                    </TableRow>
                    {/* Add more rows for other alerts */}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  return (
    <>
      {userType === 'patient' ? renderPatientView() : renderProviderView()}

      <Dialog open={showSymptomDialog} onOpenChange={setShowSymptomDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log New Symptoms</DialogTitle>
            <DialogDescription>
              Rate your symptoms on a scale of 1-10, with 10 being the most severe.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gum-health" className="text-right">
                Gum Health
              </Label>
              <Input
                id="gum-health"
                type="number"
                min="1"
                max="10"
                value={newSymptom.gumHealth}
                onChange={(e) => setNewSymptom({ ...newSymptom, gumHealth: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bleeding" className="text-right">
                Bleeding
              </Label>
              <Input
                id="bleeding"
                type="number"
                min="1"
                max="10"
                value={newSymptom.bleeding}
                onChange={(e) => setNewSymptom({ ...newSymptom, bleeding: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sensitivity" className="text-right">
                Sensitivity
              </Label>
              <Input
                id="sensitivity"
                type="number"
                min="1"
                max="10"
                value={newSymptom.sensitivity}
                onChange={(e) => setNewSymptom({ ...newSymptom, sensitivity: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleLogSymptom}>Log Symptoms</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
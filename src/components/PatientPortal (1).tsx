'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Calendar, Clock, CheckCircle, AlertCircle, User, FileText, Bell } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const patientData = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/placeholder-avatar.jpg'
}

const appointments = [
  { id: '1', date: '2023-07-25', time: '10:00 AM', status: 'Scheduled', type: 'Dental Cleaning' },
  { id: '2', date: '2023-07-28', time: '2:00 PM', status: 'In Progress', type: 'Root Canal' },
  { id: '3', date: '2023-08-05', time: '11:30 AM', status: 'Completed', type: 'Follow-up' },
]

const treatments = [
  { 
    id: '1', 
    name: 'Orthodontic Treatment', 
    progress: 60, 
    startDate: '2023-01-15', 
    estimatedEndDate: '2023-12-15',
    stages: [
      { name: 'Initial Consultation', completed: true },
      { name: 'Braces Placement', completed: true },
      { name: 'First Adjustment', completed: true },
      { name: 'Second Adjustment', completed: false },
      { name: 'Final Adjustment', completed: false },
      { name: 'Braces Removal', completed: false },
    ]
  },
  { 
    id: '2', 
    name: 'Dental Implant', 
    progress: 30, 
    startDate: '2023-06-01', 
    estimatedEndDate: '2023-09-01',
    stages: [
      { name: 'Initial Consultation', completed: true },
      { name: 'Implant Placement', completed: true },
      { name: 'Healing Period', completed: false },
      { name: 'Abutment Placement', completed: false },
      { name: 'Crown Placement', completed: false },
    ]
  },
]

const carePlan = {
  recommendations: [
    'Brush teeth twice daily with fluoride toothpaste',
    'Floss daily',
    'Use mouthwash after brushing',
    'Avoid sugary foods and drinks',
    'Schedule regular dental check-ups every 6 months',
  ],
  upcomingAppointments: [
    { date: '2023-09-15', type: 'Dental Cleaning' },
    { date: '2024-03-15', type: 'Regular Check-up' },
  ]
}

export default function PatientPortal({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState('appointments')
  const [showCareInstructions, setShowCareInstructions] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null)

  useEffect(() => {
    // In a real application, fetch patient data, appointments, treatments, and care plan from Supabase here
  }, [userId])

  const handleAppointmentUpdate = (appointmentId: string, newStatus: string) => {
    // In a real application, update the appointment status in Supabase here
    toast({
      title: "Appointment Updated",
      description: `Your appointment status has been updated to ${newStatus}.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <Badge className="bg-blue-500"><Clock className="mr-1 h-3 w-3" /> Scheduled</Badge>
      case 'In Progress':
        return <Badge className="bg-yellow-500"><AlertCircle className="mr-1 h-3 w-3" /> In Progress</Badge>
      case 'Completed':
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Completed</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Patient Portal</CardTitle>
          <Avatar>
            <AvatarImage src={patientData.avatar} alt={patientData.name} />
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>
        </div>
        <CardDescription>Welcome back, {patientData.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="treatments">Treatments</TabsTrigger>
            <TabsTrigger value="care-plan">Care Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        <TableCell>
                          {appointment.status === 'Completed' && (
                            <Button size="sm" onClick={() => {
                              setSelectedAppointment(appointment)
                              setShowCareInstructions(true)
                            }}>
                              View Care Instructions
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatments">
            <Card>
              <CardHeader>
                <CardTitle>Your Treatments</CardTitle>
              </CardHeader>
              <CardContent>
                {treatments.map((treatment) => (
                  <Card key={treatment.id} className="mb-4">
                    <CardHeader>
                      <CardTitle>{treatment.name}</CardTitle>
                      <CardDescription>
                        Started: {treatment.startDate} | Estimated Completion: {treatment.estimatedEndDate}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">Progress: {treatment.progress}%</div>
                      <Progress value={treatment.progress} className="w-full" />
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Treatment Stages:</h4>
                        <ul className="space-y-2">
                          {treatment.stages.map((stage, index) => (
                            <li key={index} className="flex items-center">
                              {stage.completed ? (
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                              )}
                              {stage.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="care-plan">
            <Card>
              <CardHeader>
                <CardTitle>Your Personalized Care Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">Recommendations:</h3>
                <ul className="list-disc pl-5 mb-4">
                  {carePlan.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
                <h3 className="font-semibold mb-2">Upcoming Appointments:</h3>
                <ul className="space-y-2">
                  {carePlan.upcomingAppointments.map((appointment, index) => (
                    <li key={index} className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      {appointment.date} - {appointment.type}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
        <Button variant="link" onClick={() => window.open('/patient-portal-help', '_blank')}>
          Need Help?
        </Button>
      </CardFooter>

      <Dialog open={showCareInstructions} onOpenChange={setShowCareInstructions}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Post-Treatment Care Instructions</DialogTitle>
            <DialogDescription>
              Follow these instructions for your {selectedAppointment?.type} treatment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Instructions:</h4>
              <ul className="list-disc pl-5">
                <li>Avoid eating or drinking for the next 30 minutes</li>
                <li>Rinse with warm salt water 3 times a day for the next 3 days</li>
                <li>Take prescribed medication as directed</li>
                <li>Contact us if you experience severe pain or swelling</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Reminders:</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Medication reminder set for every 6 hours
                </li>
                <li className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Follow-up appointment reminder set for 1 week from now
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowCareInstructions(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
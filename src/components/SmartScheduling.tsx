'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar as CalendarIcon, Clock, AlertTriangle, CheckCircle, RefreshCw, UserX } from 'lucide-react'

// Simulated data (replace with actual Supabase queries and AI model predictions in production)
const optimalSlots = [
  { id: 1, date: '2023-07-25', time: '09:00', service: 'Routine Check-up', provider: 'Dr. Smith', score: 0.95 },
  { id: 2, date: '2023-07-25', time: '11:30', service: 'Dental Cleaning', provider: 'Dr. Johnson', score: 0.92 },
  { id: 3, date: '2023-07-26', time: '14:00', service: 'Root Canal', provider: 'Dr. Smith', score: 0.88 },
  { id: 4, date: '2023-07-27', time: '10:00', service: 'Routine Check-up', provider: 'Dr. Johnson', score: 0.90 },
  { id: 5, date: '2023-07-27', time: '15:30', service: 'Dental Filling', provider: 'Dr. Smith', score: 0.87 },
]

const reschedulingOptions = [
  { id: 1, patientName: 'John Doe', currentDate: '2023-07-28', currentTime: '11:00', suggestedDate: '2023-07-26', suggestedTime: '14:30', reason: 'Accommodate urgent case' },
  { id: 2, patientName: 'Jane Smith', currentDate: '2023-07-29', currentTime: '09:30', suggestedDate: '2023-07-27', suggestedTime: '11:00', reason: 'Balance provider workload' },
]

const noShowRisks = [
  { id: 1, patientName: 'Bob Johnson', appointmentDate: '2023-07-26', appointmentTime: '10:00', riskScore: 0.75 },
  { id: 2, patientName: 'Alice Brown', appointmentDate: '2023-07-27', appointmentTime: '13:30', riskScore: 0.65 },
]

const providerUtilization = [
  { provider: 'Dr. Smith', utilization: 85 },
  { provider: 'Dr. Johnson', utilization: 78 },
  { provider: 'Dr. Williams', utilization: 92 },
]

const demandData = [
  { hour: '08:00', demand: 20 },
  { hour: '09:00', demand: 45 },
  { hour: '10:00', demand: 60 },
  { hour: '11:00', demand: 75 },
  { hour: '12:00', demand: 50 },
  { hour: '13:00', demand: 40 },
  { hour: '14:00', demand: 55 },
  { hour: '15:00', demand: 70 },
  { hour: '16:00', demand: 65 },
  { hour: '17:00', demand: 35 },
]

export default function SmartScheduling() {
  const [activeTab, setActiveTab] = useState('optimal-slots')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [selectedReschedule, setSelectedReschedule] = useState<typeof reschedulingOptions[0] | null>(null)

  useEffect(() => {
    // In a real application, fetch AI-powered scheduling data from Supabase here
  }, [])

  const handleReschedule = () => {
    if (selectedReschedule) {
      // In a real application, update the appointment in Supabase and notify the patient
      toast({
        title: "Appointment Rescheduled",
        description: `${selectedReschedule.patientName}'s appointment has been rescheduled to ${selectedReschedule.suggestedDate} at ${selectedReschedule.suggestedTime}.`,
      })
      setShowRescheduleDialog(false)
    }
  }

  const handleSendReminder = (patientName: string) => {
    // In a real application, send a reminder to the patient
    toast({
      title: "Reminder Sent",
      description: `A reminder has been sent to ${patientName}.`,
    })
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <RefreshCw className="mr-2 h-6 w-6" />
          AI-Powered Smart Scheduling
        </CardTitle>
        <CardDescription>Optimize appointments and improve clinic efficiency</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="optimal-slots">Optimal Slots</TabsTrigger>
            <TabsTrigger value="rescheduling">Rescheduling</TabsTrigger>
            <TabsTrigger value="no-show-risks">No-Show Risks</TabsTrigger>
            <TabsTrigger value="utilization">Provider Utilization</TabsTrigger>
          </TabsList>

          <TabsContent value="optimal-slots">
            <Card>
              <CardHeader>
                <CardTitle>AI-Recommended Optimal Appointment Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-4">
                  <div>
                    <Label>Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Appointment Demand by Hour</Label>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={demandData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="demand" fill="#8884d8" name="Patient Demand" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Optimization Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {optimalSlots.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell>{slot.date}</TableCell>
                        <TableCell>{slot.time}</TableCell>
                        <TableCell>{slot.service}</TableCell>
                        <TableCell>{slot.provider}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={slot.score * 100} className="w-[60px]" />
                            <span>{(slot.score * 100).toFixed(0)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rescheduling">
            <Card>
              <CardHeader>
                <CardTitle>AI-Recommended Rescheduling Options</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Current Appointment</TableHead>
                      <TableHead>Suggested Reschedule</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reschedulingOptions.map((option) => (
                      <TableRow key={option.id}>
                        <TableCell>{option.patientName}</TableCell>
                        <TableCell>{option.currentDate} at {option.currentTime}</TableCell>
                        <TableCell>{option.suggestedDate} at {option.suggestedTime}</TableCell>
                        <TableCell>{option.reason}</TableCell>
                        <TableCell>
                          <Button onClick={() => {
                            setSelectedReschedule(option)
                            setShowRescheduleDialog(true)
                          }}>
                            Reschedule
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="no-show-risks">
            <Card>
              <CardHeader>
                <CardTitle>Predicted No-Show Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Appointment</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {noShowRisks.map((risk) => (
                      <TableRow key={risk.id}>
                        <TableCell>{risk.patientName}</TableCell>
                        <TableCell>{risk.appointmentDate} at {risk.appointmentTime}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={risk.riskScore * 100} className="w-[60px]" />
                            <span>{(risk.riskScore * 100).toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleSendReminder(risk.patientName)}>
                            Send Reminder
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="utilization">
            <Card>
              <CardHeader>
                <CardTitle>Provider Utilization Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providerUtilization.map((provider) => (
                    <div key={provider.provider} className="flex items-center space-x-4">
                      <div className="w-32">{provider.provider}</div>
                      <Progress value={provider.utilization} className="flex-1" />
                      <div className="w-16 text-right">{provider.utilization}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
        <Button variant="link" onClick={() => window.open('/smart-scheduling-help', '_blank')}>
          Learn More About Smart Scheduling
        </Button>
      </CardFooter>

      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Rescheduling</DialogTitle>
            <DialogDescription>
              Are you sure you want to reschedule this appointment?
            </DialogDescription>
          </DialogHeader>
          {selectedReschedule && (
            <div className="py-4">
              <p><strong>Patient:</strong> {selectedReschedule.patientName}</p>
              <p><strong>Current Appointment:</strong> {selectedReschedule.currentDate} at {selectedReschedule.currentTime}</p>
              <p><strong>New Appointment:</strong> {selectedReschedule.suggestedDate} at {selectedReschedule.suggestedTime}</p>
              <p><strong>Reason:</strong> {selectedReschedule.reason}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>Cancel</Button>
            <Button onClick={handleReschedule}>Confirm Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
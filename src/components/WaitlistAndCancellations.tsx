'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Calendar as CalendarIcon, Clock, UserPlus, X, RefreshCw } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

// Simulated data (replace with actual Supabase queries in production)
const waitlistEntries = [
  { id: '1', patientName: 'John Doe', desiredDate: '2023-08-01', alternativeDates: ['2023-08-02', '2023-08-03'], enrollmentDate: '2023-07-15' },
  { id: '2', patientName: 'Jane Smith', desiredDate: '2023-08-03', alternativeDates: ['2023-08-04', '2023-08-05'], enrollmentDate: '2023-07-16' },
]

const appointments = [
  { id: '1', patientName: 'Alice Johnson', date: '2023-07-25', time: '10:00 AM', status: 'Confirmed' },
  { id: '2', patientName: 'Bob Williams', date: '2023-07-26', time: '2:00 PM', status: 'Confirmed' },
  { id: '3', patientName: 'Charlie Brown', date: '2023-07-27', time: '11:30 AM', status: 'Confirmed' },
]

export default function WaitlistAndCancellations({ userId, userType }: { userId: string, userType: 'patient' | 'staff' }) {
  const [activeTab, setActiveTab] = useState('waitlist')
  const [showJoinWaitlistDialog, setShowJoinWaitlistDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [alternativeDates, setAlternativeDates] = useState<Date[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null)

  useEffect(() => {
    // In a real application, fetch waitlist and appointment data from Supabase here
  }, [userId])

  const handleJoinWaitlist = () => {
    // In a real application, save the waitlist entry to Supabase here
    toast({
      title: "Added to Waitlist",
      description: "You've been added to the waitlist. We'll notify you if a slot becomes available.",
    })
    setShowJoinWaitlistDialog(false)
  }

  const handleCancelAppointment = (appointmentId: string) => {
    // In a real application, update the appointment status in Supabase and notify waitlisted patients
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully.",
    })
  }

  const handleRescheduleAppointment = () => {
    // In a real application, update the appointment details in Supabase
    toast({
      title: "Appointment Rescheduled",
      description: "Your appointment has been rescheduled successfully.",
    })
    setShowRescheduleDialog(false)
  }

  const handleNotifyPatient = (waitlistId: string) => {
    // In a real application, send a notification to the patient and update the waitlist entry
    toast({
      title: "Patient Notified",
      description: "The patient has been notified of the available slot.",
    })
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <UserPlus className="mr-2 h-6 w-6" />
          Waitlist & Cancellations Management
        </CardTitle>
        <CardDescription>Manage appointment waitlists and cancellations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="waitlist">
            <Card>
              <CardHeader>
                <CardTitle>{userType === 'patient' ? 'Join Waitlist' : 'Manage Waitlist'}</CardTitle>
              </CardHeader>
              <CardContent>
                {userType === 'patient' ? (
                  <Button onClick={() => setShowJoinWaitlistDialog(true)}>Join Waitlist</Button>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Desired Date</TableHead>
                        <TableHead>Alternative Dates</TableHead>
                        <TableHead>Enrollment Date</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waitlistEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.patientName}</TableCell>
                          <TableCell>{entry.desiredDate}</TableCell>
                          <TableCell>{entry.alternativeDates.join(', ')}</TableCell>
                          <TableCell>{entry.enrollmentDate}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => handleNotifyPatient(entry.id)}>
                              Notify
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.patientName}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.status}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" className="mr-2" onClick={() => {
                            setSelectedAppointment(appointment)
                            setShowRescheduleDialog(true)
                          }}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reschedule
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleCancelAppointment(appointment.id)}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
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
          Refresh
        </Button>
        <Button variant="link" onClick={() => window.open('/waitlist-help', '_blank')}>
          Learn More About Waitlist & Cancellations
        </Button>
      </CardFooter>

      <Dialog open={showJoinWaitlistDialog} onOpenChange={setShowJoinWaitlistDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join Waitlist</DialogTitle>
            <DialogDescription>
              Select your desired appointment date and alternative dates.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desired-date" className="text-right">
                Desired Date
              </Label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="desired-time" className="text-right">
                Desired Time
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Alternative Dates
              </Label>
              <div className="col-span-3">
                <Calendar
                  mode="multiple"
                  selected={alternativeDates}
                  onSelect={setAlternativeDates}
                  className="rounded-md border"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleJoinWaitlist}>Join Waitlist</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date and time for your appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-date" className="text-right">
                New Date
              </Label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-time" className="text-right">
                New Time
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleRescheduleAppointment}>Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
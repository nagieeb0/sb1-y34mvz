'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Video, MessageSquare, FileText, Clock, Calendar as CalendarIcon, Upload, Phone } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const availableSlots = [
  { id: 1, date: '2023-07-25', time: '09:00', provider: 'Dr. Smith' },
  { id: 2, date: '2023-07-25', time: '11:30', provider: 'Dr. Johnson' },
  { id: 3, date: '2023-07-26', time: '14:00', provider: 'Dr. Smith' },
  { id: 4, date: '2023-07-27', time: '10:00', provider: 'Dr. Johnson' },
]

const upcomingAppointments = [
  { id: 1, date: '2023-07-25', time: '09:00', provider: 'Dr. Smith', status: 'Scheduled' },
  { id: 2, date: '2023-07-26', time: '14:00', provider: 'Dr. Johnson', status: 'In Waiting Room' },
]

const messages = [
  { id: 1, sender: 'Dr. Smith', content: 'How are you feeling after the procedure?', timestamp: '2023-07-20 10:30' },
  { id: 2, sender: 'Patient', content: 'Much better, thank you! The pain has subsided.', timestamp: '2023-07-20 11:15' },
]

export default function TelehealthIntegration({ userType, userId }: { userType: 'patient' | 'provider', userId: string }) {
  const [activeTab, setActiveTab] = useState('appointments')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<typeof availableSlots[0] | null>(null)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showVideoDialog, setShowVideoDialog] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    // In a real application, fetch telehealth data from Supabase here based on userType and userId
  }, [userType, userId])

  const handleScheduleAppointment = () => {
    if (selectedSlot) {
      // In a real application, save the appointment to Supabase
      toast({
        title: "Appointment Scheduled",
        description: `Your telehealth appointment with ${selectedSlot.provider} on ${selectedSlot.date} at ${selectedSlot.time} has been scheduled.`,
      })
      setShowScheduleDialog(false)
    }
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real application, save the message to Supabase
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the provider.",
      })
      setMessage('')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // In a real application, upload the file to Supabase storage
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      })
    }
  }

  const renderPatientView = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Video className="mr-2 h-6 w-6" />
          Telehealth Portal
        </CardTitle>
        <CardDescription>Schedule and manage your virtual dental appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Your Telehealth Appointments</CardTitle>
                <Button onClick={() => setShowScheduleDialog(true)}>Schedule New Appointment</Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id} className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg">{appointment.provider}</CardTitle>
                        <CardDescription>
                          {appointment.date} at {appointment.time}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge>{appointment.status}</Badge>
                      </CardContent>
                      <CardFooter>
                        {appointment.status === 'In Waiting Room' ? (
                          <Button onClick={() => setShowVideoDialog(true)}>Join Call</Button>
                        ) : (
                          <Button variant="outline">Cancel Appointment</Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] mb-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'Patient' ? 'justify-end' : 'justify-start'} mb-4`}>
                      <Card className={`max-w-[70%] ${msg.sender === 'Patient' ? 'bg-primary text-primary-foreground' : ''}`}>
                        <CardHeader>
                          <CardTitle className="text-sm">{msg.sender}</CardTitle>
                          <CardDescription>{msg.timestamp}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p>{msg.content}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </ScrollArea>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>Shared Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload">Upload New File</Label>
                    <Input id="file-upload" type="file" onChange={handleFileUpload} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Uploaded Files:</h4>
                    <ul className="list-disc pl-5">
                      <li>X-ray_20230720.jpg</li>
                      <li>Treatment_Plan.pdf</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  const renderProviderView = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Video className="mr-2 h-6 w-6" />
          Telehealth Dashboard
        </CardTitle>
        <CardDescription>Manage your virtual dental appointments and patient interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Today's Telehealth Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id} className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg">Patient: John Doe</CardTitle>
                        <CardDescription>
                          {appointment.date} at {appointment.time}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge>{appointment.status}</Badge>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => setShowVideoDialog(true)}>Start Call</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Recent Patient Interactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {messages.map((msg) => (
                    <Card key={msg.id} className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg">{msg.sender === 'Patient' ? 'John Doe' : msg.sender}</CardTitle>
                        <CardDescription>{msg.timestamp}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{msg.content}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline">View Patient Profile</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Telehealth Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Available Slots:</h4>
                    <ScrollArea className="h-[200px]">
                      {availableSlots.map((slot) => (
                        <Card key={slot.id} className="mb-2">
                          <CardHeader>
                            <CardTitle className="text-sm">{slot.time}</CardTitle>
                            <CardDescription>{slot.provider}</CardDescription>
                          </CardHeader>
                          <CardFooter>
                            <Button variant="outline" size="sm">Edit</Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </ScrollArea>
                  </div>
                </div>
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

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Telehealth Appointment</DialogTitle>
            <DialogDescription>
              Choose a date and time for your virtual dental visit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
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
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Select onValueChange={(value) => setSelectedSlot(availableSlots.find(slot => slot.id.toString() === value) || null)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id.toString()}>
                      
                      {slot.time} - {slot.provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleScheduleAppointment}>Schedule Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Telehealth Consultation</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted">
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Video call interface would be integrated here</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={() => setShowVideoDialog(false)}>End Call</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
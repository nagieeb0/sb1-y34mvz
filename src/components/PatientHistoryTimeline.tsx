'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar, Clock, FileText, AlertCircle, CheckCircle, XCircle, Plus, Search } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const patientHistory = [
  {
    id: '1',
    date: '2023-07-15',
    type: 'Appointment',
    title: 'Regular Check-up',
    status: 'Completed',
    notes: 'Patient reported sensitivity in lower right molar. Recommended fluoride treatment.',
    documents: ['X-ray_20230715.jpg'],
  },
  {
    id: '2',
    date: '2023-08-01',
    type: 'Treatment',
    title: 'Cavity Filling',
    status: 'Completed',
    notes: 'Filled cavity in tooth #18. Patient tolerated procedure well.',
    documents: ['Treatment_Plan_20230801.pdf'],
  },
  {
    id: '3',
    date: '2023-09-10',
    type: 'Appointment',
    title: 'Follow-up',
    status: 'Canceled',
    notes: 'Patient rescheduled due to work conflict.',
    documents: [],
  },
  {
    id: '4',
    date: '2023-10-05',
    type: 'Treatment',
    title: 'Root Canal',
    status: 'Completed',
    notes: 'Performed root canal on tooth #30. Prescribed antibiotics and pain medication.',
    documents: ['Post_Op_Instructions_20231005.pdf'],
  },
  {
    id: '5',
    date: '2023-11-20',
    type: 'Appointment',
    title: 'Crown Fitting',
    status: 'Scheduled',
    notes: 'Scheduled for crown fitting on tooth #30.',
    documents: [],
  },
]

const patientInfo = {
  name: 'John Doe',
  dob: '1985-03-22',
  allergies: ['Penicillin'],
  conditions: ['Hypertension'],
}

export default function PatientHistoryTimeline({ patientId }: { patientId: string }) {
  const [activeTab, setActiveTab] = useState('timeline')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<typeof patientHistory[0] | null>(null)
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    // In a real application, fetch patient history from Supabase here based on patientId
  }, [patientId])

  const filteredHistory = patientHistory.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.notes.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddNote = () => {
    if (selectedEvent) {
      // In a real application, update the event with the new note in Supabase
      toast({
        title: "Note Added",
        description: "Your note has been added to the patient's history.",
      })
      setShowNoteDialog(false)
      setNewNote('')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Completed</Badge>
      case 'Scheduled':
        return <Badge className="bg-blue-500"><Clock className="mr-1 h-3 w-3" /> Scheduled</Badge>
      case 'Canceled':
        return <Badge className="bg-red-500"><XCircle className="mr-1 h-3 w-3" /> Canceled</Badge>
      default:
        return <Badge className="bg-gray-500"><AlertCircle className="mr-1 h-3 w-3" /> Unknown</Badge>
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <FileText className="mr-2 h-6 w-6" />
          Patient History and Timeline
        </CardTitle>
        <CardDescription>Comprehensive view of {patientInfo.name}'s dental journey</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">
              <Clock className="mr-2 h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="summary">
              <FileText className="mr-2 h-4 w-4" />
              Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search patient history..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
              <ScrollArea className="h-[600px] pr-4">
                {filteredHistory.map((event, index) => (
                  <Card key={event.id} className="mb-4">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{event.title}</span>
                        {getStatusBadge(event.status)}
                      </CardTitle>
                      <CardDescription className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{event.notes}</p>
                      {event.documents.length > 0 && (
                        <div className="mt-2">
                          <Label>Related Documents:</Label>
                          <ul className="list-disc list-inside">
                            {event.documents.map((doc, i) => (
                              <li key={i} className="text-sm text-blue-500 hover:underline cursor-pointer">
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedEvent(event)
                        setShowNoteDialog(true)
                      }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Note
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Patient Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <p>{patientInfo.name}</p>
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <p>{new Date(patientInfo.dob).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Allergies</Label>
                    <ul className="list-disc list-inside">
                      {patientInfo.allergies.map((allergy, index) => (
                        <li key={index}>{allergy}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Label>Medical Conditions</Label>
                    <ul className="list-disc list-inside">
                      {patientInfo.conditions.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="treatment-history">
                      <AccordionTrigger>Treatment History</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside">
                          {patientHistory
                            .filter(event => event.type === 'Treatment' && event.status === 'Completed')
                            .map((treatment, index) => (
                              <li key={index}>{treatment.date}: {treatment.title}</li>
                            ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="upcoming-appointments">
                      <AccordionTrigger>Upcoming Appointments</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside">
                          {patientHistory
                            .filter(event => event.type === 'Appointment' && event.status === 'Scheduled')
                            .map((appointment, index) => (
                              <li key={index}>{appointment.date}: {appointment.title}</li>
                            ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
        <Button variant="link" onClick={() => window.open('/patient-history-help', '_blank')}>
          Learn More About Patient History
        </Button>
      </CardFooter>

      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Note to Event</DialogTitle>
            <DialogDescription>
              Add a new note to the selected event in the patient's history.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Note
              </Label>
              <textarea
                id="note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="col-span-3 h-20 px-3 py-2 text-sm rounded-md border border-input bg-transparent"
                placeholder="Enter your note here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
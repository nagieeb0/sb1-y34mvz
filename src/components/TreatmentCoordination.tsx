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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar } from "@/components/ui/calendar"
import { Users, FileText, MessageSquare, CheckSquare, UserPlus, Plus, Send } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const patients = [
  { id: 1, name: 'John Doe', age: 35, condition: 'Complex Orthodontic Case' },
  { id: 2, name: 'Jane Smith', age: 42, condition: 'Periodontal Disease and Implant Needs' },
  { id: 3, name: 'Bob Johnson', age: 28, condition: 'Wisdom Teeth Extraction and TMJ Issues' },
]

const careTeamMembers = [
  { id: 1, name: 'Dr. Emily Thompson', role: 'Primary Dentist', avatar: '/placeholder-avatar.jpg' },
  { id: 2, name: 'Dr. Michael Lee', role: 'Orthodontist', avatar: '/placeholder-avatar.jpg' },
  { id: 3, name: 'Dr. Sarah Parker', role: 'Periodontist', avatar: '/placeholder-avatar.jpg' },
  { id: 4, name: 'Dr. David Wilson', role: 'Oral Surgeon', avatar: '/placeholder-avatar.jpg' },
]

const treatmentPlans = [
  { id: 1, patientId: 1, title: 'Orthodontic Treatment Plan', status: 'In Progress', lastUpdated: '2023-07-20' },
  { id: 2, patientId: 2, title: 'Periodontal Treatment and Implant Plan', status: 'Pending Approval', lastUpdated: '2023-07-18' },
  { id: 3, patientId: 3, title: 'Wisdom Teeth Extraction and TMJ Management', status: 'Scheduled', lastUpdated: '2023-07-15' },
]

const tasks = [
  { id: 1, patientId: 1, title: 'Schedule orthodontic consultation', assignee: 'Dr. Michael Lee', dueDate: '2023-07-25', status: 'Pending' },
  { id: 2, patientId: 2, title: 'Review periodontal charts', assignee: 'Dr. Sarah Parker', dueDate: '2023-07-22', status: 'Completed' },
  { id: 3, patientId: 3, title: 'Prepare for wisdom teeth extraction', assignee: 'Dr. David Wilson', dueDate: '2023-07-30', status: 'In Progress' },
]

const messages = [
  { id: 1, patientId: 1, sender: 'Dr. Emily Thompson', content: 'Orthodontic records are ready for review.', timestamp: '2023-07-20 10:30 AM' },
  { id: 2, patientId: 2, sender: 'Dr. Sarah Parker', content: 'Implant site looks good. Proceeding with treatment plan.', timestamp: '2023-07-19 02:15 PM' },
  { id: 3, patientId: 3, sender: 'Dr. David Wilson', content: 'Patient is cleared for wisdom teeth extraction next week.', timestamp: '2023-07-18 11:45 AM' },
]

export default function TreatmentCoordination() {
  const [activeTab, setActiveTab] = useState('patients')
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)
  const [showAddTeamMemberDialog, setShowAddTeamMemberDialog] = useState(false)
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '' })
  const [newTask, setNewTask] = useState({ title: '', assignee: '', dueDate: new Date() })
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    // In a real application, fetch treatment coordination data from Supabase here
  }, [])

  const handleAddTeamMember = () => {
    // In a real application, add the new team member to Supabase
    toast({
      title: "Team Member Added",
      description: `${newTeamMember.name} has been added to the care team.`,
    })
    setShowAddTeamMemberDialog(false)
    setNewTeamMember({ name: '', role: '' })
  }

  const handleAddTask = () => {
    // In a real application, add the new task to Supabase
    toast({
      title: "Task Added",
      description: `New task "${newTask.title}" has been assigned to ${newTask.assignee}.`,
    })
    setShowAddTaskDialog(false)
    setNewTask({ title: '', assignee: '', dueDate: new Date() })
  }

  const handleSendMessage = () => {
    // In a real application, save the message to Supabase
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the care team.",
    })
    setShowMessageDialog(false)
    setNewMessage('')
  }

  const renderPatientCard = (patient: any) => (
    <Card key={patient.id} className="mb-4">
      <CardHeader>
        <CardTitle>{patient.name}</CardTitle>
        <CardDescription>Age: {patient.age} | Condition: {patient.condition}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => setSelectedPatient(patient)}>View Case</Button>
      </CardFooter>
    </Card>
  )

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Users className="mr-2 h-6 w-6" />
          Treatment Coordination and Case Management
        </CardTitle>
        <CardDescription>Manage multidisciplinary care teams and treatment plans</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="care-teams">Care Teams</TabsTrigger>
            <TabsTrigger value="treatment-plans">Treatment Plans</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  {patients.map(renderPatientCard)}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="care-teams">
            <Card>
              <CardHeader>
                <CardTitle>Care Team Members</CardTitle>
                <Button onClick={() => setShowAddTeamMemberDialog(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {careTeamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="flex items-center">
                          <Avatar className="mr-2">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          {member.name}
                        </TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Profile</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatment-plans">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Treatment Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {treatmentPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>{patients.find(p => p.id === plan.patientId)?.name}</TableCell>
                        <TableCell>{plan.title}</TableCell>
                        <TableCell>
                          <Badge variant={plan.status === 'In Progress' ? 'default' : plan.status === 'Pending Approval' ? 'secondary' : 'outline'}>
                            {plan.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{plan.lastUpdated}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Plan</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Tasks and Follow-Ups</CardTitle>
                <Button onClick={() => setShowAddTaskDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{patients.find(p => p.id === task.patientId)?.name}</TableCell>
                        <TableCell>{task.assignee}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>
                          <Badge variant={task.status === 'Completed' ? 'secondary' : task.status === 'In Progress' ? 'default' : 'outline'}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Update Status</Button>
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

      <Dialog open={selectedPatient !== null} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPatient?.name}'s Case</DialogTitle>
            <DialogDescription>
              Manage treatment coordination for this patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="care-team">
                <AccordionTrigger>Care Team</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {careTeamMembers.map((member) => (
                      <Badge key={member.id} variant="secondary" className="text-sm">
                        {member.name} - {member.role}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="treatment-plan">
                <AccordionTrigger>Treatment Plan</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    Current plan: {treatmentPlans.find(p => p.patientId === selectedPatient?.id)?.title}
                  </p>
                  <Button variant="outline" size="sm">View Full Plan</Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="tasks">
                <AccordionTrigger>Tasks</AccordionTrigger>
                
                <AccordionContent>
                  <ul className="list-disc pl-4">
                    {tasks.filter(t => t.patientId === selectedPatient?.id).map((task) => (
                      <li key={task.id} className="text-sm mb-1">
                        {task.title} - Assigned to {task.assignee}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="communication">
                <AccordionTrigger>Communication Log</AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[200px]">
                    {messages.filter(m => m.patientId === selectedPatient?.id).map((message) => (
                      <div key={message.id} className="mb-2">
                        <p className="text-sm font-semibold">{message.sender}</p>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                      </div>
                    ))}
                  </ScrollArea>
                  <Button onClick={() => setShowMessageDialog(true)} className="mt-2">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedPatient(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddTeamMemberDialog} onOpenChange={setShowAddTeamMemberDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to the care team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newTeamMember.name}
                onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Input
                id="role"
                value={newTeamMember.role}
                onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddTeamMember}>Add Team Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>
              Create a new task for the care team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignee" className="text-right">
                Assignee
              </Label>
              <Select
                value={newTask.assignee}
                onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {careTeamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={newTask.dueDate}
                  onSelect={(date) => date && setNewTask({ ...newTask, dueDate: date })}
                  className="rounded-md border"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to the care team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Type your message here."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSendMessage}>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
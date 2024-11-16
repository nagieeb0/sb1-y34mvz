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
import { Switch } from "@/components/ui/switch"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MessageSquare, Mail, Phone, Send, Plus, AlertCircle, CheckCircle, Clock, Globe, BarChart2 } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const messageHistory = [
  { id: 1, patientName: 'John Doe', channel: 'SMS', content: 'Your appointment is tomorrow at 2 PM.', timestamp: '2023-07-24 10:00 AM', status: 'Sent' },
  { id: 2, patientName: 'Jane Smith', channel: 'Email', content: 'Please confirm your appointment for next week.', timestamp: '2023-07-23 3:30 PM', status: 'Delivered' },
  { id: 3, patientName: 'Bob Johnson', channel: 'In-App', content: 'Do I need to fast before my appointment?', timestamp: '2023-07-22 11:15 AM', status: 'Received' },
  { id: 4, patientName: 'Alice Brown', channel: 'SMS', content: 'Your test results are ready. Please log in to view them.', timestamp: '2023-07-21 4:45 PM', status: 'Read' },
]

const messageTemplates = [
  { id: 1, name: 'Appointment Reminder', content: 'Dear [Patient Name], this is a reminder that you have an appointment scheduled for [Date] at [Time]. Please confirm your attendance.', language: 'English' },
  { id: 2, name: 'Follow-up', content: 'Hello [Patient Name], we hope you're feeling better after your recent visit. If you have any concerns, please don't hesitate to contact us.', language: 'English' },
  { id: 3, name: 'Wellness Tip', content: 'Tip of the day: Remember to floss daily for optimal oral health!', language: 'English' },
  { id: 4, name: 'Appointment Reminder', content: 'Estimado/a [Patient Name], este es un recordatorio de que tiene una cita programada para el [Date] a las [Time]. Por favor, confirme su asistencia.', language: 'Spanish' },
]

const engagementData = [
  { channel: 'SMS', openRate: 95, clickRate: 40, responseRate: 30 },
  { channel: 'Email', openRate: 75, clickRate: 25, responseRate: 15 },
  { channel: 'In-App', openRate: 85, clickRate: 35, responseRate: 25 },
]

export default function CommunicationHub() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedChannel, setSelectedChannel] = useState('all')
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false)
  const [newMessage, setNewMessage] = useState({ recipient: '', channel: '', content: '' })
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [newTemplate, setNewTemplate] = useState({ name: '', content: '', language: 'English' })

  useEffect(() => {
    // In a real application, fetch communication data from Supabase here
  }, [])

  const handleSendMessage = () => {
    // In a real application, send the message via the selected channel and save to Supabase
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${newMessage.recipient} via ${newMessage.channel}.`,
    })
    setShowNewMessageDialog(false)
    setNewMessage({ recipient: '', channel: '', content: '' })
  }

  const handleSaveTemplate = () => {
    // In a real application, save the new template to Supabase
    toast({
      title: "Template Saved",
      description: `Your new template "${newTemplate.name}" has been saved.`,
    })
    setShowTemplateDialog(false)
    setNewTemplate({ name: '', content: '', language: 'English' })
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'SMS':
        return <Phone className="h-4 w-4" />
      case 'Email':
        return <Mail className="h-4 w-4" />
      case 'In-App':
        return <MessageSquare className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sent':
        return <Badge className="bg-blue-500"><Clock className="mr-1 h-3 w-3" /> Sent</Badge>
      case 'Delivered':
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Delivered</Badge>
      case 'Read':
        return <Badge className="bg-purple-500"><CheckCircle className="mr-1 h-3 w-3" /> Read</Badge>
      case 'Received':
        return <Badge className="bg-yellow-500"><AlertCircle className="mr-1 h-3 w-3" /> Received</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <MessageSquare className="mr-2 h-6 w-6" />
          Patient Communication Hub
        </CardTitle>
        <CardDescription>Manage all patient communications from a single interface</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Message History</CardTitle>
                <div className="flex justify-between items-center">
                  <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Channels</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="In-App">In-App</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setShowNewMessageDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Message
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messageHistory
                      .filter(msg => selectedChannel === 'all' || msg.channel === selectedChannel)
                      .map((message) => (
                        <TableRow key={message.id}>
                          <TableCell>{message.patientName}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getChannelIcon(message.channel)}
                              <span className="ml-2">{message.channel}</span>
                            </div>
                          </TableCell>
                          <TableCell>{message.content}</TableCell>
                          <TableCell>{message.timestamp}</TableCell>
                          <TableCell>{getStatusBadge(message.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
                <Button onClick={() => setShowTemplateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> New Template
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messageTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>{template.name}</TableCell>
                        <TableCell>{template.content}</TableCell>
                        <TableCell>{template.language}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation">
            <Card>
              <CardHeader>
                <CardTitle>Automated Messaging Triggers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Appointment Reminder</h3>
                      <p className="text-sm text-muted-foreground">Send 24 hours before appointment</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Follow-up Message</h3>
                      <p className="text-sm text-muted-foreground">Send 2 days after appointment</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Wellness Tips</h3>
                      <p className="text-sm text-muted-foreground">Send weekly</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="channel" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="openRate" name="Open Rate" fill="#8884d8" />
                      <Bar dataKey="clickRate" name="Click Rate" fill="#82ca9d" />
                      <Bar dataKey="responseRate" name="Response Rate" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
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
        <Button variant="link" onClick={() => window.open('/communication-hub-help', '_blank')}>
          Learn More About Communication Hub
        </Button>
      </CardFooter>

      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send New Message</DialogTitle>
            <DialogDescription>
              Compose and send a new message to a patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient" className="text-right">
                Recipient
              </Label>
              <Input
                id="recipient"
                value={newMessage.recipient}
                onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="channel" className="text-right">
                Channel
              </Label>
              <Select
                value={newMessage.channel}
                onValueChange={(value) => setNewMessage({ ...newMessage, channel: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem  value="SMS">SMS</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="In-App">In-App</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Message
              </Label>
              <Textarea
                id="content"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a new message template for quick use.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="templateName" className="text-right">
                Name
              </Label>
              <Input
                id="templateName"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="templateContent" className="text-right">
                Content
              </Label>
              <Textarea
                id="templateContent"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="templateLanguage" className="text-right">
                Language
              </Label>
              <Select
                value={newTemplate.language}
                onValueChange={(value) => setNewTemplate({ ...newTemplate, language: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
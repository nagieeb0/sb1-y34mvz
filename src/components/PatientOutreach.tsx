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
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Mail, MessageSquare, Bell, Facebook, Instagram, Plus, FileText, Send, BarChart2, Users, Calendar as CalendarIcon, Gift, Book, Star } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const outreachCampaigns = [
  { id: 1, name: 'Birthday Greetings', type: 'Email', status: 'Active', targetGroup: 'All Patients', lastSent: '2023-07-20', engagement: 75 },
  { id: 2, name: 'Appointment Reminders', type: 'SMS', status: 'Active', targetGroup: 'Scheduled Patients', lastSent: '2023-07-21', engagement: 90 },
  { id: 3, name: 'Oral Health Tips', type: 'Email Newsletter', status: 'Scheduled', targetGroup: 'All Patients', lastSent: '2023-07-15', engagement: 60 },
  { id: 4, name: 'Treatment Follow-up', type: 'In-App Notification', status: 'Active', targetGroup: 'Post-Treatment Patients', lastSent: '2023-07-19', engagement: 85 },
]

const patientGroups = [
  { id: 1, name: 'All Patients', count: 1000 },
  { id: 2, name: 'New Patients', count: 150 },
  { id: 3, name: 'Scheduled Patients', count: 200 },
  { id: 4, name: 'Post-Treatment Patients', count: 300 },
  { id: 5, name: 'Inactive Patients', count: 350 },
]

const educationalContent = [
  { id: 1, title: 'Importance of Flossing', type: 'Article', lastUsed: '2023-07-15' },
  { id: 2, title: 'Proper Brushing Techniques', type: 'Video', lastUsed: '2023-07-18' },
  { id: 3, title: 'Understanding Gum Disease', type: 'Infographic', lastUsed: '2023-07-10' },
  { id: 4, title: 'Nutrition for Healthy Teeth', type: 'Newsletter', lastUsed: '2023-07-20' },
]

const upcomingEvents = [
  { id: 1, name: 'Dental Health Awareness Day', date: '2023-08-15', registrations: 45 },
  { id: 2, name: 'Kids Dental Care Workshop', date: '2023-08-22', registrations: 30 },
  { id: 3, name: 'Senior Citizens Oral Health Seminar', date: '2023-09-05', registrations: 25 },
]

const engagementMetrics = [
  { month: 'Jan', emailOpens: 250, smsResponses: 180, appInteractions: 300 },
  { month: 'Feb', emailOpens: 280, smsResponses: 200, appInteractions: 320 },
  { month: 'Mar', emailOpens: 300, smsResponses: 220, appInteractions: 350 },
  { month: 'Apr', emailOpens: 320, smsResponses: 240, appInteractions: 380 },
  { month: 'May', emailOpens: 350, smsResponses: 260, appInteractions: 400 },
  { month: 'Jun', emailOpens: 380, smsResponses: 280, appInteractions: 420 },
]

const channelPreferences = [
  { name: 'Email', value: 40 },
  { name: 'SMS', value: 30 },
  { name: 'In-App', value: 20 },
  { name: 'Social Media', value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function PatientOutreach() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [showCreateCampaignDialog, setShowCreateCampaignDialog] = useState(false)
  const [showAddContentDialog, setShowAddContentDialog] = useState(false)
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false)
  const [newCampaign, setNewCampaign] = useState({ name: '', type: '', targetGroup: '', content: '' })
  const [newContent, setNewContent] = useState({ title: '', type: '', content: '' })
  const [newEvent, setNewEvent] = useState({ name: '', date: new Date(), description: '' })

  useEffect(() => {
    // In a real application, fetch outreach data from Supabase here
  }, [])

  const handleCreateCampaign = () => {
    // In a real application, save the new campaign to Supabase
    toast({
      title: "Campaign Created",
      description: `New outreach campaign "${newCampaign.name}" has been created.`,
    })
    setShowCreateCampaignDialog(false)
    setNewCampaign({ name: '', type: '', targetGroup: '', content: '' })
  }

  const handleAddContent = () => {
    // In a real application, save the new content to Supabase
    toast({
      title: "Content Added",
      description: `New educational content "${newContent.title}" has been added.`,
    })
    setShowAddContentDialog(false)
    setNewContent({ title: '', type: '', content: '' })
  }

  const handleCreateEvent = () => {
    // In a real application, save the new event to Supabase
    toast({
      title: "Event Created",
      description: `New event "${newEvent.name}" has been created.`,
    })
    setShowCreateEventDialog(false)
    setNewEvent({ name: '', date: new Date(), description: '' })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">Active</Badge>
      case 'Scheduled':
        return <Badge variant="secondary">Scheduled</Badge>
      case 'Completed':
        return <Badge variant="outline">Completed</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'Email':
        return <Mail className="h-4 w-4" />
      case 'SMS':
        return <MessageSquare className="h-4 w-4" />
      case 'In-App Notification':
        return <Bell className="h-4 w-4" />
      case 'Email Newsletter':
        return <FileText className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Send className="mr-2 h-6 w-6" />
          Patient Outreach and Engagement Program
        </CardTitle>
        <CardDescription>Manage outreach campaigns, educational content, and patient engagement initiatives</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="groups">Patient Groups</TabsTrigger>
            <TabsTrigger value="content">Educational Content</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Outreach Campaigns</CardTitle>
                <Button onClick={() => setShowCreateCampaignDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Target Group</TableHead>
                      <TableHead>Last Sent</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outreachCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getCampaignTypeIcon(campaign.type)}
                            <span className="ml-2">{campaign.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>{campaign.targetGroup}</TableCell>
                        <TableCell>{campaign.lastSent}</TableCell>
                        <TableCell>
                          <Progress value={campaign.engagement} className="w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardHeader>
                <CardTitle>Patient Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Group Name</TableHead>
                      <TableHead>Patient Count</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientGroups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell>{group.name}</TableCell>
                        <TableCell>{group.count}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Patients</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Educational Content</CardTitle>
                <Button onClick={() => setShowAddContentDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Content
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {educationalContent.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell>{content.title}</TableCell>
                        <TableCell>{content.type}</TableCell>
                        <TableCell>{content.lastUsed}</TableCell>
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

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <Button onClick={() => setShowCreateEventDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Registrations</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.registrations}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Manage Event</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Engagement Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={engagementMetrics}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="emailOpens" stroke="#8884d8" name="Email Opens" />
                            <Line type="monotone" dataKey="smsResponses" stroke="#82ca9d" name="SMS Responses" />
                            <Line type="monotone" dataKey="appInteractions" stroke="#ffc658" name="App Interactions" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Channel Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={channelPreferences}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {channelPreferences.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showCreateCampaignDialog} onOpenChange={setShowCreateCampaignDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Outreach Campaign</DialogTitle>
            <DialogDescription>
              Set up a new outreach campaign for your patients.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="campaignName" className="text-right">
                Name
              </Label>
              <Input
                id="campaignName"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="campaignType" className="text-right">
                Type
              </Label>
              <Select
                value={newCampaign.type}
                onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value })}
              >
                <SelectTrigger id="campaignType" className="col-span-3">
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="In-App Notification">In-App Notification</SelectItem>
                  <SelectItem value="Email Newsletter">Email Newsletter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetGroup" className="text-right">
                Target Group
              </Label>
              <Select
                value={newCampaign.targetGroup}
                onValueChange={(value) => setNewCampaign({ ...newCampaign, targetGroup: value })}
              >
                <SelectTrigger id="targetGroup" className="col-span-3">
                  <SelectValue placeholder="Select target group" />
                </SelectTrigger>
                <SelectContent>
                  {patientGroups.map((group) => (
                    <SelectItem key={group.id} value={group.name}>{group.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="campaignContent" className="text-right">
                Content
              </Label>
              <Textarea
                id="campaignContent"
                value={newCampaign.content}
                onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateCampaign}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddContentDialog} onOpenChange={setShowAddContentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Educational Content</DialogTitle>
            <DialogDescription>
              Add new educational content for patient outreach.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contentTitle" className="text-right">
                Title
              </Label>
              <Input
                id="contentTitle"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contentType" className="text-right">
                Type
              </Label>
              <Select
                value={newContent.type}
                onValueChange={(value) => setNewContent({ ...newContent, type: value })}
              >
                <SelectTrigger id="contentType" className="col-span-3">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Article">Article</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Infographic">Infographic</SelectItem>
                  <SelectItem value="Newsletter">Newsletter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contentBody" className="text-right">
                Content
              </Label>
              <Textarea
                id="contentBody"
                value={newContent.content}
                onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddContent}>Add Content</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Set up a new event for patient engagement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventName" className="text-right">
                Name
              </Label>
              <Input
                id="eventName"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventDate" className="text-right">
                Date
              </Label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={newEvent.date}
                  onSelect={(date) => date && setNewEvent({ ...newEvent, date: date })}
                  className="rounded-md border"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventDescription" className="text-right">
                Description
              </Label>
              <Textarea
                id="eventDescription"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateEvent}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
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
import { Mail, MessageSquare, Facebook, Instagram, Plus, FileText, Send, BarChart2, Users, Calendar as CalendarIcon } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const campaigns = [
  { id: 1, name: 'Summer Smile Special', type: 'Email', status: 'Active', startDate: '2023-07-01', endDate: '2023-08-31', engagement: 75 },
  { id: 2, name: 'Back to School Check-ups', type: 'SMS', status: 'Scheduled', startDate: '2023-08-15', endDate: '2023-09-15', engagement: 0 },
  { id: 3, name: 'Dental Hygiene Awareness', type: 'Social Media', status: 'Completed', startDate: '2023-06-01', endDate: '2023-06-30', engagement: 88 },
  { id: 4, name: 'New Patient Welcome', type: 'Email', status: 'Active', startDate: '2023-01-01', endDate: '2023-12-31', engagement: 92 },
]

const patientSegments = [
  { id: 1, name: 'New Patients', count: 150, description: 'Patients who joined in the last 3 months' },
  { id: 2, name: 'Regular Check-up Due', count: 300, description: 'Patients due for their 6-month check-up' },
  { id: 3, name: 'Treatment Follow-up', count: 75, description: 'Patients who recently completed a major treatment' },
  { id: 4, name: 'Inactive Patients', count: 200, description: 'Patients who haven\'t visited in over a year' },
]

const contentLibrary = [
  { id: 1, name: 'Welcome Email Template', type: 'Email', lastUsed: '2023-07-15' },
  { id: 2, name: 'Appointment Reminder', type: 'SMS', lastUsed: '2023-07-20' },
  { id: 3, name: 'Dental Tips Infographic', type: 'Social Media', lastUsed: '2023-07-10' },
  { id: 4, name: 'Special Offer Banner', type: 'Email', lastUsed: '2023-07-05' },
]

const campaignPerformance = [
  { name: 'Week 1', emailOpens: 250, clicks: 100, conversions: 20 },
  { name: 'Week 2', emailOpens: 300, clicks: 150, conversions: 30 },
  { name: 'Week 3', emailOpens: 280, clicks: 120, conversions: 25 },
  { name: 'Week 4', emailOpens: 350, clicks: 180, conversions: 40 },
]

const channelEngagement = [
  { name: 'Email', value: 45 },
  { name: 'SMS', value: 30 },
  { name: 'Social Media', value: 25 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function MarketingAutomation() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [showCreateCampaignDialog, setShowCreateCampaignDialog] = useState(false)
  const [showCreateSegmentDialog, setShowCreateSegmentDialog] = useState(false)
  const [showAddContentDialog, setShowAddContentDialog] = useState(false)
  const [newCampaign, setNewCampaign] = useState({ name: '', type: '', startDate: new Date(), endDate: new Date() })
  const [newSegment, setNewSegment] = useState({ name: '', description: '' })
  const [newContent, setNewContent] = useState({ name: '', type: '', content: '' })

  useEffect(() => {
    // In a real application, fetch marketing data from Supabase here
  }, [])

  const handleCreateCampaign = () => {
    // In a real application, save the new campaign to Supabase
    toast({
      title: "Campaign Created",
      description: `New campaign "${newCampaign.name}" has been created.`,
    })
    setShowCreateCampaignDialog(false)
    setNewCampaign({ name: '', type: '', startDate: new Date(), endDate: new Date() })
  }

  const handleCreateSegment = () => {
    // In a real application, save the new patient segment to Supabase
    toast({
      title: "Segment Created",
      description: `New patient segment "${newSegment.name}" has been created.`,
    })
    setShowCreateSegmentDialog(false)
    setNewSegment({ name: '', description: '' })
  }

  const handleAddContent = () => {
    // In a real application, save the new content to Supabase
    toast({
      title: "Content Added",
      description: `New content "${newContent.name}" has been added to the library.`,
    })
    setShowAddContentDialog(false)
    setNewContent({ name: '', type: '', content: '' })
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
      case 'Social Media':
        return <Facebook className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Send className="mr-2 h-6 w-6" />
          Marketing Automation and Campaign Management
        </CardTitle>
        <CardDescription>Create, manage, and analyze marketing campaigns for your dental clinic</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="segments">Patient Segments</TabsTrigger>
            <TabsTrigger value="content">Content Library</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Campaigns</CardTitle>
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
                      <TableHead>Date Range</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getCampaignTypeIcon(campaign.type)}
                            <span className="ml-2">{campaign.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>{`${campaign.startDate} - ${campaign.endDate}`}</TableCell>
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

          <TabsContent value="segments">
            <Card>
              <CardHeader>
                <CardTitle>Patient Segments</CardTitle>
                <Button onClick={() => setShowCreateSegmentDialog(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  Create Segment
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Segment Name</TableHead>
                      <TableHead>Patient Count</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientSegments.map((segment) => (
                      <TableRow key={segment.id}>
                        <TableCell>{segment.name}</TableCell>
                        <TableCell>{segment.count}</TableCell>
                        <TableCell>{segment.description}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit Segment</Button>
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
                <CardTitle>Content Library</CardTitle>
                <Button onClick={() => setShowAddContentDialog(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Add Content
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentLibrary.map((content) => (
                      <TableRow key={content.id}>
                        <TableCell>{content.name}</TableCell>
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

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Campaign Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={campaignPerformance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="emailOpens" stroke="#8884d8" name="Email Opens" />
                            <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                            <Line type="monotone" dataKey="conversions" stroke="#ffc658" name="Conversions" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Channel Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={channelEngagement}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent *   100).toFixed(0)}%`}
                            >
                              {channelEngagement.map((entry, index) => (
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
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Set up a new marketing campaign for your clinic.
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
                  <SelectItem value="Social Media">Social Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={newCampaign.startDate}
                  onSelect={(date) => date && setNewCampaign({ ...newCampaign, startDate: date })}
                  className="rounded-md border"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={newCampaign.endDate}
                  onSelect={(date) => date && setNewCampaign({ ...newCampaign, endDate: date })}
                  className="rounded-md border"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateCampaign}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateSegmentDialog} onOpenChange={setShowCreateSegmentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Patient Segment</DialogTitle>
            <DialogDescription>
              Define a new patient segment for targeted marketing.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="segmentName" className="text-right">
                Name
              </Label>
              <Input
                id="segmentName"
                value={newSegment.name}
                onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="segmentDescription" className="text-right">
                Description
              </Label>
              <Textarea
                id="segmentDescription"
                value={newSegment.description}
                onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateSegment}>Create Segment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddContentDialog} onOpenChange={setShowAddContentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Content to Library</DialogTitle>
            <DialogDescription>
              Add new marketing content to your content library.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contentName" className="text-right">
                Name
              </Label>
              <Input
                id="contentName"
                value={newContent.name}
                onChange={(e) => setNewContent({ ...newContent, name: e.target.value })}
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
                  <SelectItem value="Email">Email Template</SelectItem>
                  <SelectItem value="SMS">SMS Template</SelectItem>
                  <SelectItem value="Social Media">Social Media Post</SelectItem>
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
    </Card>
  )
}
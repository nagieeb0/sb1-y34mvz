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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, FileText, Users, Calendar as CalendarIcon, CheckSquare, Plus, Bell, Zap } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const emergencyProtocols = [
  { id: 1, title: 'Medical Emergency Response', category: 'Medical', lastUpdated: '2023-07-15' },
  { id: 2, title: 'Fire Evacuation Procedure', category: 'Fire Safety', lastUpdated: '2023-06-30' },
  { id: 3, title: 'Equipment Failure Protocol', category: 'Equipment', lastUpdated: '2023-07-10' },
  { id: 4, title: 'Natural Disaster Response', category: 'Disaster', lastUpdated: '2023-07-01' },
]

const actionPlans = [
  { id: 1, title: 'Cardiac Arrest Response', status: 'Active', lastReviewed: '2023-07-20' },
  { id: 2, title: 'Anaphylaxis Management', status: 'Under Review', lastReviewed: '2023-07-15' },
  { id: 3, title: 'Severe Bleeding Control', status: 'Active', lastReviewed: '2023-07-18' },
]

const emergencyAlerts = [
  { id: 1, type: 'Fire Alarm', location: 'Main Building', timestamp: '2023-07-21 14:30', status: 'Resolved' },
  { id: 2, type: 'Medical Emergency', location: 'Treatment Room 3', timestamp: '2023-07-20 11:15', status: 'Resolved' },
  { id: 3, type: 'Equipment Failure', location: 'X-Ray Room', timestamp: '2023-07-19 09:45', status: 'In Progress' },
]

const staffTraining = [
  { id: 1, name: 'Dr. Emily Thompson', training: 'CPR Certification', completionDate: '2023-05-15', expirationDate: '2024-05-15' },
  { id: 2, name: 'Sarah Johnson', training: 'Fire Safety', completionDate: '2023-06-01', expirationDate: '2024-06-01' },
  { id: 3, name: 'Michael Lee', training: 'Emergency First Aid', completionDate: '2023-04-20', expirationDate: '2024-04-20' },
]

const safetyAssessments = [
  { id: 1, area: 'Reception', lastAssessment: '2023-07-10', status: 'Completed', score: 95 },
  { id: 2, area: 'Treatment Rooms', lastAssessment: '2023-07-12', status: 'In Progress', score: 0 },
  { id: 3, area: 'Sterilization Area', lastAssessment: '2023-07-08', status: 'Completed', score: 88 },
]

export default function EmergencyResponse() {
  const [activeTab, setActiveTab] = useState('protocols')
  const [showAddProtocolDialog, setShowAddProtocolDialog] = useState(false)
  const [showAddActionPlanDialog, setShowAddActionPlanDialog] = useState(false)
  const [showReportEmergencyDialog, setShowReportEmergencyDialog] = useState(false)
  const [newProtocol, setNewProtocol] = useState({ title: '', category: '', content: '' })
  const [newActionPlan, setNewActionPlan] = useState({ title: '', content: '' })
  const [newEmergency, setNewEmergency] = useState({ type: '', location: '', description: '' })

  useEffect(() => {
    // In a real application, fetch emergency response data from Supabase here
  }, [])

  const handleAddProtocol = () => {
    // In a real application, save the new protocol to Supabase
    toast({
      title: "Protocol Added",
      description: `New emergency protocol "${newProtocol.title}" has been added.`,
    })
    setShowAddProtocolDialog(false)
    setNewProtocol({ title: '', category: '', content: '' })
  }

  const handleAddActionPlan = () => {
    // In a real application, save the new action plan to Supabase
    toast({
      title: "Action Plan Added",
      description: `New action plan "${newActionPlan.title}" has been added.`,
    })
    setShowAddActionPlanDialog(false)
    setNewActionPlan({ title: '', content: '' })
  }

  const handleReportEmergency = () => {
    // In a real application, save the emergency report to Supabase and trigger alerts
    toast({
      title: "Emergency Reported",
      description: "Emergency has been reported and staff have been alerted.",
      variant: "destructive",
    })
    setShowReportEmergencyDialog(false)
    setNewEmergency({ type: '', location: '', description: '' })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success">Active</Badge>
      case 'Under Review':
        return <Badge variant="warning">Under Review</Badge>
      case 'Resolved':
        return <Badge variant="secondary">Resolved</Badge>
      case 'In Progress':
        return <Badge variant="default">In Progress</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <AlertTriangle className="mr-2 h-6 w-6" />
          Emergency Response and Patient Safety
        </CardTitle>
        <CardDescription>Manage emergency protocols, action plans, and patient safety measures</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
            <TabsTrigger value="action-plans">Action Plans</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="report" className="bg-red-500 text-white">
              Report Emergency
            </TabsTrigger>
          </TabsList>

          <TabsContent value="protocols">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Protocols</CardTitle>
                <Button onClick={() => setShowAddProtocolDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Protocol
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emergencyProtocols.map((protocol) => (
                      <TableRow key={protocol.id}>
                        <TableCell>{protocol.title}</TableCell>
                        <TableCell>{protocol.category}</TableCell>
                        <TableCell>{protocol.lastUpdated}</TableCell>
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

          <TabsContent value="action-plans">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Action Plans</CardTitle>
                <Button onClick={() => setShowAddActionPlanDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Action Plan
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Reviewed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {actionPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>{plan.title}</TableCell>
                        <TableCell>{getStatusBadge(plan.status)}</TableCell>
                        <TableCell>{plan.lastReviewed}</TableCell>
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

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emergencyAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>{alert.type}</TableCell>
                        <TableCell>{alert.location}</TableCell>
                        <TableCell>{alert.timestamp}</TableCell>
                        <TableCell>{getStatusBadge(alert.status)}</TableCell>
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

          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>Staff Training and Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Training/Certification</TableHead>
                      <TableHead>Completion Date</TableHead>
                      <TableHead>Expiration Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffTraining.map((training) => (
                      <TableRow key={training.id}>
                        <TableCell>{training.name}</TableCell>
                        <TableCell>{training.training}</TableCell>
                        <TableCell>{training.completionDate}</TableCell>
                        <TableCell>{training.expirationDate}</TableCell>
                        <TableCell>
                          {new Date(training.expirationDate) > new Date() ? (
                            <Badge variant="success">Valid</Badge>
                          ) : (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button>Schedule Training Session</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>Patient Safety Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Area</TableHead>
                      <TableHead>Last Assessment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Safety Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safetyAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell>{assessment.area}</TableCell>
                        <TableCell>{assessment.lastAssessment}</TableCell>
                        <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                        <TableCell>
                          {assessment.status === 'Completed' ? (
                            <Progress value={assessment.score} className="w-[60px]" />
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                
                <Button>Start New Assessment</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="report">
            <Card>
              <CardHeader>
                <CardTitle>Report Emergency</CardTitle>
                <CardDescription>Use this form to report an ongoing emergency situation</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" size="lg" onClick={() => setShowReportEmergencyDialog(true)}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Emergency Now
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showAddProtocolDialog} onOpenChange={setShowAddProtocolDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Emergency Protocol</DialogTitle>
            <DialogDescription>
              Create a new emergency protocol for the clinic.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="protocolTitle" className="text-right">
                Title
              </Label>
              <Input
                id="protocolTitle"
                value={newProtocol.title}
                onChange={(e) => setNewProtocol({ ...newProtocol, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="protocolCategory" className="text-right">
                Category
              </Label>
              <Select
                value={newProtocol.category}
                onValueChange={(value) => setNewProtocol({ ...newProtocol, category: value })}
              >
                <SelectTrigger id="protocolCategory" className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Fire Safety">Fire Safety</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                  <SelectItem value="Disaster">Disaster</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="protocolContent" className="text-right">
                Content
              </Label>
              <Textarea
                id="protocolContent"
                value={newProtocol.content}
                onChange={(e) => setNewProtocol({ ...newProtocol, content: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddProtocol}>Add Protocol</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddActionPlanDialog} onOpenChange={setShowAddActionPlanDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Action Plan</DialogTitle>
            <DialogDescription>
              Create a new emergency action plan for the clinic.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="actionPlanTitle" className="text-right">
                Title
              </Label>
              <Input
                id="actionPlanTitle"
                value={newActionPlan.title}
                onChange={(e) => setNewActionPlan({ ...newActionPlan, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="actionPlanContent" className="text-right">
                Content
              </Label>
              <Textarea
                id="actionPlanContent"
                value={newActionPlan.content}
                onChange={(e) => setNewActionPlan({ ...newActionPlan, content: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddActionPlan}>Add Action Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReportEmergencyDialog} onOpenChange={setShowReportEmergencyDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report Emergency</DialogTitle>
            <DialogDescription>
              Report an ongoing emergency situation. This will alert all staff members.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emergencyType" className="text-right">
                Type
              </Label>
              <Select
                value={newEmergency.type}
                onValueChange={(value) => setNewEmergency({ ...newEmergency, type: value })}
              >
                <SelectTrigger id="emergencyType" className="col-span-3">
                  <SelectValue placeholder="Select emergency type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                  <SelectItem value="Fire">Fire</SelectItem>
                  <SelectItem value="Equipment Failure">Equipment Failure</SelectItem>
                  <SelectItem value="Natural Disaster">Natural Disaster</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emergencyLocation" className="text-right">
                Location
              </Label>
              <Input
                id="emergencyLocation"
                value={newEmergency.location}
                onChange={(e) => setNewEmergency({ ...newEmergency, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="emergencyDescription" className="text-right">
                Description
              </Label>
              <Textarea
                id="emergencyDescription"
                value={newEmergency.description}
                onChange={(e) => setNewEmergency({ ...newEmergency, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleReportEmergency} variant="destructive">
              Report Emergency
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
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
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Shield, FileText, Users, AlertTriangle, BarChart2, Plus, Upload, Download } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const complianceRequirements = [
  { id: 1, category: 'HIPAA', requirement: 'Privacy Policy', status: 'Compliant', dueDate: '2023-12-31' },
  { id: 2, category: 'OSHA', requirement: 'Hazard Communication', status: 'Pending', dueDate: '2023-08-15' },
  { id: 3, category: 'State Law', requirement: 'Dental Practice Act Compliance', status: 'In Progress', dueDate: '2023-09-30' },
  { id: 4, category: 'HIPAA', requirement: 'Security Risk Assessment', status: 'Non-Compliant', dueDate: '2023-07-31' },
  { id: 5, category: 'OSHA', requirement: 'Bloodborne Pathogens Training', status: 'Compliant', dueDate: '2024-01-15' },
]

const documents = [
  { id: 1, name: 'HIPAA Privacy Policy', category: 'HIPAA', lastUpdated: '2023-06-15', version: '2.1' },
  { id: 2, name: 'Infection Control Procedures', category: 'OSHA', lastUpdated: '2023-05-20', version: '3.0' },
  { id: 3, name: 'Employee Handbook', category: 'HR', lastUpdated: '2023-04-10', version: '4.2' },
  { id: 4, name: 'Emergency Procedures', category: 'Safety', lastUpdated: '2023-07-01', version: '1.5' },
  { id: 5, name: 'Patient Rights and Responsibilities', category: 'Patient Care', lastUpdated: '2023-03-25', version: '2.3' },
]

const staffTraining = [
  { id: 1, name: 'Dr. Emily Thompson', training: 'HIPAA Compliance', completionDate: '2023-05-15', expirationDate: '2024-05-15' },
  { id: 2, name: 'Sarah Johnson', training: 'OSHA Safety Standards', completionDate: '2023-06-01', expirationDate: '2024-06-01' },
  { id: 3, name: 'Michael Lee', training: 'Infection Control', completionDate: '2023-04-20', expirationDate: '2024-04-20' },
  { id: 4, name: 'Jessica Brown', training: 'Patient Data Security', completionDate: '2023-07-10', expirationDate: '2024-07-10' },
  { id: 5, name: 'David Wilson', training: 'CPR Certification', completionDate: '2023-02-28', expirationDate: '2025-02-28' },
]

const incidents = [
  { id: 1, type: 'Data Breach', date: '2023-07-05', status: 'Under Investigation', description: 'Potential unauthorized access to patient records.' },
  { id: 2, type: 'OSHA Violation', date: '2023-06-20', status: 'Resolved', description: 'Improper disposal of sharps container.' },
  { id: 3, type: 'Patient Complaint', date: '2023-07-12', status: 'Pending Review', description: 'Allegation of privacy violation during treatment.' },
]

const complianceMetrics = [
  { name: 'HIPAA', compliance: 85 },
  { name: 'OSHA', compliance: 92 },
  { name: 'State Laws', compliance: 78 },
  { name: 'Patient Privacy', compliance: 88 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function ComplianceManagement() {
  const [activeTab, setActiveTab] = useState('checklist')
  const [showAddRequirementDialog, setShowAddRequirementDialog] = useState(false)
  const [showUploadDocumentDialog, setShowUploadDocumentDialog] = useState(false)
  const [showReportIncidentDialog, setShowReportIncidentDialog] = useState(false)
  const [newRequirement, setNewRequirement] = useState({ category: '', requirement: '', dueDate: new Date() })
  const [newDocument, setNewDocument] = useState({ name: '', category: '', file: null })
  const [newIncident, setNewIncident] = useState({ type: '', description: '' })

  useEffect(() => {
    // In a real application, fetch compliance data from Supabase here
  }, [])

  const handleAddRequirement = () => {
    // In a real application, add the new requirement to Supabase
    toast({
      title: "Requirement Added",
      description: `New compliance requirement "${newRequirement.requirement}" has been added.`,
    })
    setShowAddRequirementDialog(false)
    setNewRequirement({ category: '', requirement: '', dueDate: new Date() })
  }

  const handleUploadDocument = () => {
    // In a real application, upload the document to Supabase storage
    toast({
      title: "Document Uploaded",
      description: `"${newDocument.name}" has been uploaded successfully.`,
    })
    setShowUploadDocumentDialog(false)
    setNewDocument({ name: '', category: '', file: null })
  }

  const handleReportIncident = () => {
    // In a real application, save the incident report to Supabase
    toast({
      title: "Incident Reported",
      description: "The incident has been logged and will be investigated.",
    })
    setShowReportIncidentDialog(false)
    setNewIncident({ type: '', description: '' })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Compliant':
        return <Badge variant="success">Compliant</Badge>
      case 'Non-Compliant':
        return <Badge variant="destructive">Non-Compliant</Badge>
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>
      case 'In Progress':
        return <Badge variant="secondary">In Progress</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Shield className="mr-2 h-6 w-6" />
          Compliance and Regulatory Management
        </CardTitle>
        <CardDescription>Manage compliance requirements, documents, and training for your clinic</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Checklist</CardTitle>
                <Button onClick={() => setShowAddRequirementDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Requirement
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Requirement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complianceRequirements.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>{req.category}</TableCell>
                        <TableCell>{req.requirement}</TableCell>
                        <TableCell>{getStatusBadge(req.status)}</TableCell>
                        <TableCell>{req.dueDate}</TableCell>
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

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Management</CardTitle>
                <Button onClick={() => setShowUploadDocumentDialog(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.category}</TableCell>
                        <TableCell>{doc.lastUpdated}</TableCell>
                        <TableCell>{doc.version}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
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

          <TabsContent value="incidents">
            <Card>
              <CardHeader>
                <CardTitle>Incident Reporting and Resolution</CardTitle>
                <Button onClick={() => setShowReportIncidentDialog(true)}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Report Incident
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Incident Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidents.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>{incident.type}</TableCell>
                        <TableCell>{incident.date}</TableCell>
                        <TableCell>{getStatusBadge(incident.status)}</TableCell>
                        <TableCell>{incident.description}</TableCell>
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

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Reports and Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Compliance Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={complianceMetrics}
                              dataKey="compliance"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              label
                            >
                              {complianceMetrics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Compliance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {complianceMetrics.map((metric) => (
                          <div key={metric.name} className="flex items-center">
                            <span className="w-32">{metric.name}</span>
                            <Progress value={metric.compliance} className="flex-1" />
                            <span className="w-12 text-right">{metric.compliance}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Generate Custom Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-4">
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compliance-summary">Compliance Summary</SelectItem>
                          <SelectItem value="incident-report">Incident Report</SelectItem>
                          <SelectItem value="training-status">Training Status</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button>Generate Report</Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showAddRequirementDialog} onOpenChange={setShowAddRequirementDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Compliance Requirement</DialogTitle>
            <DialogDescription>
              Add a new compliance requirement to the checklist.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={newRequirement.category}
                onValueChange={(value) => setNewRequirement({ ...newRequirement, category: value })}
              >
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIPAA">HIPAA</SelectItem>
                  <SelectItem value="OSHA">OSHA</SelectItem>
                  <SelectItem value="State Law">State Law</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requirement" className="text-right">
                Requirement
              </Label>
              <Input
                id="requirement"
                value={newRequirement.requirement}
                onChange={(e) => setNewRequirement({ ...newRequirement, requirement: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <div className="col-span-3">
                <Calendar
                  mode="single"
                  selected={newRequirement.dueDate}
                  onSelect={(date) => date && setNewRequirement({ ...newRequirement, dueDate: date })}
                  className="rounded-md border"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddRequirement}>Add Requirement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUploadDocumentDialog} onOpenChange={setShowUploadDocumentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new compliance-related document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="docName" className="text-right">
                Document Name
              </Label>
              <Input
                id="docName"
                value={newDocument.name}
                onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="docCategory" className="text-right">
                Category
              </Label>
              <Select
                value={newDocument.category}
                onValueChange={(value) => setNewDocument({ ...newDocument, category: value })}
              >
                <SelectTrigger id="docCategory" className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIPAA">HIPAA</SelectItem>
                  <SelectItem value="OSHA">OSHA</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Patient Care">Patient Care</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="docFile" className="text-right">
                File
              </Label>
              <Input
                id="docFile"
                type="file"
                onChange={(e) => setNewDocument({ ...newDocument, file: e.target.files ? e.target.files[0] : null })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUploadDocument}>Upload Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReportIncidentDialog} onOpenChange={setShowReportIncidentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report Incident</DialogTitle>
            <DialogDescription>
              Report a compliance-related incident or breach.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="incidentType" className="text-right">
                Incident Type
              </Label>
              <Select
                value={newIncident.type}
                onValueChange={(value) => setNewIncident({ ...newIncident, type: value })}
              >
                <SelectTrigger id="incidentType" className="col-span-3">
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Data Breach">Data Breach</SelectItem>
                  <SelectItem value="OSHA Violation">OSHA Violation</SelectItem>
                  <SelectItem value="Patient Complaint">Patient Complaint</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="incidentDescription" className="text-right">
                Description
              </Label>
              <Textarea
                id="incidentDescription"
                value={newIncident.description}
                onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleReportIncident}>Report Incident</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
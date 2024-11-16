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
import { AlertTriangle, FileText, CheckCircle, AlertCircle, BarChart2, Users } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const incidentReports = [
  { id: 1, date: '2023-07-20', type: 'Patient Fall', status: 'Resolved', description: 'Patient slipped in the waiting area. No serious injuries.' },
  { id: 2, date: '2023-07-18', type: 'Equipment Malfunction', status: 'Under Investigation', description: 'X-ray machine stopped working during a procedure.' },
  { id: 3, date: '2023-07-15', type: 'Adverse Reaction', status: 'Resolved', description: 'Patient experienced allergic reaction to local anesthetic.' },
]

const emergencyProtocols = [
  { id: 1, title: 'Fire Evacuation', steps: ['Activate fire alarm', 'Evacuate patients and staff', 'Call 911', 'Meet at designated assembly point'] },
  { id: 2, title: 'Medical Emergency', steps: ['Assess the situation', 'Call for medical assistance', 'Provide first aid if trained', 'Clear the area for emergency responders'] },
  { id: 3, title: 'Power Outage', steps: ['Ensure patient safety', 'Use emergency lighting', 'Contact utility company', 'Reschedule appointments if necessary'] },
]

const staffTraining = [
  { id: 1, name: 'Dr. Smith', lastTraining: '2023-05-15', nextDue: '2023-11-15', compliance: 100 },
  { id: 2, name: 'Nurse Johnson', lastTraining: '2023-06-01', nextDue: '2023-12-01', compliance: 100 },
  { id: 3, name: 'Receptionist Brown', lastTraining: '2023-04-01', nextDue: '2023-10-01', compliance: 80 },
]

export default function EmergencyPreparedness() {
  const [activeTab, setActiveTab] = useState('incident-reporting')
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [newIncident, setNewIncident] = useState({ type: '', description: '' })
  const [selectedProtocol, setSelectedProtocol] = useState<typeof emergencyProtocols[0] | null>(null)

  useEffect(() => {
    // In a real application, fetch emergency preparedness data from Supabase here
  }, [])

  const handleReportIncident = () => {
    // In a real application, save the incident report to Supabase
    toast({
      title: "Incident Reported",
      description: "The incident has been logged and relevant staff notified.",
    })
    setShowReportDialog(false)
    setNewIncident({ type: '', description: '' })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return <Badge variant="secondary"><CheckCircle className="mr-1 h-3 w-3" /> Resolved</Badge>
      case 'Under Investigation':
        return <Badge variant="warning"><AlertCircle className="mr-1 h-3 w-3" /> Under Investigation</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <AlertTriangle className="mr-2 h-6 w-6" />
          Emergency Preparedness and Incident Reporting
        </CardTitle>
        <CardDescription>Manage incidents, access protocols, and track staff preparedness</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="incident-reporting">Incident Reporting</TabsTrigger>
            <TabsTrigger value="emergency-protocols">Emergency Protocols</TabsTrigger>
            <TabsTrigger value="staff-training">Staff Training</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="incident-reporting">
            <Card>
              <CardHeader>
                <CardTitle>Incident Reports</CardTitle>
                <Button onClick={() => setShowReportDialog(true)}>Report New Incident</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidentReports.map((incident) => (
                      <TableRow key={incident.id}>
                        <TableCell>{incident.date}</TableCell>
                        <TableCell>{incident.type}</TableCell>
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

          <TabsContent value="emergency-protocols">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Protocols</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {emergencyProtocols.map((protocol) => (
                    <AccordionItem value={protocol.id.toString()} key={protocol.id}>
                      <AccordionTrigger>{protocol.title}</AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal list-inside">
                          {protocol.steps.map((step, index) => (
                            <li key={index} className="mb-2">{step}</li>
                          ))}
                        </ol>
                        <Button className="mt-4" onClick={() => setSelectedProtocol(protocol)}>View Full Protocol</Button>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff-training">
            <Card>
              <CardHeader>
                <CardTitle>Staff Training Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Last Training</TableHead>
                      <TableHead>Next Due</TableHead>
                      <TableHead>Compliance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffTraining.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell>{staff.name}</TableCell>
                        <TableCell>{staff.lastTraining}</TableCell>
                        <TableCell>{staff.nextDue}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Progress value={staff.compliance} className="w-[60px] mr-2" />
                            <span>{staff.compliance}%</span>
                          </div>
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

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Preparedness Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">5.2 min</div>
                      <p className="text-xs text-muted-foreground">-0.5 min from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Staff Compliance</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">93.5%</div>
                      <p className="text-xs text-muted-foreground">+2.5% from last quarter</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Drill Success Rate</CardTitle>
                      <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">98%</div>
                      <p className="text-xs text-muted-foreground">+3% from last drill</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report New Incident</DialogTitle>
            <DialogDescription>
              Provide details about the incident for proper documentation and follow-up.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="incident-type" className="text-right">
                Type
              </Label>
              <Select value={newIncident.type} onValueChange={(value) => setNewIncident({ ...newIncident, type: value })}>
                <SelectTrigger id="incident-type" className="col-span-3">
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Patient Fall">Patient Fall</SelectItem>
                  <SelectItem value="Equipment Malfunction">Equipment Malfunction</SelectItem>
                  <SelectItem value="Adverse Reaction">Adverse Reaction</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="incident-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="incident-description"
                value={newIncident.description}
                onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleReportIncident}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedProtocol !== null} onOpenChange={() => setSelectedProtocol(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedProtocol?.title}</DialogTitle>
            <DialogDescription>
              Follow these steps carefully in case of an emergency.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <ol className="list-decimal list-inside">
              {selectedProtocol?.steps.map((step, index) => (
                <li key={index} className="mb-4 text-lg">{step}</li>
              ))}
            </ol>
          
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setSelectedProtocol(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
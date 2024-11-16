'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { Phone, Calendar, AlertTriangle, Clock, Hospital } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const emergencyContacts = [
  { id: '1', name: 'Dr. Smith', phone: '555-0123' },
  { id: '2', name: 'Dr. Johnson', phone: '555-0124' },
]

const nearbyEmergencyFacilities = [
  { id: '1', name: 'City Emergency Dental', address: '123 Main St', phone: '555-1111' },
  { id: '2', name: '24/7 Dental Care', address: '456 Oak Ave', phone: '555-2222' },
]

const emergencyRequests = [
  { id: '1', patientName: 'John Doe', issue: 'Severe toothache', status: 'Pending', timestamp: '2023-07-20T22:30:00Z' },
  { id: '2', patientName: 'Jane Smith', issue: 'Broken tooth', status: 'Responded', timestamp: '2023-07-21T01:15:00Z' },
]

const urgentCareGuidelines = [
  { id: '1', symptom: 'Toothache', advice: 'Rinse with warm salt water. Apply a cold compress to the outside of the cheek. Take over-the-counter pain medication if needed.' },
  { id: '2', symptom: 'Broken Tooth', advice: 'Rinse your mouth with warm water. Apply a cold compress to reduce swelling. Save any broken tooth fragments.' },
  { id: '3', symptom: 'Swelling', advice: 'Rinse with warm salt water. Apply a cold compress to the affected area. If swelling is severe or affects breathing, seek immediate medical attention.' },
]

export default function EmergencyAfterHoursSupport({ userId, userType }: { userId: string, userType: 'patient' | 'staff' }) {
  const [activeTab, setActiveTab] = useState('emergency-info')
  const [showEmergencyRequestDialog, setShowEmergencyRequestDialog] = useState(false)
  const [emergencyRequest, setEmergencyRequest] = useState({ name: '', issue: '', details: '' })
  const [selectedSymptom, setSelectedSymptom] = useState('')

  useEffect(() => {
    // In a real application, fetch emergency data from Supabase here
  }, [userId])

  const handleEmergencyRequest = () => {
    // In a real application, save the emergency request to Supabase here
    toast({
      title: "Emergency Request Submitted",
      description: "A staff member will contact you as soon as possible.",
    })
    setShowEmergencyRequestDialog(false)
    setEmergencyRequest({ name: '', issue: '', details: '' })
  }

  const handleRespondToRequest = (requestId: string) => {
    // In a real application, update the request status in Supabase and notify the patient
    toast({
      title: "Response Sent",
      description: "The patient has been notified of your response.",
    })
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <AlertTriangle className="mr-2 h-6 w-6 text-red-500" />
          Emergency & After-Hours Support
        </CardTitle>
        <CardDescription>Access emergency dental care information and support</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="emergency-info">Emergency Info</TabsTrigger>
            <TabsTrigger value="urgent-care">Urgent Care Guide</TabsTrigger>
            {userType === 'staff' && <TabsTrigger value="requests">Emergency Requests</TabsTrigger>}
          </TabsList>

          <TabsContent value="emergency-info">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">On-Call Dentists</h3>
                    {emergencyContacts.map((contact) => (
                      <div key={contact.id} className="flex items-center space-x-2 mb-2">
                        <Phone className="h-4 w-4" />
                        <span>{contact.name}: {contact.phone}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Nearby Emergency Facilities</h3>
                    {nearbyEmergencyFacilities.map((facility) => (
                      <div key={facility.id} className="mb-2">
                        <div className="font-medium">{facility.name}</div>
                        <div className="text-sm text-muted-foreground">{facility.address}</div>
                        <div className="text-sm">{facility.phone}</div>
                      </div>
                    ))}
                  </div>
                  {userType === 'patient' && (
                    <Button onClick={() => setShowEmergencyRequestDialog(true)}>
                      Request Emergency Appointment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="urgent-care">
            <Card>
              <CardHeader>
                <CardTitle>Urgent Care Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="symptom">Select your symptom:</Label>
                    <Select value={selectedSymptom} onValueChange={setSelectedSymptom}>
                      <SelectTrigger id="symptom">
                        <SelectValue placeholder="Choose a symptom" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgentCareGuidelines.map((guideline) => (
                          <SelectItem key={guideline.id} value={guideline.id}>{guideline.symptom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedSymptom && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{urgentCareGuidelines.find(g => g.id === selectedSymptom)?.symptom}</AlertTitle>
                      <AlertDescription>
                        {urgentCareGuidelines.find(g => g.id === selectedSymptom)?.advice}
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="text-sm text-muted-foreground">
                    Note: These guidelines are for informational purposes only. If you are experiencing severe pain, 
                    uncontrolled bleeding, or difficulty breathing, please seek immediate medical attention.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {userType === 'staff' && (
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Appointment Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Issue</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emergencyRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.patientName}</TableCell>
                          <TableCell>{request.issue}</TableCell>
                          <TableCell>{request.status}</TableCell>
                          <TableCell>{new Date(request.timestamp).toLocaleString()}</TableCell>
                          <TableCell>
                            {request.status === 'Pending' && (
                              <Button size="sm" onClick={() => handleRespondToRequest(request.id)}>
                                Respond
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
        <Button variant="link" onClick={() => window.open('/emergency-help', '_blank')}>
          Learn More About Emergency Support
        </Button>
      </CardFooter>

      <Dialog open={showEmergencyRequestDialog} onOpenChange={setShowEmergencyRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Emergency Appointment</DialogTitle>
            <DialogDescription>
              Please provide details about your emergency. We will contact you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={emergencyRequest.name}
                onChange={(e) => setEmergencyRequest({ ...emergencyRequest, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="issue" className="text-right">
                Issue
              </Label>
              <Input
                id="issue"
                value={emergencyRequest.issue}
                onChange={(e) => setEmergencyRequest({ ...emergencyRequest, issue: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-right">
                Details
              </Label>
              <Textarea
                id="details"
                value={emergencyRequest.details}
                onChange={(e) => setEmergencyRequest({ ...emergencyRequest, details: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEmergencyRequest}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
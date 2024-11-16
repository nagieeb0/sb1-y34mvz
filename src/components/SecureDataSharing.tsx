'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Lock, Share2, Users, Clock, FileText, AlertTriangle } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const patients = [
  { id: '1', name: 'John Doe', dateOfBirth: '1980-05-15' },
  { id: '2', name: 'Jane Smith', dateOfBirth: '1992-08-22' },
  { id: '3', name: 'Bob Johnson', dateOfBirth: '1975-11-30' },
]

const externalProviders = [
  { id: '1', name: 'Dr. Alice Williams', specialty: 'Orthodontist' },
  { id: '2', name: 'CityLab Dental', specialty: 'Dental Laboratory' },
  { id: '3', name: 'Dr. Charlie Brown', specialty: 'Oral Surgeon' },
]

const sharedRecords = [
  { id: '1', patientId: '1', providerId: '1', sharedDate: '2023-07-15', expiryDate: '2023-08-15', status: 'Active' },
  { id: '2', patientId: '2', providerId: '2', sharedDate: '2023-07-10', expiryDate: '2023-07-25', status: 'Expired' },
  { id: '3', patientId: '3', providerId: '3', sharedDate: '2023-07-20', expiryDate: '2023-08-20', status: 'Active' },
]

export default function SecureDataSharing({ clinicId }: { clinicId: string }) {
  const [activeTab, setActiveTab] = useState('share')
  const [selectedPatient, setSelectedPatient] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [sharedItems, setSharedItems] = useState<string[]>([])
  const [expiryDate, setExpiryDate] = useState('')
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showAuditDialog, setShowAuditDialog] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<typeof sharedRecords[0] | null>(null)

  useEffect(() => {
    // In a real application, fetch patients, providers, and shared records from Supabase here
  }, [clinicId])

  const handleShare = () => {
    // In a real application, create a new shared record in Supabase here
    toast({
      title: "Data Shared Successfully",
      description: `Patient data has been shared with ${externalProviders.find(p => p.id === selectedProvider)?.name}.`,
    })
    setShowShareDialog(false)
    // Reset form
    setSelectedPatient('')
    setSelectedProvider('')
    setSharedItems([])
    setExpiryDate('')
  }

  const handleRevokeAccess = (recordId: string) => {
    // In a real application, update the shared record status in Supabase here
    toast({
      title: "Access Revoked",
      description: "The external provider's access has been revoked.",
    })
  }

  const handleAddCollaborationNote = (recordId: string, note: string) => {
    // In a real application, add the collaboration note to Supabase here
    toast({
      title: "Note Added",
      description: "Your collaboration note has been added successfully.",
    })
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Lock className="mr-2 h-6 w-6" />
          Secure Patient Data Sharing and Collaboration
        </CardTitle>
        <CardDescription>Manage secure data sharing with external healthcare providers</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="share">
              <Share2 className="mr-2 h-4 w-4" />
              Share Data
            </TabsTrigger>
            <TabsTrigger value="active">
              <Users className="mr-2 h-4 w-4" />
              Active Shares
            </TabsTrigger>
            <TabsTrigger value="audit">
              <Clock className="mr-2 h-4 w-4" />
              Audit Trail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="share">
            <Card>
              <CardHeader>
                <CardTitle>Share Patient Data</CardTitle>
                <CardDescription>Select a patient and external provider to share data with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Select Patient</Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger id="patient">
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Select External Provider</Label>
                    <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                      <SelectTrigger id="provider">
                        <SelectValue placeholder="Select an external provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {externalProviders.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>{provider.name} - {provider.specialty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => setShowShareDialog(true)}>Continue Sharing</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Shared Records</CardTitle>
                <CardDescription>Manage currently shared patient records</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Shared Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sharedRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{patients.find(p => p.id === record.patientId)?.name}</TableCell>
                        <TableCell>{externalProviders.find(p => p.id === record.providerId)?.name}</TableCell>
                        <TableCell>{record.sharedDate}</TableCell>
                        <TableCell>{record.expiryDate}</TableCell>
                        <TableCell>{record.status}</TableCell>
                        <TableCell>
                          <Button variant="outline" className="mr-2" onClick={() => {
                            setSelectedRecord(record)
                            setShowAuditDialog(true)
                          }}>
                            View Audit
                          </Button>
                          {record.status === 'Active' && (
                            <Button variant="destructive" onClick={() => handleRevokeAccess(record.id)}>
                              Revoke Access
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

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Review data sharing history and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2023-07-15 09:30</TableCell>
                      <TableCell>Data Shared</TableCell>
                      <TableCell>Dr. Smith</TableCell>
                      <TableCell>Shared John Doe's records with Dr. Alice Williams</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2023-07-16 14:15</TableCell>
                      <TableCell>Access Revoked</TableCell>
                      <TableCell>Dr. Smith</TableCell>
                      <TableCell>Revoked CityLab Dental's access to Jane Smith's records</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2023-07-17 11:45</TableCell>
                      <TableCell>Collaboration Note Added</TableCell>
                      <TableCell>Dr. Charlie Brown</TableCell>
                      <TableCell>Added note to Bob Johnson's shared record</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
        <Button variant="link" onClick={() => window.open('/data-sharing-help', '_blank')}>
          Learn More About Secure Data Sharing
        </Button>
      </CardFooter>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Patient Data</DialogTitle>
            <DialogDescription>
              Select which data to share and set an expiry date for access.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Data to Share</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="medical-history" checked={sharedItems.includes('medical-history')} onCheckedChange={(checked) => {
                    if (checked) setSharedItems([...sharedItems, 'medical-history'])
                    else setSharedItems(sharedItems.filter(item => item !== 'medical-history'))
                  }} />
                  <Label htmlFor="medical-history">Medical History</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="x-rays" checked={sharedItems.includes('x-rays')} onCheckedChange={(checked) => {
                    if (checked) setSharedItems([...sharedItems, 'x-rays'])
                    else setSharedItems(sharedItems.filter(item => item !== 'x-rays'))
                  }} />
                  <Label htmlFor="x-rays">X-Rays</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="treatment-notes" checked={sharedItems.includes('treatment-notes')} onCheckedChange={(checked) => {
                    if (checked) setSharedItems([...sharedItems, 'treatment-notes'])
                    else setSharedItems(sharedItems.filter(item => item !== 'treatment-notes'))
                  }} />
                  <Label htmlFor="treatment-notes">Treatment Notes</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry-date">Access Expiry Date</Label>
              <Input
                id="expiry-date"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleShare}>Share Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Audit Trail for Shared Record</DialogTitle>
            <DialogDescription>
              Review access and actions for this shared record.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient:</Label>
              <div>{patients.find(p => p.id === selectedRecord?.patientId)?.name}</div>
            </div>
            <div>
              <Label>Provider:</Label>
              <div>{externalProviders.find(p => p.id === selectedRecord?.providerId)?.name}</div>
            </div>
            <div>
              <Label>Shared Date:</Label>
              <div>{selectedRecord?.sharedDate}</div>
            </div>
            <div>
              <Label>Expiry Date:</Label>
              <div>{selectedRecord?.expiryDate}</div>
            </div>
            <div>
              <Label>Access Log:</Label>
              <Table>
                
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2023-07-16 10:30</TableCell>
                    <TableCell>Accessed medical history</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-07-17 14:15</TableCell>
                    <TableCell>Viewed x-rays</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-07-18 09:45</TableCell>
                    <TableCell>Added collaboration note</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAuditDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
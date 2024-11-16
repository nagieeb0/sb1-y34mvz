'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, DollarSign, CheckCircle, XCircle, AlertCircle, Clock, Search } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const patients = [
  { id: '1', name: 'John Doe', insuranceProvider: 'BlueCross', policyNumber: 'BC123456' },
  { id: '2', name: 'Jane Smith', insuranceProvider: 'Aetna', policyNumber: 'AE789012' },
  { id: '3', name: 'Bob Johnson', insuranceProvider: 'Cigna', policyNumber: 'CI345678' },
]

const claims = [
  { id: '1', patientId: '1', service: 'Dental Cleaning', amount: 150, status: 'Approved', submissionDate: '2023-07-15', approvalDate: '2023-07-18' },
  { id: '2', patientId: '2', service: 'Root Canal', amount: 800, status: 'Under Review', submissionDate: '2023-07-16' },
  { id: '3', patientId: '3', service: 'Tooth Extraction', amount: 300, status: 'Denied', submissionDate: '2023-07-14', denialDate: '2023-07-17' },
]

const coverageDetails = {
  'BC123456': { 
    cleaningCoverage: '100%', 
    rootCanalCoverage: '80%', 
    extractionCoverage: '90%',
    annualLimit: 2000,
    usedAmount: 500
  },
  'AE789012': {
    cleaningCoverage: '90%',
    rootCanalCoverage: '70%',
    extractionCoverage: '80%',
    annualLimit: 1500,
    usedAmount: 800
  },
  'CI345678': {
    cleaningCoverage: '80%',
    rootCanalCoverage: '60%',
    extractionCoverage: '70%',
    annualLimit: 1800,
    usedAmount: 1200
  }
}

export default function InsuranceClaimsProcessing({ clinicId }: { clinicId: string }) {
  const [activeTab, setActiveTab] = useState('verification')
  const [selectedPatient, setSelectedPatient] = useState('')
  const [showClaimDialog, setShowClaimDialog] = useState(false)
  const [newClaim, setNewClaim] = useState({ service: '', amount: '' })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // In a real application, fetch patients, claims, and coverage details from Supabase here
  }, [clinicId])

  const handleVerifyCoverage = () => {
    const patient = patients.find(p => p.id === selectedPatient)
    if (patient) {
      toast({
        title: "Coverage Verified",
        description: `Insurance details for ${patient.name} have been verified.`,
      })
    }
  }

  const handleSubmitClaim = () => {
    // In a real application, submit the claim to Supabase and the insurance provider's API here
    toast({
      title: "Claim Submitted",
      description: `A claim for ${newClaim.service} has been submitted for processing.`,
    })
    setShowClaimDialog(false)
    setNewClaim({ service: '', amount: '' })
  }

  const filteredClaims = claims.filter(claim => 
    patients.find(p => p.id === claim.patientId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Approved</Badge>
      case 'Denied':
        return <Badge className="bg-red-500"><XCircle className="mr-1 h-3 w-3" /> Denied</Badge>
      case 'Under Review':
        return <Badge className="bg-yellow-500"><Clock className="mr-1 h-3 w-3" /> Under Review</Badge>
      default:
        return <Badge className="bg-gray-500"><AlertCircle className="mr-1 h-3 w-3" /> Unknown</Badge>
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <FileText className="mr-2 h-6 w-6" />
          Insurance Claims Processing
        </CardTitle>
        <CardDescription>Manage insurance verifications and claims</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verification">Coverage Verification</TabsTrigger>
            <TabsTrigger value="submission">Claim Submission</TabsTrigger>
            <TabsTrigger value="tracking">Claim Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <CardTitle>Verify Patient Coverage</CardTitle>
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
                  {selectedPatient && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Coverage Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const patient = patients.find(p => p.id === selectedPatient)
                          const coverage = coverageDetails[patient?.policyNumber as keyof typeof coverageDetails]
                          return (
                            <div className="space-y-2">
                              <div>Insurance Provider: {patient?.insuranceProvider}</div>
                              <div>Policy Number: {patient?.policyNumber}</div>
                              <div>Dental Cleaning Coverage: {coverage.cleaningCoverage}</div>
                              <div>Root Canal Coverage: {coverage.rootCanalCoverage}</div>
                              <div>Tooth Extraction Coverage: {coverage.extractionCoverage}</div>
                              <div>Annual Limit: ${coverage.annualLimit}</div>
                              <div>Used Amount: ${coverage.usedAmount}</div>
                              <Progress value={(coverage.usedAmount / coverage.annualLimit) * 100} className="mt-2" />
                            </div>
                          )
                        })()}
                      </CardContent>
                    </Card>
                  )}
                  <Button onClick={handleVerifyCoverage} disabled={!selectedPatient}>Verify Coverage</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submission">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Claim</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="claim-patient">Select Patient</Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger id="claim-patient">
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => setShowClaimDialog(true)} disabled={!selectedPatient}>Create New Claim</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>Track Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search claims..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClaims.map((claim) => (
                        <TableRow key={claim.id}>
                          <TableCell>{patients.find(p => p.id === claim.patientId)?.name}</TableCell>
                          <TableCell>{claim.service}</TableCell>
                          <TableCell>${claim.amount}</TableCell>
                          <TableCell>{claim.submissionDate}</TableCell>
                          <TableCell>{getStatusBadge(claim.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
        <Button variant="link" onClick={() => window.open('/insurance-help', '_blank')}>
          Learn More About Insurance Processing
        </Button>
      </CardFooter>

      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Submit New Claim</DialogTitle>
            <DialogDescription>
              Enter the details for the new insurance claim.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="claim-service" className="text-right">
                Service
              </Label>
              <Input
                id="claim-service"
                value={newClaim.service}
                onChange={(e) => setNewClaim({ ...newClaim, service: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="claim-amount" className="text-right">
                Amount
              </Label>
              <Input
                id="claim-amount"
                type="number"
                value={newClaim.amount}
                onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitClaim}>Submit Claim</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
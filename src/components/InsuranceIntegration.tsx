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
import { Shield, FileText, DollarSign, CheckCircle, AlertCircle } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const insuranceProviders = [
  { id: '1', name: 'DentaCare Insurance' },
  { id: '2', name: 'SmileBright Coverage' },
  { id: '3', name: 'OralHealth Assurance' },
]

const patientInsurance = {
  providerId: '1',
  policyNumber: 'POL123456',
  groupNumber: 'GRP789012',
}

const claims = [
  { id: '1', service: 'Dental Cleaning', date: '2023-06-15', amount: 150, status: 'approved', coveredAmount: 120 },
  { id: '2', service: 'X-Ray', date: '2023-06-15', amount: 75, status: 'in_review', coveredAmount: null },
  { id: '3', service: 'Cavity Filling', date: '2023-05-20', amount: 200, status: 'approved', coveredAmount: 160 },
]

export default function InsuranceIntegration({ userId, userType }: { userId: string, userType: 'patient' | 'doctor' | 'staff' }) {
  const [selectedProvider, setSelectedProvider] = useState(patientInsurance.providerId)
  const [policyNumber, setPolicyNumber] = useState(patientInsurance.policyNumber)
  const [groupNumber, setGroupNumber] = useState(patientInsurance.groupNumber)
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'unverified' | 'error'>('unverified')
  const [showAddProviderDialog, setShowAddProviderDialog] = useState(false)
  const [newProviderName, setNewProviderName] = useState('')
  const [claimsList, setClaimsList] = useState(claims)

  useEffect(() => {
    // In a real application, fetch insurance data from Supabase here
  }, [userId])

  const handleVerifyEligibility = async () => {
    // Simulate API call to verify insurance eligibility
    setVerificationStatus('verified')
    toast({
      title: "Insurance Verified",
      description: "Your insurance eligibility has been verified successfully.",
    })
  }

  const handleUpdateInsurance = async () => {
    // Simulate updating insurance information in Supabase
    toast({
      title: "Insurance Updated",
      description: "Your insurance information has been updated successfully.",
    })
  }

  const handleAddProvider = async () => {
    // Simulate adding a new insurance provider to Supabase
    setShowAddProviderDialog(false)
    setNewProviderName('')
    toast({
      title: "Provider Added",
      description: "The new insurance provider has been added successfully.",
    })
  }

  const handleSubmitClaim = async () => {
    // Simulate submitting a new claim to Supabase
    const newClaim = {
      id: (claimsList.length + 1).toString(),
      service: 'New Service',
      date: new Date().toISOString().split('T')[0],
      amount: 100,
      status: 'submitted',
      coveredAmount: null,
    }
    setClaimsList([newClaim, ...claimsList])
    toast({
      title: "Claim Submitted",
      description: "Your insurance claim has been submitted successfully.",
    })
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-6 w-6" />
          Insurance Integration
        </CardTitle>
        <CardDescription>Manage insurance information, verify eligibility, and track claims</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={userType === 'patient' ? "my-insurance" : "claims"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-insurance" disabled={userType !== 'patient'}>My Insurance</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
          </TabsList>

          <TabsContent value="my-insurance">
            <Card>
              <CardHeader>
                <CardTitle>My Insurance Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance-provider">Insurance Provider</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger id="insurance-provider">
                      <SelectValue placeholder="Select insurance provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {insuranceProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>{provider.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policy-number">Policy Number</Label>
                  <Input id="policy-number" value={policyNumber} onChange={(e) => setPolicyNumber(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-number">Group Number</Label>
                  <Input id="group-number" value={groupNumber} onChange={(e) => setGroupNumber(e.target.value)} />
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={handleVerifyEligibility}>Verify Eligibility</Button>
                  <Button onClick={handleUpdateInsurance}>Update Insurance</Button>
                </div>
                {verificationStatus === 'verified' && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Insurance verified
                  </div>
                )}
                {verificationStatus === 'error' && (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Error verifying insurance
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Covered Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claimsList.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell>{claim.service}</TableCell>
                        <TableCell>{claim.date}</TableCell>
                        <TableCell>${claim.amount.toFixed(2)}</TableCell>
                        <TableCell>{claim.status}</TableCell>
                        <TableCell>{claim.coveredAmount ? `$${claim.coveredAmount.toFixed(2)}` : 'Pending'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {userType !== 'patient' && (
                  <Button className="mt-4" onClick={handleSubmitClaim}>Submit New Claim</Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        {userType !== 'patient' && (
          <Dialog open={showAddProviderDialog} onOpenChange={setShowAddProviderDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Insurance Provider</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Insurance Provider</DialogTitle>
                <DialogDescription>
                  Enter the details of the new insurance provider to add to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="provider-name" className="text-right">
                    Provider Name
                  </Label>
                  <Input
                    id="provider-name"
                    value={newProviderName}
                    onChange={(e) => setNewProviderName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddProvider}>Add Provider</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        <Button variant="link" onClick={() => window.open('/insurance-help', '_blank')}>
          Learn More About Insurance Integration
        </Button>
      </CardFooter>
    </Card>
  )
}
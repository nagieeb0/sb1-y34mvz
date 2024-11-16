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
import { toast } from "@/components/ui/use-toast"
import { Pill, FileText, Clock, ShieldCheck, Building } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const medications = [
  { id: '1', name: 'Amoxicillin', dosages: ['250mg', '500mg'] },
  { id: '2', name: 'Ibuprofen', dosages: ['200mg', '400mg', '600mg'] },
  { id: '3', name: 'Chlorhexidine', dosages: ['0.12%'] },
]

const pharmacies = [
  { id: '1', name: 'City Pharmacy', address: '123 Main St' },
  { id: '2', name: 'Health Plus', address: '456 Oak Ave' },
  { id: '3', name: 'MediCare Drugs', address: '789 Pine Rd' },
]

const prescriptionHistory = [
  { id: '1', medication: 'Amoxicillin 500mg', instructions: 'Take 1 capsule every 8 hours for 7 days', date: '2023-06-15', status: 'Filled' },
  { id: '2', medication: 'Ibuprofen 400mg', instructions: 'Take 1 tablet every 6 hours as needed for pain', date: '2023-06-20', status: 'Refill Available' },
]

export default function EPrescriptionAndPharmacy({ userId, userType }: { userId: string, userType: 'doctor' | 'patient' }) {
  const [prescriptions, setPrescriptions] = useState(prescriptionHistory)
  const [selectedMedication, setSelectedMedication] = useState('')
  const [selectedDosage, setSelectedDosage] = useState('')
  const [instructions, setInstructions] = useState('')
  const [selectedPharmacy, setSelectedPharmacy] = useState('')
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false)
  const [showRefillDialog, setShowRefillDialog] = useState(false)
  const [refillPrescription, setRefillPrescription] = useState<typeof prescriptionHistory[0] | null>(null)

  useEffect(() => {
    // In a real application, fetch prescription data from Supabase here
  }, [userId])

  const handleCreatePrescription = async () => {
    // Simulate creating a new prescription in Supabase
    const newPrescription = {
      id: (prescriptions.length + 1).toString(),
      medication: `${selectedMedication} ${selectedDosage}`,
      instructions,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    }
    setPrescriptions([newPrescription, ...prescriptions])
    setShowPrescriptionDialog(false)
    resetPrescriptionForm()
    toast({
      title: "Prescription Created",
      description: "The e-prescription has been created and sent to the pharmacy.",
    })
  }

  const handleRefillRequest = async () => {
    // Simulate requesting a refill in Supabase
    if (refillPrescription) {
      const updatedPrescriptions = prescriptions.map(p =>
        p.id === refillPrescription.id ? { ...p, status: 'Refill Requested' } : p
      )
      setPrescriptions(updatedPrescriptions)
      setShowRefillDialog(false)
      setRefillPrescription(null)
      toast({
        title: "Refill Requested",
        description: "Your refill request has been submitted and is pending approval.",
      })
    }
  }

  const resetPrescriptionForm = () => {
    setSelectedMedication('')
    setSelectedDosage('')
    setInstructions('')
    setSelectedPharmacy('')
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Pill className="mr-2 h-6 w-6" />
          E-Prescription and Pharmacy Services
        </CardTitle>
        <CardDescription>Manage prescriptions and interact with pharmacies</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={userType === 'doctor' ? "create" : "history"}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create" disabled={userType !== 'doctor'}>
              <FileText className="mr-2 h-4 w-4" />
              Create Prescription
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="mr-2 h-4 w-4" />
              Prescription History
            </TabsTrigger>
            <TabsTrigger value="pharmacies">
              <Building className="mr-2 h-4 w-4" />
              Pharmacies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create E-Prescription</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowPrescriptionDialog(true)}>Create New Prescription</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Prescription History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Instructions</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell>{prescription.medication}</TableCell>
                        <TableCell>{prescription.instructions}</TableCell>
                        <TableCell>{prescription.date}</TableCell>
                        <TableCell>{prescription.status}</TableCell>
                        <TableCell>
                          {prescription.status === 'Refill Available' && userType === 'patient' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setRefillPrescription(prescription)
                                setShowRefillDialog(true)
                              }}
                            >
                              Request Refill
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

          <TabsContent value="pharmacies">
            <Card>
              <CardHeader>
                <CardTitle>Partner Pharmacies</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pharmacies.map((pharmacy) => (
                      <TableRow key={pharmacy.id}>
                        <TableCell>{pharmacy.name}</TableCell>
                        <TableCell>{pharmacy.address}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Prescription</DialogTitle>
            <DialogDescription>
              Fill out the details for the new e-prescription.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medication" className="text-right">
                Medication
              </Label>
              <Select
                value={selectedMedication}
                onValueChange={setSelectedMedication}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select medication" />
                </SelectTrigger>
                <SelectContent>
                  {medications.map((med) => (
                    <SelectItem key={med.id} value={med.name}>{med.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosage" className="text-right">
                Dosage
              </Label>
              <Select
                value={selectedDosage}
                onValueChange={setSelectedDosage}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select dosage" />
                </SelectTrigger>
                <SelectContent>
                  {medications.find(m => m.name === selectedMedication)?.dosages.map((dosage) => (
                    <SelectItem key={dosage} value={dosage}>{dosage}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instructions" className="text-right">
                Instructions
              </Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pharmacy" className="text-right">
                Pharmacy
              </Label>
              <Select
                value={selectedPharmacy}
                onValueChange={setSelectedPharmacy}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select pharmacy" />
                </SelectTrigger>
                <SelectContent>
                  {pharmacies.map((pharmacy) => (
                    <SelectItem key={pharmacy.id} value={pharmacy.name}>{pharmacy.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreatePrescription}>Create Prescription</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRefillDialog} onOpenChange={setShowRefillDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Prescription Refill</DialogTitle>
            <DialogDescription>
              Confirm that you want to request a refill for this prescription.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p><strong>Medication:</strong> {refillPrescription?.medication}</p>
            <p><strong>Instructions:</strong> {refillPrescription?.instructions}</p>
          </div>
          <DialogFooter>
            <Button onClick={handleRefillRequest}>Request Refill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          <ShieldCheck className="mr-2 h-4 w-4" />
          <span className="text-sm text-muted-foreground">Secure and Compliant</span>
        </div>
        <Button variant="link" onClick={() => window.open('/e-prescription-help', '_blank')}>
          Learn More About E-Prescriptions
        </Button>
      </CardFooter>
    </Card>
  )
}
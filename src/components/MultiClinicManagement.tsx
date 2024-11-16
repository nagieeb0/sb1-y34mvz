'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Building, Users, DollarSign, Activity, Package, ArrowRightLeft, Shield } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const clinics = [
  { id: '1', name: 'Downtown Dental', location: 'New York, NY' },
  { id: '2', name: 'Suburban Smiles', location: 'White Plains, NY' },
  { id: '3', name: 'Beachside Orthodontics', location: 'Miami, FL' },
]

const clinicMetrics = {
  '1': { patientVolume: 150, revenue: 75000, popularService: 'Teeth Whitening' },
  '2': { patientVolume: 120, revenue: 60000, popularService: 'Dental Implants' },
  '3': { patientVolume: 100, revenue: 50000, popularService: 'Braces' },
}

const inventoryLevels = {
  '1': [
    { item: 'Dental Floss', quantity: 500, reorderPoint: 100 },
    { item: 'Toothbrushes', quantity: 200, reorderPoint: 50 },
    { item: 'Latex Gloves', quantity: 1000, reorderPoint: 200 },
  ],
  '2': [
    { item: 'Dental Floss', quantity: 300, reorderPoint: 100 },
    { item: 'Toothbrushes', quantity: 150, reorderPoint: 50 },
    { item: 'Latex Gloves', quantity: 800, reorderPoint: 200 },
  ],
  '3': [
    { item: 'Dental Floss', quantity: 400, reorderPoint: 100 },
    { item: 'Toothbrushes', quantity: 100, reorderPoint: 50 },
    { item: 'Latex Gloves', quantity: 1200, reorderPoint: 200 },
  ],
}

const patientTransfers = [
  { id: '1', patientName: 'John Doe', fromClinic: 'Downtown Dental', toClinic: 'Suburban Smiles', date: '2023-07-15' },
  { id: '2', patientName: 'Jane Smith', fromClinic: 'Suburban Smiles', toClinic: 'Beachside Orthodontics', date: '2023-07-20' },
]

export default function MultiClinicManagement({ userId, userRole }: { userId: string, userRole: 'admin' | 'manager' | 'dentist' | 'receptionist' }) {
  const [selectedClinic, setSelectedClinic] = useState(clinics[0].id)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [transferItem, setTransferItem] = useState('')
  const [transferQuantity, setTransferQuantity] = useState('')
  const [transferToClinic, setTransferToClinic] = useState('')

  useEffect(() => {
    // In a real application, fetch clinic data from Supabase here
  }, [userId])

  const handleInventoryTransfer = async () => {
    // Simulate inventory transfer between clinics
    toast({
      title: "Inventory Transfer Initiated",
      description: `Transferring ${transferQuantity} ${transferItem}(s) to ${clinics.find(c => c.id === transferToClinic)?.name}`,
    })
    setShowTransferDialog(false)
    resetTransferForm()
  }

  const resetTransferForm = () => {
    setTransferItem('')
    setTransferQuantity('')
    setTransferToClinic('')
  }

  return (
    <Card className="w-[1000px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building className="mr-2 h-6 w-6" />
          Multi-Clinic Management
        </CardTitle>
        <CardDescription>Manage and monitor multiple dental clinics within your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="clinic-select">Select Clinic</Label>
          <Select value={selectedClinic} onValueChange={setSelectedClinic}>
            <SelectTrigger id="clinic-select">
              <SelectValue placeholder="Select a clinic" />
            </SelectTrigger>
            <SelectContent>
              {clinics.map((clinic) => (
                <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">
              <Activity className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Package className="mr-2 h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="transfers">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Patient Transfers
            </TabsTrigger>
            <TabsTrigger value="permissions" disabled={userRole !== 'admin'}>
              <Shield className="mr-2 h-4 w-4" />
              Permissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Clinic Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Patient Volume
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{clinicMetrics[selectedClinic].patientVolume}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Revenue
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${clinicMetrics[selectedClinic].revenue.toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Popular Service
                      </CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{clinicMetrics[selectedClinic].popularService}</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Reorder Point</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryLevels[selectedClinic].map((item) => (
                      <TableRow key={item.item}>
                        <TableCell>{item.item}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.reorderPoint}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setTransferItem(item.item)
                              setShowTransferDialog(true)
                            }}
                          >
                            Transfer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfers">
            <Card>
              <CardHeader>
                <CardTitle>Patient Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>From Clinic</TableHead>
                      <TableHead>To Clinic</TableHead>
                      <TableHead>Transfer Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientTransfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell>{transfer.patientName}</TableCell>
                        <TableCell>{transfer.fromClinic}</TableCell>
                        <TableCell>{transfer.toClinic}</TableCell>
                        <TableCell>{transfer.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Configure user roles and permissions for each clinic here.</p>
                {/* Add user role management interface here */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Inventory</DialogTitle>
            <DialogDescription>
              Transfer inventory items between clinics.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item" className="text-right">
                Item
              </Label>
              <Input
                id="item"
                value={transferItem}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                value={transferQuantity}
                onChange={(e) => setTransferQuantity(e.target.value)}
                className="col-span-3"
                type="number"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="to-clinic" className="text-right">
                To Clinic
              </Label>
              <Select value={transferToClinic} onValueChange={setTransferToClinic}>
                <SelectTrigger id="to-clinic" className="col-span-3">
                  <SelectValue placeholder="Select destination clinic" />
                </SelectTrigger>
                <SelectContent>
                  {clinics.filter(c => c.id !== selectedClinic).map((clinic) => (
                    <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleInventoryTransfer}>Initiate Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
        <Button variant="link" onClick={() => window.open('/multi-clinic-help', '_blank')}>
          Learn More About Multi-Clinic Management
        </Button>
      </CardFooter>
    </Card>
  )
}
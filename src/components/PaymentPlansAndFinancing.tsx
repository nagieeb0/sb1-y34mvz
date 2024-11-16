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
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { CreditCard, DollarSign, Calendar, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const patients = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
]

const paymentPlans = [
  { id: '1', patientId: '1', totalAmount: 2000, remainingBalance: 1500, installments: 4, nextDueDate: '2023-08-15' },
  { id: '2', patientId: '2', totalAmount: 3500, remainingBalance: 3500, installments: 6, nextDueDate: '2023-08-01' },
  { id: '3', patientId: '3', totalAmount: 1000, remainingBalance: 500, installments: 2, nextDueDate: '2023-07-30' },
]

const financingOptions = [
  { id: '1', name: 'CareCredit', interestRate: '0% for 12 months', minAmount: 500, maxAmount: 5000 },
  { id: '2', name: 'Lending Club', interestRate: '3.99% - 24.99%', minAmount: 1000, maxAmount: 10000 },
  { id: '3', name: 'Wells Fargo Health Advantage', interestRate: '12.99%', minAmount: 1000, maxAmount: 25000 },
]

export default function PaymentPlansAndFinancing({ userId, userType }: { userId: string, userType: 'patient' | 'staff' }) {
  const [activeTab, setActiveTab] = useState('payment-plans')
  const [selectedPatient, setSelectedPatient] = useState('')
  const [showNewPlanDialog, setShowNewPlanDialog] = useState(false)
  const [newPlan, setNewPlan] = useState({ totalAmount: 0, installments: 3, interestRate: 0 })
  const [showFinancingDialog, setShowFinancingDialog] = useState(false)
  const [selectedFinancing, setSelectedFinancing] = useState('')

  useEffect(() => {
    // In a real application, fetch patient data, payment plans, and financing options from Supabase here
  }, [userId])

  const handleCreatePaymentPlan = () => {
    // In a real application, save the new payment plan to Supabase here
    toast({
      title: "Payment Plan Created",
      description: `A new payment plan has been created for ${patients.find(p => p.id === selectedPatient)?.name}.`,
    })
    setShowNewPlanDialog(false)
    setNewPlan({ totalAmount: 0, installments: 3, interestRate: 0 })
  }

  const handleApplyForFinancing = () => {
    // In a real application, submit the financing application to the third-party provider here
    toast({
      title: "Financing Application Submitted",
      description: "Your application has been submitted for review. We'll notify you of the decision soon.",
    })
    setShowFinancingDialog(false)
  }

  const handleSendReminder = (planId: string) => {
    // In a real application, send a payment reminder to the patient here
    toast({
      title: "Reminder Sent",
      description: "A payment reminder has been sent to the patient.",
    })
  }

  const getStatusBadge = (remainingBalance: number, totalAmount: number) => {
    const percentPaid = ((totalAmount - remainingBalance) / totalAmount) * 100
    if (percentPaid === 100) {
      return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Paid</Badge>
    } else if (percentPaid >= 50) {
      return <Badge className="bg-yellow-500"><Clock className="mr-1 h-3 w-3" /> In Progress</Badge>
    } else {
      return <Badge className="bg-blue-500"><AlertCircle className="mr-1 h-3 w-3" /> Just Started</Badge>
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <CreditCard className="mr-2 h-6 w-6" />
          Payment Plans & Financing
        </CardTitle>
        <CardDescription>Manage payment plans and financing options for patients</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payment-plans">Payment Plans</TabsTrigger>
            <TabsTrigger value="financing">Financing Options</TabsTrigger>
          </TabsList>

          <TabsContent value="payment-plans">
            <Card>
              <CardHeader>
                <CardTitle>Active Payment Plans</CardTitle>
              </CardHeader>
              <CardContent>
                {userType === 'staff' && (
                  <div className="mb-4">
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>{patient.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Remaining Balance</TableHead>
                      <TableHead>Installments</TableHead>
                      <TableHead>Next Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentPlans
                      .filter(plan => userType === 'patient' ? plan.patientId === userId : (selectedPatient ? plan.patientId === selectedPatient : true))
                      .map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell>{patients.find(p => p.id === plan.patientId)?.name}</TableCell>
                          <TableCell>${plan.totalAmount}</TableCell>
                          <TableCell>${plan.remainingBalance}</TableCell>
                          <TableCell>{plan.installments}</TableCell>
                          <TableCell>{plan.nextDueDate}</TableCell>
                          <TableCell>{getStatusBadge(plan.remainingBalance, plan.totalAmount)}</TableCell>
                          <TableCell>
                            {userType === 'staff' && (
                              <Button size="sm" onClick={() => handleSendReminder(plan.id)}>
                                Send Reminder
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {userType === 'staff' && (
                  <Button className="mt-4" onClick={() => setShowNewPlanDialog(true)}>Create New Plan</Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financing">
            <Card>
              <CardHeader>
                <CardTitle>Financing Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financingOptions.map((option) => (
                    <Card key={option.id}>
                      <CardHeader>
                        <CardTitle>{option.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div>Interest Rate: {option.interestRate}</div>
                        <div>Amount Range: ${option.minAmount} - ${option.maxAmount}</div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => {
                          setSelectedFinancing(option.id)
                          setShowFinancingDialog(true)
                        }}>Apply Now</Button>
                      </CardFooter>
                    </Card>
                  ))}
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
        <Button variant="link" onClick={() => window.open('/payment-plans-help', '_blank')}>
          Learn More About Payment Plans & Financing
        </Button>
      </CardFooter>

      <Dialog open={showNewPlanDialog} onOpenChange={setShowNewPlanDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Payment Plan</DialogTitle>
            <DialogDescription>
              Set up a new payment plan for the selected patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total-amount" className="text-right">
                Total Amount
              </Label>
              <Input
                id="total-amount"
                type="number"
                value={newPlan.totalAmount}
                onChange={(e) => setNewPlan({ ...newPlan, totalAmount: parseFloat(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="installments" className="text-right">
                Installments
              </Label>
              <Select
                value={newPlan.installments.toString()}
                onValueChange={(value) => setNewPlan({ ...newPlan, installments: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select number of installments" />
                </SelectTrigger>
                <SelectContent>
                  {[3, 6, 12, 18, 24].map((num) => (
                    <SelectItem key={num} value={num.toString()}>{num} months</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interest-rate" className="text-right">
                Interest Rate
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Slider
                  id="interest-rate"
                  min={0}
                  max={25}
                  step={0.1}
                  value={[newPlan.interestRate]}
                  onValueChange={(value) => setNewPlan({ ...newPlan, interestRate: value[0] })}
                />
                <span>{newPlan.interestRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreatePaymentPlan}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showFinancingDialog} onOpenChange={setShowFinancingDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply for Financing</DialogTitle>
            <DialogDescription>
              Complete this form to apply for financing with {financingOptions.find(f => f.id === selectedFinancing)?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="financing-amount" className="text-right">
                Amount
              </Label>
              <Input
                id="financing-amount"
                type="number"
                placeholder="Enter desired amount"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="financing-purpose" className="text-right">
                Purpose
              </Label>
              <Input
                id="financing-purpose"
                placeholder="e.g., Dental Implants"
                className="col-span-3"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="terms" />
              <Label htmlFor="terms">I agree to the terms and conditions</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleApplyForFinancing}>Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
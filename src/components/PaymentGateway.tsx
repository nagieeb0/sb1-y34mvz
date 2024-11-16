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
import { CreditCard, DollarSign, FileText, Bell, Calendar } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const invoices = [
  { id: '1', date: '2023-07-01', amount: 150.00, status: 'Paid', description: 'Dental Cleaning' },
  { id: '2', date: '2023-07-15', amount: 500.00, status: 'Pending', description: 'Root Canal' },
  { id: '3', date: '2023-08-01', amount: 1000.00, status: 'Overdue', description: 'Dental Implant (1st Installment)' },
]

const paymentMethods = [
  { id: '1', type: 'Credit Card', last4: '1234', expiry: '12/24' },
  { id: '2', type: 'PayPal', email: 'patient@example.com' },
]

const paymentPlans = [
  { id: '1', treatment: 'Dental Implant', totalAmount: 3000.00, remainingAmount: 2000.00, nextPayment: '2023-09-01' },
  { id: '2', treatment: 'Orthodontics', totalAmount: 5000.00, remainingAmount: 3750.00, nextPayment: '2023-08-15' },
]

export default function PaymentGateway({ patientId }: { patientId: string }) {
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState({ type: 'Credit Card', details: '' })
  const [showAddPaymentMethodDialog, setShowAddPaymentMethodDialog] = useState(false)

  useEffect(() => {
    // In a real application, fetch patient's billing data from Supabase here
  }, [patientId])

  const handlePayment = async () => {
    // Simulate payment processing
    toast({
      title: "Payment Processed",
      description: `Your payment of $${selectedInvoice?.amount.toFixed(2)} has been processed successfully.`,
    })
    setShowPaymentDialog(false)
    // In a real application, update the invoice status in Supabase here
  }

  const handleAddPaymentMethod = async () => {
    // Simulate adding a new payment method
    toast({
      title: "Payment Method Added",
      description: "Your new payment method has been added successfully.",
    })
    setShowAddPaymentMethodDialog(false)
    // In a real application, add the new payment method to Supabase here
  }

  const handleSetupPaymentPlan = async (planId: string) => {
    // Simulate setting up a payment plan
    toast({
      title: "Payment Plan Activated",
      description: "Your payment plan has been set up successfully.",
    })
    // In a real application, update the payment plan status in Supabase here
  }

  return (
    <Card className="w-[1000px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="mr-2 h-6 w-6" />
          Payment Gateway and Billing
        </CardTitle>
        <CardDescription>Manage your invoices, make payments, and set up payment plans</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="invoices">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="invoices">
              <FileText className="mr-2 h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="payment-methods">
              <CreditCard className="mr-2 h-4 w-4" />
              Payment Methods
            </TabsTrigger>
            <TabsTrigger value="payment-plans">
              <Calendar className="mr-2 h-4 w-4" />
              Payment Plans
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Bell className="mr-2 h-4 w-4" />
              Reminders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>View and pay your dental invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>{invoice.status}</TableCell>
                        <TableCell>
                          {invoice.status === 'Pending' && (
                            <Button
                              onClick={() => {
                                setSelectedInvoice(invoice)
                                setShowPaymentDialog(true)
                              }}
                            >
                              Pay Now
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

          <TabsContent value="payment-methods">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentMethods.map((method) => (
                      <TableRow key={method.id}>
                        <TableCell>{method.type}</TableCell>
                        <TableCell>
                          {method.type === 'Credit Card' ? `**** **** **** ${method.last4}` : method.email}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline">Remove</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button className="mt-4" onClick={() => setShowAddPaymentMethodDialog(true)}>
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-plans">
            <Card>
              <CardHeader>
                <CardTitle>Payment Plans</CardTitle>
                <CardDescription>Manage your active payment plans</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Remaining Amount</TableHead>
                      <TableHead>Next Payment</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>{plan.treatment}</TableCell>
                        <TableCell>${plan.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>${plan.remainingAmount.toFixed(2)}</TableCell>
                        <TableCell>{plan.nextPayment}</TableCell>
                        <TableCell>
                          <Button variant="outline" onClick={() => handleSetupPaymentPlan(plan.id)}>
                            Manage Plan
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminders">
            <Card>
              <CardHeader>
                <CardTitle>Payment Reminders</CardTitle>
                <CardDescription>Manage your payment reminder settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="email-reminders" className="form-checkbox" />
                    <Label htmlFor="email-reminders">Receive email reminders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sms-reminders" className="form-checkbox" />
                    <Label htmlFor="sms-reminders">Receive SMS reminders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="reminder-days">Days before due date to send reminder:</Label>
                    <Input type="number" id="reminder-days" defaultValue={3} className="w-20" />
                  </div>
                  <Button>Update Reminder Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Payment</DialogTitle>
            <DialogDescription>
              Complete your payment for the selected invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-amount" className="text-right">
                Amount
              </Label>
              <Input
                id="payment-amount"
                value={selectedInvoice?.amount.toFixed(2)}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-method" className="text-right">
                Payment Method
              </Label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.type === 'Credit Card' ? `**** ${method.last4}` : method.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handlePayment}>Complete Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddPaymentMethodDialog} onOpenChange={setShowAddPaymentMethodDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter the details for your new payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-type" className="text-right">
                Type
              </Label>
              <Select
                value={newPaymentMethod.type}
                onValueChange={(value) => setNewPaymentMethod({ ...newPaymentMethod, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payment-details" className="text-right">
                {newPaymentMethod.type === 'Credit Card' ? 'Card Number' : 'PayPal Email'}
              </Label>
              <Input
                id="payment-details"
                value={newPaymentMethod.details}
                onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, details: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Billing Data
        </Button>
        <Button variant="link" onClick={() => window.open('/billing-help', '_blank')}>
          Learn More About Online Billing
        </Button>
      </CardFooter>
    </Card>
  )
}
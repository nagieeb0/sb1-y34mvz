'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { PhoneCall, Calendar, AlertTriangle, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type EmergencyContact = {
  name: string
  phone: string
  available: boolean
}

type UrgentAppointment = {
  id: string
  patientName: string
  reason: string
  requestedDate: string
  status: 'pending' | 'confirmed' | 'declined'
}

type PrioritySupport = {
  id: string
  userType: 'doctor' | 'staff'
  issue: string
  status: 'open' | 'in_progress' | 'resolved'
  createdAt: string
}

export default function EmergencyAndPrioritySupport({ userId, userType }: { userId: string, userType: 'patient' | 'doctor' | 'staff' }) {
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact | null>(null)
  const [urgentAppointments, setUrgentAppointments] = useState<UrgentAppointment[]>([])
  const [prioritySupport, setPrioritySupport] = useState<PrioritySupport[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false)
  const [showUrgentAppointmentDialog, setShowUrgentAppointmentDialog] = useState(false)
  const [showPrioritySupportDialog, setShowPrioritySupportDialog] = useState(false)

  useEffect(() => {
    fetchEmergencyContact()
    if (userType === 'patient') {
      fetchUrgentAppointments()
    } else {
      fetchPrioritySupport()
    }
  }, [])

  const fetchEmergencyContact = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .single()

      if (error) throw error

      setEmergencyContact(data)
    } catch (error) {
      console.error('Error fetching emergency contact:', error)
      toast({
        title: "Error",
        description: "Failed to fetch emergency contact information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUrgentAppointments = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('urgent_appointments')
        .select('*')
        .eq('patient_id', userId)
        .order('requestedDate', { ascending: false })

      if (error) throw error

      setUrgentAppointments(data)
    } catch (error) {
      console.error('Error fetching urgent appointments:', error)
      toast({
        title: "Error",
        description: "Failed to fetch urgent appointment requests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPrioritySupport = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('priority_support')
        .select('*')
        .eq('user_id', userId)
        .order('createdAt', { ascending: false })

      if (error) throw error

      setPrioritySupport(data)
    } catch (error) {
      console.error('Error fetching priority support requests:', error)
      toast({
        title: "Error",
        description: "Failed to fetch priority support requests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmergencyContact = () => {
    setShowEmergencyDialog(true)
    // In a real application, this would initiate a call or send an urgent message to the emergency contact
  }

  const handleUrgentAppointmentRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const reason = formData.get('reason') as string
    const requestedDate = formData.get('requestedDate') as string

    try {
      const { data, error } = await supabase
        .from('urgent_appointments')
        .insert({
          patient_id: userId,
          reason,
          requestedDate,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      setUrgentAppointments([...urgentAppointments, data])
      setShowUrgentAppointmentDialog(false)
      toast({
        title: "Urgent Appointment Requested",
        description: "Your urgent appointment request has been submitted. We will contact you shortly.",
      })
    } catch (error) {
      console.error('Error submitting urgent appointment request:', error)
      toast({
        title: "Error",
        description: "Failed to submit urgent appointment request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePrioritySupportRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const issue = formData.get('issue') as string

    try {
      const { data, error } = await supabase
        .from('priority_support')
        .insert({
          user_id: userId,
          userType,
          issue,
          status: 'open',
          createdAt: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      setPrioritySupport([...prioritySupport, data])
      setShowPrioritySupportDialog(false)
      toast({
        title: "Priority Support Request Submitted",
        description: "Your priority support request has been submitted. Our team will respond shortly.",
      })
    } catch (error) {
      console.error('Error submitting priority support request:', error)
      toast({
        title: "Error",
        description: "Failed to submit priority support request. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Emergency Contact and Priority Support</CardTitle>
        <CardDescription>Get immediate assistance for urgent dental needs or critical issues</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={userType === 'patient' ? "emergency" : "priority-support"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="emergency" disabled={userType !== 'patient'}>
              <PhoneCall className="mr-2 h-4 w-4" />
              Emergency Contact
            </TabsTrigger>
            <TabsTrigger value="priority-support" disabled={userType === 'patient'}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Priority Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>Use this option for urgent dental emergencies only</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>When to use emergency contact</AlertTitle>
                  <AlertDescription>
                    Use this option for severe pain, uncontrolled bleeding, or traumatic injuries to teeth or jaw.
                    For non-emergency situations, please schedule a regular appointment.
                  </AlertDescription>
                </Alert>
                {emergencyContact && (
                  <div className="mt-4">
                    <p><strong>Emergency Contact:</strong> {emergencyContact.name}</p>
                    <p><strong>Phone:</strong> {emergencyContact.phone}</p>
                    <p><strong>Status:</strong> {emergencyContact.available ? 'Available' : 'Unavailable'}</p>
                  </div>
                )}
                <div className="mt-4 space-y-4">
                  <Button onClick={handleEmergencyContact} disabled={!emergencyContact?.available}>
                    Contact Emergency Line
                  </Button>
                  <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Emergency Contact</DialogTitle>
                        <DialogDescription>
                          You are about to contact our emergency line. Please confirm this is an urgent dental emergency.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEmergencyDialog(false)}>Cancel</Button>
                        <Button onClick={() => {
                          // In a real application, this would initiate the emergency contact process
                          toast({
                            title: "Emergency Contact Initiated",
                            description: "Our emergency team will contact you immediately.",
                          })
                          setShowEmergencyDialog(false)
                        }}>
                          Confirm Emergency
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" onClick={() => setShowUrgentAppointmentDialog(true)}>
                    Request Urgent Appointment
                  </Button>
                  <Dialog open={showUrgentAppointmentDialog} onOpenChange={setShowUrgentAppointmentDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Urgent Appointment</DialogTitle>
                        <DialogDescription>
                          Please provide details for your urgent appointment request.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleUrgentAppointmentRequest}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reason" className="text-right">
                              Reason
                            </Label>
                            <Textarea id="reason" name="reason" className="col-span-3" required />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="requestedDate" className="text-right">
                              Preferred Date
                            </Label>
                            <Input
                              id="requestedDate"
                              name="requestedDate"
                              type="date"
                              className="col-span-3"
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Submit Request</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
            {urgentAppointments.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Urgent Appointment Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {urgentAppointments.map((appointment) => (
                      <li key={appointment.id} className="flex justify-between items-center">
                        <span>{new Date(appointment.requestedDate).toLocaleDateString()}: {appointment.reason}</span>
                        <span className="text-sm font-medium">
                          {appointment.status === 'pending' && 'Pending'}
                          {appointment.status === 'confirmed' && 'Confirmed'}
                          {appointment.status === 'declined' && 'Declined'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="priority-support">
            <Card>
              <CardHeader>
                <CardTitle>Priority Support</CardTitle>
                <CardDescription>Get quick assistance for critical technical or operational issues</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>When to use priority support</AlertTitle>
                  <AlertDescription>
                    Use this option for critical issues that severely impact clinic operations or patient care.
                    For non-critical issues, please use the regular support channels.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 space-y-4">
                  <Button onClick={() => setShowPrioritySupportDialog(true)}>
                    Submit Priority Support Request
                  </Button>
                  <Dialog open={showPrioritySupportDialog} onOpenChange={setShowPrioritySupportDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Priority Support Request</DialogTitle>
                        <DialogDescription>
                          Please provide details for your priority support request.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePrioritySupportRequest}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="issue" className="text-right">
                              Issue Description
                            </Label>
                            <Textarea id="issue" name="issue" className="col-span-3" required />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Submit Request</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                {prioritySupport.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Recent Priority Support Requests</h3>
                    <ul className="space-y-2">
                      
                      {prioritySupport.map((request) => (
                        <li key={request.id} className="flex justify-between items-center">
                          <span>{new Date(request.createdAt).toLocaleString()}: {request.issue.substring(0, 50)}...</span>
                          <span className="text-sm font-medium">
                            {request.status === 'open' && 'Open'}
                            {request.status === 'in_progress' && 'In Progress'}
                            {request.status === 'resolved' && 'Resolved'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
        <Button variant="link" onClick={() => window.open('/emergency-support-help', '_blank')}>
          Learn More About Emergency & Priority Support
        </Button>
      </CardFooter>
    </Card>
  )
}
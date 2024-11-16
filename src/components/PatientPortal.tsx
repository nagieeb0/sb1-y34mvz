'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Calendar, Clock, User, FileText, DollarSign, Star, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type Appointment = {
  id: string
  date: string
  service: string
  doctor: string
  status: 'completed' | 'upcoming' | 'cancelled'
}

type Profile = {
  name: string
  email: string
  phone: string
  medicalHistory: string
}

type Bill = {
  id: string
  date: string
  service: string
  amount: number
  status: 'paid' | 'pending'
}

type Feedback = {
  id: string
  date: string
  rating: number
  comment: string
}

export default function PatientPortal({ patientId }: { patientId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    phone: '',
    medicalHistory: ''
  })
  const [bills, setBills] = useState<Bill[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAppointments()
    fetchProfile()
    fetchBills()
    fetchFeedback()
  }, [])

  const fetchAppointments = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false })

      if (error) throw error

      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast({
        title: "Error",
        description: "Failed to fetch appointments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single()

      if (error) throw error

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to fetch profile information. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchBills = async () => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false })

      if (error) throw error

      setBills(data)
    } catch (error) {
      console.error('Error fetching bills:', error)
      toast({
        title: "Error",
        description: "Failed to fetch billing information. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false })

      if (error) throw error

      setFeedback(data)
    } catch (error) {
      console.error('Error fetching feedback:', error)
      toast({
        title: "Error",
        description: "Failed to fetch feedback. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('patients')
        .update(profile)
        .eq('id', patientId)

      if (error) throw error

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAppointmentReschedule = async (appointmentId: string) => {
    // In a real application, this would open a date picker and handle the rescheduling process
    toast({
      title: "Reschedule Requested",
      description: "Your reschedule request has been submitted. We'll contact you to confirm the new appointment time.",
    })
  }

  const handleAppointmentCancel = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)

      if (error) throw error

      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      ))

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      })
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleConsentFormSubmit = async (formData: FormData) => {
    // In a real application, this would handle the consent form submission process
    toast({
      title: "Consent Form Submitted",
      description: "Your consent form has been successfully submitted.",
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const { error } = await supabase.storage
          .from('medical_records')
          .upload(`${patientId}/${file.name}`, file)

        if (error) throw error

        toast({
          title: "File Uploaded",
          description: "Your medical record has been successfully uploaded.",
        })
      } catch (error) {
        console.error('Error uploading file:', error)
        toast({
          title: "Error",
          description: "Failed to upload file. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card className="w-[1000px]">
      <CardHeader>
        <CardTitle>Patient Portal</CardTitle>
        <CardDescription>Manage your appointments, profile, and billing information</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appointments">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="forms">
              <FileText className="mr-2 h-4 w-4" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="billing">
              <DollarSign className="mr-2 h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <Star className="mr-2 h-4 w-4" />
              Feedback
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell>{appointment.doctor}</TableCell>
                        <TableCell>{appointment.status}</TableCell>
                        <TableCell>
                          {appointment.status === 'upcoming' && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleAppointmentReschedule(appointment.id)}>
                                Reschedule
                              </Button>
                              <Button variant="outline" size="sm" className="ml-2" onClick={() => handleAppointmentCancel(appointment.id)}>
                                Cancel
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="medicalHistory">Medical History</Label>
                      <Textarea
                        id="medicalHistory"
                        value={profile.medicalHistory}
                        onChange={(e) => setProfile({ ...profile, medicalHistory: e.target.value })}
                      />
                    </div>
                    <Button type="submit">Update Profile</Button>
                  </div>
                </form>
                <div className="mt-4">
                  <Label htmlFor="file-upload">Upload Medical Records</Label>
                  <Input id="file-upload" type="file" onChange={handleFileUpload} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>Consent Forms</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Fill Out Consent Form</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Consent Form</DialogTitle>
                      <DialogDescription>
                        Please fill out this consent form for your upcoming appointment.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      handleConsentFormSubmit(new FormData(e.currentTarget))
                    }}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input id="name" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="consent" className="text-right">
                            I consent to treatment
                          </Label>
                          <Input id="consent" type="checkbox" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Submit</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                        <TableCell>{bill.service}</TableCell>
                        <TableCell>${bill.amount.toFixed(2)}</TableCell>
                        <TableCell>{bill.status}</TableCell>
                        
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => window.open(`/invoice/${bill.id}`, '_blank')}>
                            Download Invoice
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Your Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedback.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                        <TableCell>{item.rating}/5</TableCell>
                        <TableCell>{item.comment}</TableCell>
                      </TableRow>
                    ))}
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
        <Button variant="link" onClick={() => window.open('/patient-help', '_blank')}>
          Need Help?
        </Button>
      </CardFooter>
    </Card>
  )
}
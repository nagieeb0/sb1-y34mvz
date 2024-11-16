'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { supabase } from '@/lib/supabaseClient'
import { format, addDays, setHours, setMinutes, isBefore, isAfter } from 'date-fns'

type Availability = {
  [day: string]: { start: string; end: string };
}

type Appointment = {
  id: string;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  status: 'scheduled' | 'canceled' | 'completed';
}

export default function AppointmentManagement({ doctorId }: { doctorId: string }) {
  const [availability, setAvailability] = useState<Availability>({})
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [view, setView] = useState<'doctor' | 'patient'>('doctor')

  useEffect(() => {
    fetchAvailability()
    fetchAppointments()
  }, [])

  const fetchAvailability = async () => {
    const { data, error } = await supabase
      .from('doctor_availability')
      .select('*')
      .eq('doctor_id', doctorId)
      .single()

    if (error) {
      console.error('Error fetching availability:', error)
      toast({
        title: "Error",
        description: "Failed to fetch availability. Please try again.",
        variant: "destructive",
      })
    } else if (data) {
      setAvailability(data.availability)
    }
  }

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId)

    if (error) {
      console.error('Error fetching appointments:', error)
      toast({
        title: "Error",
        description: "Failed to fetch appointments. Please try again.",
        variant: "destructive",
      })
    } else if (data) {
      setAppointments(data)
    }
  }

  const handleSetAvailability = async (day: string, start: string, end: string) => {
    setIsLoading(true)
    const newAvailability = { ...availability, [day]: { start, end } }
    try {
      const { error } = await supabase
        .from('doctor_availability')
        .upsert({ doctor_id: doctorId, availability: newAvailability })

      if (error) throw error

      setAvailability(newAvailability)
      toast({
        title: "Availability Updated",
        description: "Your availability has been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating availability:', error)
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookAppointment = async () => {
    setIsLoading(true)
    try {
      if (!selectedDate || !selectedTime || !patientName || !patientPhone) {
        throw new Error('Please fill in all fields')
      }

      const appointmentDate = format(selectedDate, 'yyyy-MM-dd')
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          doctor_id: doctorId,
          patient_name: patientName,
          patient_phone: patientPhone,
          date: appointmentDate,
          time: selectedTime,
          status: 'scheduled'
        })
        .select()

      if (error) throw error

      setAppointments([...appointments, data[0]])
      setPatientName('')
      setPatientPhone('')
      setSelectedTime('')
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been booked successfully.",
      })

      // Send confirmation (mock function)
      sendConfirmation(data[0])
      // Schedule reminder (mock function)
      scheduleReminder(data[0])
    } catch (error) {
      console.error('Error booking appointment:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'canceled' })
        .eq('id', appointmentId)

      if (error) throw error

      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'canceled' } : apt
      ))
      toast({
        title: "Appointment Canceled",
        description: "The appointment has been canceled successfully.",
      })

      // Notify patient (mock function)
      notifyPatient(appointmentId, 'canceled')
    } catch (error) {
      console.error('Error canceling appointment:', error)
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getAvailableTimeSlots = (date: Date) => {
    const day = format(date, 'EEEE').toLowerCase()
    if (!availability[day]) return []

    const { start, end } = availability[day]
    const startTime = setMinutes(setHours(date, parseInt(start.split(':')[0])), parseInt(start.split(':')[1]))
    const endTime = setMinutes(setHours(date, parseInt(end.split(':')[0])), parseInt(end.split(':')[1]))

    const slots = []
    let currentSlot = startTime
    while (isBefore(currentSlot, endTime)) {
      if (!appointments.some(apt => 
        apt.date === format(date, 'yyyy-MM-dd') && 
        apt.time === format(currentSlot, 'HH:mm') &&
        apt.status === 'scheduled'
      )) {
        slots.push(format(currentSlot, 'HH:mm'))
      }
      currentSlot = addDays(currentSlot, 30) // 30-minute slots
    }

    return slots
  }

  // Mock functions for demonstration purposes
  const sendConfirmation = (appointment: Appointment) => {
    console.log(`Sending confirmation for appointment: ${appointment.id}`)
  }

  const scheduleReminder = (appointment: Appointment) => {
    console.log(`Scheduling reminder for appointment: ${appointment.id}`)
  }

  const notifyPatient = (appointmentId: string, status: string) => {
    console.log(`Notifying patient about appointment ${appointmentId} status: ${status}`)
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Appointment Management</CardTitle>
        <CardDescription>Manage your availability and appointments.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Set Availability</h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <div key={day} className="space-y-2">
                  <Label>{day.charAt(0).toUpperCase() + day.slice(1)}</Label>
                  <div className="flex space-x-2">
                    <Select
                      value={availability[day]?.start || ''}
                      onValueChange={(value) => handleSetAvailability(day, value, availability[day]?.end || '18:00')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Start" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                            {`${hour.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={availability[day]?.end || ''}
                      onValueChange={(value) => handleSetAvailability(day, availability[day]?.start || '09:00', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="End" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                          <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                            {`${hour.toString().padStart(2, '0')}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Upcoming Appointments</h3>
            <div className="space-y-2 mt-2">
              {appointments
                .filter(apt => apt.status === 'scheduled')
                .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
                .map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{`${appointment.patientName} - ${appointment.date} ${appointment.time}`}</span>
                    <Button onClick={() => handleCancelAppointment(appointment.id)} variant="destructive">
                      Cancel
                    </Button>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Book Appointment</h3>
            <div className="space-y-4 mt-2">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="patientPhone">Patient Phone</Label>
                  <Input
                    id="patientPhone"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="Enter patient phone"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label>Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="flex-1">
                  <Label>Select Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDate && getAvailableTimeSlots(selectedDate).map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleBookAppointment} disabled={isLoading}>
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
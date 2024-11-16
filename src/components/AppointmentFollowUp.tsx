'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MessageSquare, Star, TrendingUp, Gift, Settings } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const appointments = [
  { id: '1', date: '2023-07-01', dentist: 'Dr. Smith', treatment: 'Dental Cleaning', feedbackSubmitted: true },
  { id: '2', date: '2023-07-15', dentist: 'Dr. Johnson', treatment: 'Root Canal', feedbackSubmitted: false },
  { id: '3', date: '2023-08-01', dentist: 'Dr. Lee', treatment: 'Dental Implant', feedbackSubmitted: false },
]

const feedbackHistory = [
  { id: '1', appointmentId: '1', overallRating: 4, treatmentQuality: 5, waitTime: 3, staffFriendliness: 5, comments: 'Great experience overall, but the wait time was a bit long.' },
]

const aggregatedFeedback = [
  { aspect: 'Overall Rating', score: 4.2 },
  { aspect: 'Treatment Quality', score: 4.5 },
  { aspect: 'Wait Time', score: 3.8 },
  { aspect: 'Staff Friendliness', score: 4.7 },
]

export default function AppointmentFollowUp({ userId, userType }: { userId: string, userType: 'patient' | 'staff' }) {
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null)
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({
    overallRating: 3,
    treatmentQuality: 3,
    waitTime: 3,
    staffFriendliness: 3,
    comments: '',
  })
  const [followUpTiming, setFollowUpTiming] = useState('1day')
  const [incentiveEnabled, setIncentiveEnabled] = useState(true)
  const [incentiveAmount, setIncentiveAmount] = useState(10)

  useEffect(() => {
    // In a real application, fetch appointment and feedback data from Supabase here
  }, [userId])

  const handleSubmitFeedback = async () => {
    // Simulate submitting feedback to Supabase
    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! Your input helps us improve our services.",
    })
    setShowFeedbackDialog(false)
    // In a real application, update the feedback in Supabase here
  }

  const handleUpdateSettings = async () => {
    // Simulate updating follow-up settings in Supabase
    toast({
      title: "Settings Updated",
      description: "Your follow-up and feedback settings have been updated successfully.",
    })
    // In a real application, update the settings in Supabase here
  }

  return (
    <Card className="w-[1000px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-6 w-6" />
          Appointment Follow-Up and Feedback
        </CardTitle>
        <CardDescription>Manage appointment follow-ups and patient feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={userType === 'patient' ? "my-feedback" : "feedback-summary"}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="my-feedback" disabled={userType !== 'patient'}>
              <Star className="mr-2 h-4 w-4" />
              My Feedback
            </TabsTrigger>
            <TabsTrigger value="feedback-summary" disabled={userType !== 'staff'}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Feedback Summary
            </TabsTrigger>
            <TabsTrigger value="incentives" disabled={userType !== 'staff'}>
              <Gift className="mr-2 h-4 w-4" />
              Incentives
            </TabsTrigger>
            <TabsTrigger value="settings" disabled={userType !== 'staff'}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-feedback">
            <Card>
              <CardHeader>
                <CardTitle>My Appointment Feedback</CardTitle>
                <CardDescription>View and provide feedback for your recent appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Dentist</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.dentist}</TableCell>
                        <TableCell>{appointment.treatment}</TableCell>
                        <TableCell>
                          {appointment.feedbackSubmitted ? (
                            <span className="text-green-500">Feedback Submitted</span>
                          ) : (
                            <Button
                              onClick={() => {
                                setSelectedAppointment(appointment)
                                setShowFeedbackDialog(true)
                              }}
                            >
                              Provide Feedback
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

          <TabsContent value="feedback-summary">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Summary</CardTitle>
                <CardDescription>Overview of patient feedback and satisfaction levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={aggregatedFeedback}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="aspect" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Recent Comments:</h4>
                  <ul className="list-disc list-inside">
                    {feedbackHistory.map((feedback) => (
                      <li key={feedback.id} className="text-sm">{feedback.comments}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incentives">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Incentives</CardTitle>
                <CardDescription>Manage incentives for patient feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="enable-incentives"
                      checked={incentiveEnabled}
                      onChange={(e) => setIncentiveEnabled(e.target.checked)}
                      className="form-checkbox"
                    />
                    <Label htmlFor="enable-incentives">Enable feedback incentives</Label>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="incentive-amount" className="text-right">
                      Incentive Amount (Loyalty Points)
                    </Label>
                    <Input
                      id="incentive-amount"
                      type="number"
                      value={incentiveAmount}
                      onChange={(e) => setIncentiveAmount(parseInt(e.target.value))}
                      className="col-span-3"
                    />
                  </div>
                  <Button onClick={handleUpdateSettings}>Update Incentive Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Follow-Up Settings</CardTitle>
                <CardDescription>Configure appointment follow-up and feedback collection settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="follow-up-timing" className="text-right">
                      Follow-Up Timing
                    </Label>
                    <Select value={followUpTiming} onValueChange={setFollowUpTiming}>
                      <SelectTrigger id="follow-up-timing" className="col-span-3">
                        <SelectValue placeholder="Select follow-up timing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediately after appointment</SelectItem>
                        <SelectItem value="1day">1 day after appointment</SelectItem>
                        <SelectItem value="3days">3 days after appointment</SelectItem>
                        <SelectItem value="1week">1 week after appointment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleUpdateSettings}>Update Follow-Up Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
            <DialogDescription>
              Share your experience from your appointment on {selectedAppointment?.date} with {selectedAppointment?.dentist}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="overall-rating" className="text-right">
                Overall Rating
              </Label>
              <Slider
                id="overall-rating"
                min={1}
                max={5}
                step={1}
                value={[feedbackForm.overallRating]}
                onValueChange={(value) => setFeedbackForm({ ...feedbackForm, overallRating: value[0] })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="treatment-quality" className="text-right">
                Treatment Quality
              </Label>
              <Slider
                id="treatment-quality"
                min={1}
                max={5}
                step={1}
                value={[feedbackForm.treatmentQuality]}
                onValueChange={(value) => setFeedbackForm({ ...feedbackForm, treatmentQuality: value[0] })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="wait-time" className="text-right">
                Wait Time
              </Label>
              <Slider
                id="wait-time"
                min={1}
                max={5}
                step={1}
                value={[feedbackForm.waitTime]}
                onValueChange={(value) => setFeedbackForm({ ...feedbackForm, waitTime: value[0] })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="staff-friendliness" className="text-right">
                Staff Friendliness
              </Label>
              <Slider
                id="staff-friendliness"
                min={1}
                max={5}
                step={1}
                value={[feedbackForm.staffFriendliness]}
                onValueChange={(value) => setFeedbackForm({ ...feedbackForm, staffFriendliness: value[0] })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comments" className="text-right">
                Comments
              </Label>
              <Textarea
                id="comments"
                value={feedbackForm.comments}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
        <Button variant="link" onClick={() => window.open('/feedback-help', '_blank')}>
          Learn More About Feedback Collection
        </Button>
      </CardFooter>
    </Card>
  )
}
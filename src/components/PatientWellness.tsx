'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Heart, Calendar, Target, BookOpen, Bell } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const wellnessPrograms = [
  { id: '1', name: 'Preventive Care', description: 'Focus on maintaining good oral health through regular check-ups and cleanings.' },
  { id: '2', name: 'Restorative Health', description: 'Tailored program for patients needing ongoing restorative treatments.' },
  { id: '3', name: 'Pediatric Dental Wellness', description: 'Specialized program for children\'s dental health and education.' },
]

const patientGoals = [
  { id: '1', name: 'Reduce Cavities', progress: 75 },
  { id: '2', name: 'Improve Gum Health', progress: 60 },
  { id: '3', name: 'Maintain Regular Flossing', progress: 40 },
]

const upcomingReminders = [
  { id: '1', type: 'Cleaning', date: '2023-08-15' },
  { id: '2', type: 'Annual Exam', date: '2023-09-01' },
  { id: '3', type: 'Fluoride Treatment', date: '2023-10-10' },
]

const educationalTips = [
  { id: '1', title: 'Proper Brushing Technique', content: 'Brush your teeth for two minutes, twice a day, using circular motions.' },
  { id: '2', title: 'Flossing Importance', content: 'Floss daily to remove plaque and food particles between teeth.' },
  { id: '3', title: 'Healthy Diet for Teeth', content: 'Limit sugary and acidic foods to protect your tooth enamel.' },
]

export default function PatientWellness({ patientId }: { patientId: string }) {
  const [enrolledPrograms, setEnrolledPrograms] = useState<string[]>([])
  const [selectedGoal, setSelectedGoal] = useState('')
  const [newGoalProgress, setNewGoalProgress] = useState(0)
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false)
  const [reminderPreferences, setReminderPreferences] = useState({
    email: true,
    sms: false,
    push: true,
  })

  useEffect(() => {
    // In a real application, fetch patient's wellness data from Supabase here
  }, [patientId])

  const handleProgramEnrollment = (programId: string) => {
    if (enrolledPrograms.includes(programId)) {
      setEnrolledPrograms(enrolledPrograms.filter(id => id !== programId))
      toast({
        title: "Program Unenrolled",
        description: "You have been unenrolled from the selected wellness program.",
      })
    } else {
      setEnrolledPrograms([...enrolledPrograms, programId])
      toast({
        title: "Program Enrolled",
        description: "You have been successfully enrolled in the selected wellness program.",
      })
    }
  }

  const handleAddNewGoal = () => {
    // In a real application, this would add the new goal to Supabase
    setShowNewGoalDialog(false)
    toast({
      title: "New Goal Added",
      description: "Your new dental health goal has been added successfully.",
    })
  }

  const handleUpdateReminderPreferences = () => {
    // In a real application, this would update preferences in Supabase
    toast({
      title: "Preferences Updated",
      description: "Your reminder preferences have been updated successfully.",
    })
  }

  return (
    <Card className="w-[1000px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-6 w-6" />
          Patient Wellness Programs and Preventative Care
        </CardTitle>
        <CardDescription>Manage your wellness programs, set health goals, and view preventative care reminders</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="programs">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="programs">
              <Heart className="mr-2 h-4 w-4" />
              Programs
            </TabsTrigger>
            <TabsTrigger value="goals">
              <Target className="mr-2 h-4 w-4" />
              Health Goals
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <Calendar className="mr-2 h-4 w-4" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="education">
              <BookOpen className="mr-2 h-4 w-4" />
              Education
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Programs</CardTitle>
                <CardDescription>Enroll in wellness programs to improve your dental health</CardDescription>
              </CardHeader>
              <CardContent>
                {wellnessPrograms.map((program) => (
                  <div key={program.id} className="mb-4 flex items-center space-x-4">
                    <Checkbox
                      id={`program-${program.id}`}
                      checked={enrolledPrograms.includes(program.id)}
                      onCheckedChange={() => handleProgramEnrollment(program.id)}
                    />
                    <div>
                      <Label htmlFor={`program-${program.id}`} className="font-medium">
                        {program.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{program.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>Health Goals</CardTitle>
                <CardDescription>Track your progress towards dental health goals</CardDescription>
              </CardHeader>
              <CardContent>
                {patientGoals.map((goal) => (
                  <div key={goal.id} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <Label>{goal.name}</Label>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="w-full" />
                  </div>
                ))}
                <Button onClick={() => setShowNewGoalDialog(true)}>Add New Goal</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reminders">
            <Card>
              <CardHeader>
                <CardTitle>Preventative Care Reminders</CardTitle>
                <CardDescription>View upcoming appointments and set reminder preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingReminders.map((reminder) => (
                      <TableRow key={reminder.id}>
                        <TableCell>{reminder.type}</TableCell>
                        <TableCell>{reminder.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Reminder Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email-reminders"
                        checked={reminderPreferences.email}
                        onCheckedChange={(checked) => setReminderPreferences({...reminderPreferences, email: checked as boolean})}
                      />
                      <Label htmlFor="email-reminders">Email Reminders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sms-reminders"
                        checked={reminderPreferences.sms}
                        onCheckedChange={(checked) => setReminderPreferences({...reminderPreferences, sms: checked as boolean})}
                      />
                      <Label htmlFor="sms-reminders">SMS Reminders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="push-reminders"
                        checked={reminderPreferences.push}
                        onCheckedChange={(checked) => setReminderPreferences({...reminderPreferences, push: checked as boolean})}
                      />
                      <Label htmlFor="push-reminders">Push Notifications</Label>
                    </div>
                  </div>
                  <Button className="mt-4" onClick={handleUpdateReminderPreferences}>Update Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle>Educational Content</CardTitle>
                <CardDescription>Learn tips and tricks for maintaining optimal oral health</CardDescription>
              </CardHeader>
              <CardContent>
                {educationalTips.map((tip) => (
                  <Card key={tip.id} className="mb-4">
                    <CardHeader>
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{tip.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Health Goal</DialogTitle>
            <DialogDescription>
              Set a new dental health goal to track your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goal-name" className="text-right">
                Goal Name
              </Label>
              <Input
                id="goal-name"
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="initial-progress" className="text-right">
                Initial Progress
              </Label>
              <Input
                id="initial-progress"
                type="number"
                min="0"
                max="100"
                value={newGoalProgress}
                onChange={(e) => setNewGoalProgress(parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddNewGoal}>Add Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
        <Button variant="link" onClick={() => window.open('/wellness-help', '_blank')}>
          Learn More About Wellness Programs
        </Button>
      </CardFooter>
    </Card>
  )
}
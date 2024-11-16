'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Brain, TrendingUp, Users, Clock, MessageCircle, Zap, ChevronUp, ChevronDown } from 'lucide-react'

// Simulated data (replace with actual AI-generated insights and Supabase queries in production)
const patientCareInsights = [
  { id: 1, category: 'Treatment Effectiveness', insight: 'Root canal success rate increased by 5% after implementing new sterilization protocol', impact: 'High', action: 'Continue monitoring and consider expanding protocol to other procedures' },
  { id: 2, category: 'Patient Retention', insight: 'Patients who receive follow-up calls within 48 hours of treatment are 30% more likely to schedule their next appointment', impact: 'Medium', action: 'Implement automated follow-up call system' },
  { id: 3, category: 'Preventive Care', insight: 'Patients using the mobile app for oral health tracking show 20% improvement in hygiene habits', impact: 'High', action: 'Promote mobile app usage during appointments' },
]

const operationalInsights = [
  { id: 1, category: 'Scheduling', insight: 'Implementing 10-minute buffer between appointments reduced overall wait times by 15%', impact: 'Medium', action: 'Adjust scheduling algorithm to include buffers' },
  { id: 2, category: 'Resource Utilization', insight: 'Dental hygienists are underutilized on Wednesdays; consider offering more hygiene appointments', impact: 'Medium', action: 'Revise staffing schedule and promote hygiene appointments for Wednesdays' },
  { id: 3, category: 'Inventory Management', insight: 'Current ordering patterns for disposable supplies result in 10% waste; optimize order quantities', impact: 'Low', action: 'Adjust automated ordering system parameters' },
]

const patientFeedbackTrends = [
  { month: 'Jan', satisfaction: 85, complaints: 5 },
  { month: 'Feb', satisfaction: 87, complaints: 4 },
  { month: 'Mar', satisfaction: 86, complaints: 6 },
  { month: 'Apr', satisfaction: 89, complaints: 3 },
  { month: 'May', satisfaction: 90, complaints: 2 },
  { month: 'Jun', satisfaction: 92, complaints: 2 },
]

const appointmentEfficiencyData = [
  { name: 'On Time', value: 70 },
  { name: 'Slight Delay', value: 20 },
  { name: 'Significant Delay', value: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function AIDrivenInsights() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedInsight, setSelectedInsight] = useState<any | null>(null)
  const [showActionDialog, setShowActionDialog] = useState(false)

  useEffect(() => {
    // In a real application, fetch AI-generated insights from Supabase here
  }, [])

  const handleImplementAction = () => {
    // In a real application, log the action taken and trigger any necessary processes
    toast({
      title: "Action Implemented",
      description: `The recommended action for "${selectedInsight.insight}" has been initiated.`,
    })
    setShowActionDialog(false)
  }

  const renderInsightCard = (insight: any) => (
    <Card key={insight.id} className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{insight.category}</CardTitle>
        <CardDescription>{insight.insight}</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant={insight.impact === 'High' ? 'destructive' : insight.impact === 'Medium' ? 'default' : 'secondary'}>
          {insight.impact} Impact
        </Badge>
      </CardContent>
      <CardFooter>
        <Button onClick={() => {
          setSelectedInsight(insight)
          setShowActionDialog(true)
        }}>View Recommended Action</Button>
      </CardFooter>
    </Card>
  )

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Brain className="mr-2 h-6 w-6" />
          AI-Driven Insights Dashboard
        </CardTitle>
        <CardDescription>Leverage AI-generated insights to improve patient care and clinic operations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patient-care">Patient Care</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="feedback">Feedback Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground">+2% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Treatment Success Rate</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">95%</div>
                      <p className="text-xs text-muted-foreground">+5% from last quarter</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Operational Efficiency</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">87%</div>
                      <p className="text-xs text-muted-foreground">+3% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Patient Retention</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">89%</div>
                      <p className="text-xs text-muted-foreground">+1% from last quarter</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patient-care">
            <Card>
              <CardHeader>
                <CardTitle>Patient Care Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {patientCareInsights.map(renderInsightCard)}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations">
            <Card>
              <CardHeader>
                <CardTitle>Operational Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {operationalInsights.map(renderInsightCard)}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Patient Feedback Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Satisfaction Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={patientFeedbackTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="satisfaction" stroke="#8884d8" name="Satisfaction %" />
                            <Line type="monotone" dataKey="complaints" stroke="#82ca9d" name="Complaints" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Appointment Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={appointmentEfficiencyData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {appointmentEfficiencyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Recommended Action</DialogTitle>
            <DialogDescription>
              Review and implement the AI-suggested action for this insight.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="font-semibold mb-2">{selectedInsight?.category}</h4>
            <p className="mb-4">{selectedInsight?.insight}</p>
            <div className="bg-muted p-4 rounded-md">
              <h5 className="font-semibold mb-2">Recommended Action:</h5>
              <p>{selectedInsight?.action}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>Cancel</Button>
            <Button onClick={handleImplementAction}>Implement Action</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
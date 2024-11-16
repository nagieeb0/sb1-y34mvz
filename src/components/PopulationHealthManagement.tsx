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
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Users, TrendingUp, AlertTriangle, Activity, Map, Calendar, FileText } from 'lucide-react'

// Simulated data (replace with actual Supabase queries and AI model predictions in production)
const prevalentIssues = [
  { name: 'Cavities', count: 450, percentage: 45 },
  { name: 'Gum Disease', count: 300, percentage: 30 },
  { name: 'Orthodontic Needs', count: 150, percentage: 15 },
  { name: 'Tooth Sensitivity', count: 100, percentage: 10 },
]

const demographicTrends = [
  { ageGroup: '0-18', cavities: 120, gumDisease: 30, orthodonticNeeds: 80 },
  { ageGroup: '19-35', cavities: 150, gumDisease: 70, orthodonticNeeds: 50 },
  { ageGroup: '36-50', cavities: 100, gumDisease: 120, orthodonticNeeds: 20 },
  { ageGroup: '51+', cavities: 80, gumDisease: 80, orthodonticNeeds: 0 },
]

const preventiveCareGaps = [
  { id: 1, patientName: 'John Doe', lastCheckup: '2022-09-15', dueFor: 'Cleaning', riskLevel: 'High' },
  { id: 2, patientName: 'Jane Smith', lastCheckup: '2023-01-20', dueFor: 'Fluoride Treatment', riskLevel: 'Medium' },
  { id: 3, patientName: 'Bob Johnson', lastCheckup: '2023-03-05', dueFor: 'X-rays', riskLevel: 'Low' },
]

const treatmentSuccessRates = [
  { treatment: 'Dental Implants', successRate: 95 },
  { treatment: 'Root Canals', successRate: 90 },
  { treatment: 'Fillings', successRate: 98 },
  { treatment: 'Crowns', successRate: 92 },
]

const riskFactors = [
  { factor: 'Smoking', prevalence: 20, associatedConditions: ['Gum Disease', 'Tooth Discoloration'] },
  { factor: 'Poor Diet', prevalence: 35, associatedConditions: ['Cavities', 'Tooth Decay'] },
  { factor: 'Lack of Fluoride', prevalence: 25, associatedConditions: ['Cavities', 'Tooth Sensitivity'] },
  { factor: 'Genetics', prevalence: 15, associatedConditions: ['Orthodontic Issues', 'Gum Disease'] },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function PopulationHealthManagement() {
  const [activeTab, setActiveTab] = useState('insights')
  const [selectedDemographic, setSelectedDemographic] = useState('all')
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportType, setReportType] = useState('')

  useEffect(() => {
    // In a real application, fetch population health data from Supabase here
  }, [])

  const handleGenerateReport = () => {
    // In a real application, generate and possibly email the selected report type
    toast({
      title: "Report Generated",
      description: `The ${reportType} report has been generated and sent to your email.`,
    })
    setShowReportDialog(false)
    setReportType('')
  }

  const getRiskLevelBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return <Badge variant="destructive">High Risk</Badge>
      case 'Medium':
        return <Badge variant="warning">Medium Risk</Badge>
      case 'Low':
        return <Badge variant="secondary">Low Risk</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Users className="mr-2 h-6 w-6" />
          Population Health Management
        </CardTitle>
        <CardDescription>Analyze health trends and improve care outcomes for your patient base</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="insights">Health Insights</TabsTrigger>
            <TabsTrigger value="preventive">Preventive Care</TabsTrigger>
            <TabsTrigger value="outcomes">Treatment Outcomes</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Population Health Insights</CardTitle>
                <Select value={selectedDemographic} onValueChange={setSelectedDemographic}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select demographic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="0-18">0-18 years</SelectItem>
                    <SelectItem value="19-35">19-35 years</SelectItem>
                    <SelectItem value="36-50">36-50 years</SelectItem>
                    <SelectItem value="51+">51+ years</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Prevalent Dental Issues</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={prevalentIssues}
                              dataKey="percentage"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              label
                            >
                              {prevalentIssues.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Demographic Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={demographicTrends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ageGroup" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="cavities" fill="#8884d8" name="Cavities" />
                            <Bar dataKey="gumDisease" fill="#82ca9d" name="Gum Disease" />
                            <Bar dataKey="orthodonticNeeds" fill="#ffc658" name="Orthodontic Needs" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preventive">
            <Card>
              <CardHeader>
                <CardTitle>Preventive Care Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Last Checkup</TableHead>
                      <TableHead>Due For</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preventiveCareGaps.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.patientName}</TableCell>
                        <TableCell>{patient.lastCheckup}</TableCell>
                        <TableCell>{patient.dueFor}</TableCell>
                        <TableCell>{getRiskLevelBadge(patient.riskLevel)}</TableCell>
                        <TableCell>
                          <Button size="sm">Send Reminder</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outcomes">
            <Card>
              <CardHeader>
                <CardTitle>Treatment Success Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {treatmentSuccessRates.map((treatment) => (
                    <div key={treatment.treatment} className="flex items-center">
                      <span className="w-40 font-medium">{treatment.treatment}</span>
                      <Progress value={treatment.successRate} className="flex-1" />
                      <span className="ml-4 font-medium">{treatment.successRate}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk">
            <Card>
              <CardHeader>
                <CardTitle>Risk Factor Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Risk Factor</TableHead>
                      <TableHead>Prevalence</TableHead>
                      <TableHead>Associated Conditions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riskFactors.map((factor) => (
                      <TableRow key={factor.factor}>
                        <TableCell>{factor.factor}</TableCell>
                        <TableCell>{factor.prevalence}%</TableCell>
                        <TableCell>{factor.associatedConditions.join(', ')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="cursor-pointer hover:bg-muted" onClick={() => {
                    setReportType('Population Health Overview')
                    setShowReportDialog(true)
                  }}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        Population Health Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Comprehensive overview of population health trends and insights.</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:bg-muted" onClick={() => {
                    setReportType('Preventive Care Needs')
                    setShowReportDialog(true)
                  }}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Preventive Care Needs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Analysis of preventive care gaps and recommended interventions.</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:bg-muted" onClick={() => {
                    setReportType('Treatment Outcomes')
                    setShowReportDialog(true)
                  }}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="mr-2 h-4 w-4" />
                        Treatment Outcomes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Detailed report on treatment success rates and areas for improvement.</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate  {reportType} Report</DialogTitle>
            <DialogDescription>
              This will generate a detailed report based on the current population health data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="report-format" className="text-right">
                Format
              </Label>
              <Select defaultValue="pdf">
                <SelectTrigger id="report-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="report-period" className="text-right">
                Time Period
              </Label>
              <Select defaultValue="last-month">
                <SelectTrigger id="report-period">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="last-year">Last Year</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleGenerateReport}>Generate Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
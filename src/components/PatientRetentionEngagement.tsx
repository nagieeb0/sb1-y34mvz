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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { AlertTriangle, Users, TrendingUp, Gift, Bell, BarChart2, Send } from 'lucide-react'

// Simulated data (replace with actual Supabase queries and AI model predictions in production)
const atRiskPatients = [
  { id: 1, name: 'John Doe', lastVisit: '2022-09-15', riskLevel: 'High', engagementScore: 30 },
  { id: 2, name: 'Jane Smith', lastVisit: '2023-01-20', riskLevel: 'Medium', engagementScore: 50 },
  { id: 3, name: 'Bob Johnson', lastVisit: '2023-03-05', riskLevel: 'Low', engagementScore: 70 },
]

const engagementCampaigns = [
  { id: 1, name: 'Reactivation Campaign', targetSegment: 'Inactive Patients', status: 'Active', responseRate: 15 },
  { id: 2, name: 'Preventive Care Reminder', targetSegment: 'All Patients', status: 'Scheduled', responseRate: 0 },
  { id: 3, name: 'Loyalty Program Promotion', targetSegment: 'High-Value Patients', status: 'Completed', responseRate: 25 },
]

const loyaltyRewards = [
  { id: 1, name: 'Free Teeth Whitening', popularity: 80, redemptionRate: 60 },
  { id: 2, name: '20% Off Next Cleaning', popularity: 90, redemptionRate: 75 },
  { id: 3, name: 'Complimentary Dental Kit', popularity: 70, redemptionRate: 85 },
]

const engagementTrends = [
  { month: 'Jan', retentionRate: 85, engagementScore: 70 },
  { month: 'Feb', retentionRate: 87, engagementScore: 72 },
  { month: 'Mar', retentionRate: 86, engagementScore: 75 },
  { month: 'Apr', retentionRate: 88, engagementScore: 78 },
  { month: 'May', retentionRate: 90, engagementScore: 80 },
  { month: 'Jun', retentionRate: 91, engagementScore: 82 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function PatientRetentionEngagement() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showCampaignDialog, setShowCampaignDialog] = useState(false)
  const [campaignDetails, setCampaignDetails] = useState({ name: '', targetSegment: '', message: '' })

  useEffect(() => {
    // In a real application, fetch AI-powered retention and engagement data from Supabase here
  }, [])

  const handleLaunchCampaign = () => {
    // In a real application, save the campaign to Supabase and trigger the engagement process
    toast({
      title: "Campaign Launched",
      description: `${campaignDetails.name} campaign has been launched for ${campaignDetails.targetSegment}.`,
    })
    setShowCampaignDialog(false)
    setCampaignDetails({ name: '', targetSegment: '', message: '' })
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
          AI-Enhanced Patient Retention & Engagement
        </CardTitle>
        <CardDescription>Optimize patient retention and engagement with AI-driven insights</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="at-risk">At-Risk Patients</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Retention & Engagement Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">91%</div>
                      <p className="text-xs text-muted-foreground">+2% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg. Engagement Score</CardTitle>
                      <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">82</div>
                      <p className="text-xs text-muted-foreground">+5 points from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">At-Risk Patients</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                      <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">2 scheduled for next week</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Engagement Trends</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={engagementTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="retentionRate" stroke="#8884d8" name="Retention Rate" />
                        <Line type="monotone" dataKey="engagementScore" stroke="#82ca9d" name="Engagement Score" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="at-risk">
            <Card>
              <CardHeader>
                <CardTitle>At-Risk Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Engagement Score</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atRiskPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>{getRiskLevelBadge(patient.riskLevel)}</TableCell>
                        <TableCell>
                          <Progress value={patient.engagementScore} className="w-[60px]" />
                        </TableCell>
                        <TableCell>
                          <Button size="sm">Contact</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Campaigns</CardTitle>
                <Button onClick={() => setShowCampaignDialog(true)}>
                  <Send className="mr-2 h-4 w-4" />
                  Launch New Campaign
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>Target Segment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {engagementCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>{campaign.targetSegment}</TableCell>
                        <TableCell>
                          <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{campaign.responseRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Program Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Reward Popularity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={loyaltyRewards}
                              dataKey="popularity"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              label
                            >
                              {loyaltyRewards.map((entry, index) => (
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
                      <CardTitle className="text-lg">Reward Redemption Rates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {loyaltyRewards.map((reward) => (
                          <div key={reward.id} className="flex items-center">
                            <span className="w-40 truncate">{reward.name}</span>
                            <Progress value={reward.redemptionRate} className="flex-1 ml-2" />
                            <span className="ml-2 w-10 text-right">{reward.redemptionRate}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="retentionRate" fill="#8884d8" name="Retention Rate" />
                      <Bar dataKey="engagementScore" fill="#82ca9d" name="Engagement Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Launch New Campaign</DialogTitle>
            <DialogDescription>
              Create a new engagement campaign for your patients.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={campaignDetails.name}
                onChange={(e) => setCampaignDetails({ ...campaignDetails, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="segment" className="text-right">
                Target Segment
              </Label>
              <Select
                value={campaignDetails.targetSegment}
                onValueChange={(value) => setCampaignDetails({ ...campaignDetails, targetSegment: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Patients">All Patients</SelectItem>
                  <SelectItem value="Inactive Patients">Inactive Patients</SelectItem>
                  <SelectItem value="High-Risk Patients">High-Risk Patients</SelectItem>
                  <SelectItem value="Loyalty Program Members">Loyalty Program Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Textarea
                id="message"
                value={campaignDetails.message}
                onChange={(e) => setCampaignDetails({ ...campaignDetails, message: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleLaunchCampaign}>Launch Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
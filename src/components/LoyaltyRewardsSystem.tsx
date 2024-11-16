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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Gift, Star, Users, TrendingUp, Plus, Award, Zap } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const patientLoyaltyData = {
  points: 750,
  level: 'Silver',
  nextLevel: 'Gold',
  pointsToNextLevel: 250,
  recentActivity: [
    { id: 1, action: 'Appointment Attended', points: 50, date: '2023-07-20' },
    { id: 2, action: 'Referral Bonus', points: 100, date: '2023-07-15' },
    { id: 3, action: 'Feedback Submitted', points: 25, date: '2023-07-10' },
  ],
  availableRewards: [
    { id: 1, name: 'Free Teeth Whitening', pointsCost: 1000, description: 'Get a free teeth whitening session' },
    { id: 2, name: '20% Off Next Cleaning', pointsCost: 500, description: 'Receive 20% off your next dental cleaning' },
    { id: 3, name: 'Free Electric Toothbrush', pointsCost: 750, description: 'Redeem a free electric toothbrush' },
  ],
}

const clinicLoyaltyData = {
  totalPatients: 1000,
  activeInProgram: 750,
  totalPointsAwarded: 100000,
  totalRewardsRedeemed: 250,
  topReferrers: [
    { name: 'John Doe', referrals: 5 },
    { name: 'Jane Smith', referrals: 4 },
    { name: 'Bob Johnson', referrals: 3 },
  ],
  popularRewards: [
    { name: 'Free Teeth Whitening', redeemed: 50 },
    { name: '20% Off Next Cleaning', redeemed: 75 },
    { name: 'Free Electric Toothbrush', redeemed: 40 },
  ],
  retentionRate: 85,
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function LoyaltyRewardsSystem({ userType, userId }: { userType: 'patient' | 'clinic', userId: string }) {
  const [activeTab, setActiveTab] = useState(userType === 'patient' ? 'overview' : 'dashboard')
  const [showRedeemDialog, setShowRedeemDialog] = useState(false)
  const [selectedReward, setSelectedReward] = useState<typeof patientLoyaltyData.availableRewards[0] | null>(null)
  const [showNewRewardDialog, setShowNewRewardDialog] = useState(false)
  const [newReward, setNewReward] = useState({ name: '', pointsCost: 0, description: '' })

  useEffect(() => {
    // In a real application, fetch loyalty data from Supabase here based on userType and userId
  }, [userType, userId])

  const handleRedeemReward = () => {
    if (selectedReward) {
      // In a real application, process the reward redemption in Supabase
      toast({
        title: "Reward Redeemed",
        description: `You have successfully redeemed ${selectedReward.name} for ${selectedReward.pointsCost} points.`,
      })
      setShowRedeemDialog(false)
    }
  }

  const handleAddNewReward = () => {
    // In a real application, add the new reward to Supabase
    toast({
      title: "New Reward Added",
      description: `${newReward.name} has been added to the rewards program.`,
    })
    setShowNewRewardDialog(false)
    setNewReward({ name: '', pointsCost: 0, description: '' })
  }

  const renderPatientView = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Star className="mr-2 h-6 w-6" />
          Your Loyalty Rewards
        </CardTitle>
        <CardDescription>Track your points and redeem rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Current Level: {patientLoyaltyData.level}</h3>
                    <p className="text-sm text-muted-foreground">Next Level: {patientLoyaltyData.nextLevel}</p>
                  </div>
                  <Badge variant="secondary" className="text-lg">{patientLoyaltyData.points} Points</Badge>
                </div>
                <Progress value={(patientLoyaltyData.points / (patientLoyaltyData.points + patientLoyaltyData.pointsToNextLevel)) * 100} className="w-full" />
                <p className="text-sm text-center">{patientLoyaltyData.pointsToNextLevel} points to reach {patientLoyaltyData.nextLevel}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Points Earned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientLoyaltyData.recentActivity.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.date}</TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>{activity.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {patientLoyaltyData.availableRewards.map((reward) => (
                    <Card key={reward.id}>
                      <CardHeader>
                        <CardTitle>{reward.name}</CardTitle>
                        <CardDescription>{reward.pointsCost} Points</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{reward.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => {
                          setSelectedReward(reward)
                          setShowRedeemDialog(true)
                        }} disabled={patientLoyaltyData.points < reward.pointsCost}>
                          Redeem
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  const renderClinicView = () => (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Award className="mr-2 h-6 w-6" />
          Loyalty Program Management
        </CardTitle>
        <CardDescription>Manage your clinic's loyalty and rewards program</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Program Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{clinicLoyaltyData.totalPatients}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active in Program</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{clinicLoyaltyData.activeInProgram}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Points Awarded</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{clinicLoyaltyData.totalPointsAwarded}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Rewards Redeemed</CardTitle>
                      <Gift className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{clinicLoyaltyData.totalRewardsRedeemed}</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle>Manage Rewards</CardTitle>
                <Button onClick={() => setShowNewRewardDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Reward
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reward Name</TableHead>
                      <TableHead>Points Cost</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientLoyaltyData.availableRewards.map((reward) => (
                      <TableRow key={reward.id}>
                        <TableCell>{reward.name}</TableCell>
                        <TableCell>{reward.pointsCost}</TableCell>
                        <TableCell>{reward.description}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Referrals</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clinicLoyaltyData.topReferrers.map((referrer, index) => (
                      <TableRow key={index}>
                        <TableCell>{referrer.name}</TableCell>
                        
                        <TableCell>{referrer.referrals}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Program Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Popular Rewards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={clinicLoyaltyData.popularRewards}
                              dataKey="redeemed"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              label
                            >
                              {clinicLoyaltyData.popularRewards.map((entry, index) => (
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
                      <CardTitle className="text-lg">Retention Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center h-[300px]">
                        <div className="text-5xl font-bold">{clinicLoyaltyData.retentionRate}%</div>
                        <p className="text-sm text-muted-foreground mt-2">Patient Retention Rate</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  return (
    <>
      {userType === 'patient' ? renderPatientView() : renderClinicView()}

      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
            <DialogDescription>
              Are you sure you want to redeem this reward?
            </DialogDescription>
          </DialogHeader>
          {selectedReward && (
            <div className="py-4">
              <h4 className="font-semibold">{selectedReward.name}</h4>
              <p>{selectedReward.description}</p>
              <p className="mt-2">Cost: {selectedReward.pointsCost} points</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRedeemDialog(false)}>Cancel</Button>
            <Button onClick={handleRedeemReward}>Confirm Redemption</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewRewardDialog} onOpenChange={setShowNewRewardDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Reward</DialogTitle>
            <DialogDescription>
              Create a new reward for your loyalty program.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rewardName" className="text-right">
                Name
              </Label>
              <Input
                id="rewardName"
                value={newReward.name}
                onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pointsCost" className="text-right">
                Points Cost
              </Label>
              <Input
                id="pointsCost"
                type="number"
                value={newReward.pointsCost}
                onChange={(e) => setNewReward({ ...newReward, pointsCost: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newReward.description}
                onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddNewReward}>Add Reward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
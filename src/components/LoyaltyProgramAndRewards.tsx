'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Gift, Star, Users, Calendar, TrendingUp } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const patientLoyalty = {
  points: 750,
  tier: 'Silver',
  referrals: 2,
}

const rewardsOptions = [
  { id: '1', name: 'Free Dental Check-up', pointsCost: 500 },
  { id: '2', name: '20% Off Next Cleaning', pointsCost: 300 },
  { id: '3', name: 'Free Teeth Whitening', pointsCost: 1000 },
  { id: '4', name: '$50 Off Any Treatment', pointsCost: 750 },
]

const pointsHistory = [
  { id: '1', date: '2023-06-15', action: 'Appointment Completed', points: 100 },
  { id: '2', date: '2023-05-20', action: 'Referral Bonus', points: 200 },
  { id: '3', date: '2023-04-10', action: 'Appointment Completed', points: 100 },
]

const activePromotions = [
  { id: '1', name: 'Double Points Month', description: 'Earn double points on all appointments in July!', endDate: '2023-07-31' },
  { id: '2', name: 'Referral Bonus', description: 'Get 300 points for each referral instead of 200 until August 15th!', endDate: '2023-08-15' },
]

export default function LoyaltyProgramAndRewards({ userId }: { userId: string }) {
  const [loyaltyInfo, setLoyaltyInfo] = useState(patientLoyalty)
  const [rewards, setRewards] = useState(rewardsOptions)
  const [history, setHistory] = useState(pointsHistory)
  const [promotions, setPromotions] = useState(activePromotions)
  const [showReferralDialog, setShowReferralDialog] = useState(false)
  const [referralEmail, setReferralEmail] = useState('')

  useEffect(() => {
    // In a real application, fetch loyalty data from Supabase here
  }, [userId])

  const handleRedeemReward = async (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId)
    if (reward && loyaltyInfo.points >= reward.pointsCost) {
      // Simulate redeeming a reward
      setLoyaltyInfo(prev => ({ ...prev, points: prev.points - reward.pointsCost }))
      toast({
        title: "Reward Redeemed",
        description: `You have successfully redeemed ${reward.name}. Your new points balance is ${loyaltyInfo.points - reward.pointsCost}.`,
      })
    } else {
      toast({
        title: "Insufficient Points",
        description: "You don't have enough points to redeem this reward.",
        variant: "destructive",
      })
    }
  }

  const handleReferral = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Simulate sending a referral
    setShowReferralDialog(false)
    setReferralEmail('')
    toast({
      title: "Referral Sent",
      description: "Your referral has been sent successfully. You'll receive points once they complete their first appointment.",
    })
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift className="mr-2 h-6 w-6" />
          Loyalty Program and Rewards
        </CardTitle>
        <CardDescription>Track your points, redeem rewards, and view special promotions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Your Points: {loyaltyInfo.points}</h3>
            <span className="text-sm font-medium bg-primary text-primary-foreground px-2 py-1 rounded-full">
              {loyaltyInfo.tier} Member
            </span>
          </div>
          <Progress value={(loyaltyInfo.points % 1000) / 10} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {1000 - (loyaltyInfo.points % 1000)} points until next tier
          </p>
        </div>

        <Tabs defaultValue="rewards">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rewards">
              <Star className="mr-2 h-4 w-4" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="history">
              <Calendar className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="referrals">
              <Users className="mr-2 h-4 w-4" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="promotions">
              <TrendingUp className="mr-2 h-4 w-4" />
              Promotions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle>Available Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reward</TableHead>
                      <TableHead>Points Required</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rewards.map((reward) => (
                      <TableRow key={reward.id}>
                        <TableCell>{reward.name}</TableCell>
                        <TableCell>{reward.pointsCost}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleRedeemReward(reward.id)} disabled={loyaltyInfo.points < reward.pointsCost}>
                            Redeem
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Points History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Points</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.action}</TableCell>
                        <TableCell>{entry.points}</TableCell>
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
                <CardTitle>Referral Program</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">You've made {loyaltyInfo.referrals} successful referrals. Keep inviting friends for more points!</p>
                <Button onClick={() => setShowReferralDialog(true)}>Refer a Friend</Button>

                <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Refer a Friend</DialogTitle>
                      <DialogDescription>
                        Enter your friend's email to send them an invitation. You'll receive points once they complete their first appointment.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReferral}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="referral-email" className="text-right">
                            Friend's Email
                          </Label>
                          <Input
                            id="referral-email"
                            value={referralEmail}
                            onChange={(e) => setReferralEmail(e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Send Referral</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promotions">
            <Card>
              <CardHeader>
                <CardTitle>Active Promotions</CardTitle>
              </CardHeader>
              <CardContent>
                {promotions.map((promo) => (
                  <div key={promo.id} className="mb-4 p-4 border rounded-lg">
                    <h4 className="font-semibold">{promo.name}</h4>
                    <p className="text-sm text-muted-foreground">{promo.description}</p>
                    <p className="text-sm mt-2">Ends on: {promo.endDate}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
        <Button variant="link" onClick={() => window.open('/loyalty-program-help', '_blank')}>
          Learn More About Our Loyalty Program
        </Button>
      </CardFooter>
    </Card>
  )
}
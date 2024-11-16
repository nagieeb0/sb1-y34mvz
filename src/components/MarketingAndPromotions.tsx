'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@/components/ui/chart'
import { supabase } from '@/lib/supabaseClient'

type Campaign = {
  id: string;
  name: string;
  goal: string;
  targetGroup: string;
  startDate: string;
  endDate: string;
  performance: number;
}

type Notification = {
  id: string;
  title: string;
  message: string;
  scheduledDate: string;
  type: 'reminder' | 'promotion' | 'health_tip';
}

type DiscountCode = {
  id: string;
  code: string;
  discount: number;
  service: string;
  usageCount: number;
}

type Referral = {
  id: string;
  referrerName: string;
  referredName: string;
  status: 'pending' | 'completed';
  reward: string;
}

export default function MarketingAndPromotions({ clinicId }: { clinicId: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({})
  const [newNotification, setNewNotification] = useState<Partial<Notification>>({})
  const [newDiscountCode, setNewDiscountCode] = useState<Partial<DiscountCode>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCampaigns()
    fetchNotifications()
    fetchDiscountCodes()
    fetchReferrals()
  }, [])

  const fetchCampaigns = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('clinicId', clinicId)

      if (error) throw error

      setCampaigns(data)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      toast({
        title: "Error",
        description: "Failed to fetch campaigns. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('clinicId', clinicId)

      if (error) throw error

      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast({
        title: "Error",
        description: "Failed to fetch notifications. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDiscountCodes = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('clinicId', clinicId)

      if (error) throw error

      setDiscountCodes(data)
    } catch (error) {
      console.error('Error fetching discount codes:', error)
      toast({
        title: "Error",
        description: "Failed to fetch discount codes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReferrals = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('clinicId', clinicId)

      if (error) throw error

      setReferrals(data)
    } catch (error) {
      console.error('Error fetching referrals:', error)
      toast({
        title: "Error",
        description: "Failed to fetch referrals. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCampaign = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert({ ...newCampaign, clinicId })
        .select()

      if (error) throw error

      setCampaigns([...campaigns, data[0]])
      setNewCampaign({})
      toast({
        title: "Campaign Created",
        description: "Your new campaign has been created successfully.",
      })
    } catch (error) {
      console.error('Error creating campaign:', error)
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateNotification = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({ ...newNotification, clinicId })
        .select()

      if (error) throw error

      setNotifications([...notifications, data[0]])
      setNewNotification({})
      toast({
        title: "Notification Created",
        description: "Your new notification has been created successfully.",
      })
    } catch (error) {
      console.error('Error creating notification:', error)
      toast({
        title: "Error",
        description: "Failed to create notification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateDiscountCode = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .insert({ ...newDiscountCode, clinicId, usageCount: 0 })
        .select()

      if (error) throw error

      setDiscountCodes([...discountCodes, data[0]])
      setNewDiscountCode({})
      toast({
        title: "Discount Code Created",
        description: "Your new discount code has been created successfully.",
      })
    } catch (error) {
      console.error('Error creating discount code:', error)
      toast({
        title: "Error",
        description: "Failed to create discount code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[1000px]">
      <CardHeader>
        <CardTitle>Marketing and Promotions</CardTitle>
        <CardDescription>Manage your clinic's marketing campaigns, notifications, and promotions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="campaigns">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="discounts">Discount Codes</TabsTrigger>
            <TabsTrigger value="referrals">Referral Program</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="campaignName">Campaign Name</Label>
                      <Input
                        id="campaignName"
                        value={newCampaign.name || ''}
                        onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="campaignGoal">Campaign Goal</Label>
                      <Input
                        id="campaignGoal"
                        value={newCampaign.goal || ''}
                        onChange={(e) => setNewCampaign({ ...newCampaign, goal: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="targetGroup">Target Group</Label>
                    <Input
                      id="targetGroup"
                      value={newCampaign.targetGroup || ''}
                      onChange={(e) => setNewCampaign({ ...newCampaign, targetGroup: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Campaign Duration</Label>
                    <DateRangePicker
                      date={{
                        from: newCampaign.startDate ? new Date(newCampaign.startDate) : undefined,
                        to: newCampaign.endDate ? new Date(newCampaign.endDate) : undefined
                      }}
                      setDate={(range) => setNewCampaign({
                        ...newCampaign,
                        startDate: range.from?.toISOString(),
                        endDate: range.to?.toISOString()
                      })}
                    />
                  </div>
                  <Button onClick={handleCreateCampaign} disabled={isLoading}>Create Campaign</Button>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Active Campaigns</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Goal</TableHead>
                        <TableHead>Target Group</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>{campaign.name}</TableCell>
                          <TableCell>{campaign.goal}</TableCell>
                          <TableCell>{campaign.targetGroup}</TableCell>
                          <TableCell>{`${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`}</TableCell>
                          <TableCell>{campaign.performance}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Campaign Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={campaigns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="performance" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Patient Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notificationTitle">Notification Title</Label>
                    <Input
                      id="notificationTitle"
                      value={newNotification.title || ''}
                      onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notificationMessage">Message</Label>
                    <Textarea
                      id="notificationMessage"
                      value={newNotification.message || ''}
                      onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notificationType">Type</Label>
                    <Select
                      value={newNotification.type}
                      onValueChange={(value: 'reminder' | 'promotion' | 'health_tip') => setNewNotification({ ...newNotification, type: value })}
                    >
                      <SelectTrigger id="notificationType">
                        <SelectValue placeholder="Select notification type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reminder">Appointment Reminder</SelectItem>
                        <SelectItem value="promotion">Promotion</SelectItem>
                        <SelectItem value="health_tip">Health Tip</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={newNotification.scheduledDate || ''}
                      onChange={(e) => setNewNotification({ ...newNotification, scheduledDate: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateNotification} disabled={isLoading}>Schedule Notification</Button>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Scheduled Notifications</h3>
                  <Table>
                
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Scheduled Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell>{notification.title}</TableCell>
                          <TableCell>{notification.type}</TableCell>
                          <TableCell>{new Date(notification.scheduledDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discounts">
            <Card>
              <CardHeader>
                <CardTitle>Discount Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discountCode">Discount Code</Label>
                      <Input
                        id="discountCode"
                        value={newDiscountCode.code || ''}
                        onChange={(e) => setNewDiscountCode({ ...newDiscountCode, code: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="discountAmount">Discount Amount (%)</Label>
                      <Input
                        id="discountAmount"
                        type="number"
                        value={newDiscountCode.discount || ''}
                        onChange={(e) => setNewDiscountCode({ ...newDiscountCode, discount: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="discountService">Applicable Service</Label>
                    <Input
                      id="discountService"
                      value={newDiscountCode.service || ''}
                      onChange={(e) => setNewDiscountCode({ ...newDiscountCode, service: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateDiscountCode} disabled={isLoading}>Create Discount Code</Button>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Active Discount Codes</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Usage Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {discountCodes.map((code) => (
                        <TableRow key={code.id}>
                          <TableCell>{code.code}</TableCell>
                          <TableCell>{code.discount}%</TableCell>
                          <TableCell>{code.service}</TableCell>
                          <TableCell>{code.usageCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <CardTitle>Referral Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Encourage your patients to refer friends and family. For each successful referral, the referrer will receive a reward.</p>
                  <div>
                    <Label htmlFor="referralReward">Referral Reward</Label>
                    <Input
                      id="referralReward"
                      placeholder="e.g., $20 off next appointment"
                    />
                  </div>
                  <Button>Update Referral Reward</Button>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Recent Referrals</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Referrer</TableHead>
                        <TableHead>Referred</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reward</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell>{referral.referrerName}</TableCell>
                          <TableCell>{referral.referredName}</TableCell>
                          <TableCell>{referral.status}</TableCell>
                          <TableCell>{referral.reward}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
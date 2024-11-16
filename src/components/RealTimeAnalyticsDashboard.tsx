'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Calendar, DollarSign, Users, Package, AlertTriangle, Clock } from 'lucide-react'

// Simulated real-time data (replace with actual Supabase real-time subscriptions in production)
const generateRandomData = () => ({
  appointments: {
    ongoing: Math.floor(Math.random() * 10),
    upcoming: Math.floor(Math.random() * 20),
    cancellations: Math.floor(Math.random() * 5),
    noShows: Math.floor(Math.random() * 3),
  },
  revenue: {
    total: Math.floor(Math.random() * 10000),
    byService: [
      { name: 'Cleaning', value: Math.floor(Math.random() * 3000) },
      { name: 'Fillings', value: Math.floor(Math.random() * 2000) },
      { name: 'Root Canal', value: Math.floor(Math.random() * 1500) },
      { name: 'Orthodontics', value: Math.floor(Math.random() * 3500) },
    ],
    outstandingBalance: Math.floor(Math.random() * 5000),
  },
  engagement: {
    feedbackSubmissions: Math.floor(Math.random() * 50),
    referrals: Math.floor(Math.random() * 10),
    followUpAdherence: Math.floor(Math.random() * 100),
    loyaltyParticipation: Math.floor(Math.random() * 100),
  },
  inventory: [
    { item: 'Dental Floss', stock: Math.floor(Math.random() * 100), reorderPoint: 20 },
    { item: 'Toothbrushes', stock: Math.floor(Math.random() * 200), reorderPoint: 50 },
    { item: 'Latex Gloves', stock: Math.floor(Math.random() * 1000), reorderPoint: 200 },
    { item: 'Fluoride Gel', stock: Math.floor(Math.random() * 50), reorderPoint: 10 },
  ],
})

export default function RealTimeAnalyticsDashboard({ clinicId }: { clinicId: string }) {
  const [data, setData] = useState(generateRandomData())
  const [timeFrame, setTimeFrame] = useState('today')

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(generateRandomData())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleRefreshData = () => {
    setData(generateRandomData())
  }

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Clock className="mr-2 h-6 w-6" />
          Real-Time Analytics Dashboard
        </CardTitle>
        <CardDescription>Monitor key performance metrics in real-time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex justify-between items-center">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefreshData}>Refresh Data</Button>
        </div>

        <Tabs defaultValue="appointments">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="revenue">
              <DollarSign className="mr-2 h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="engagement">
              <Users className="mr-2 h-4 w-4" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Package className="mr-2 h-4 w-4" />
              Inventory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Live Appointment Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Current Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Ongoing:</span>
                          <span className="font-bold">{data.appointments.ongoing}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Upcoming:</span>
                          <span className="font-bold">{data.appointments.upcoming}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cancellations:</span>
                          <span className="font-bold">{data.appointments.cancellations}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>No-shows:</span>
                          <span className="font-bold">{data.appointments.noShows}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Peak Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={[
                          { hour: '9AM', appointments: 5 },
                          { hour: '10AM', appointments: 8 },
                          { hour: '11AM', appointments: 10 },
                          { hour: '12PM', appointments: 7 },
                          { hour: '1PM', appointments: 6 },
                          { hour: '2PM', appointments: 9 },
                          { hour: '3PM', appointments: 11 },
                          { hour: '4PM', appointments: 8 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="appointments" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue and Financial Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={data.revenue.byService}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Total Revenue:</span>
                          <span className="font-bold">${data.revenue.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Outstanding Balance:</span>
                          <span className="font-bold">${data.revenue.outstandingBalance.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Patient Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Engagement Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Feedback Submissions:</span>
                            <span>{data.engagement.feedbackSubmissions}</span>
                          </div>
                          <Progress value={data.engagement.feedbackSubmissions} max={100} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Referrals:</span>
                            <span>{data.engagement.referrals}</span>
                          </div>
                          <Progress value={data.engagement.referrals} max={20} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Loyalty and Follow-up</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Follow-up Adherence:</span>
                            <span>{data.engagement.followUpAdherence}%</span>
                          </div>
                          <Progress value={data.engagement.followUpAdherence} max={100} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span>Loyalty Program Participation:</span>
                            <span>{data.engagement.loyaltyParticipation}%</span>
                          </div>
                          <Progress value={data.engagement.loyaltyParticipation} max={100} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Reorder Point</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.inventory.map((item) => (
                      <TableRow key={item.item}>
                        <TableCell>{item.item}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.reorderPoint}</TableCell>
                        <TableCell>
                          {item.stock <= item.reorderPoint ? (
                            <Alert variant="destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Low Stock</AlertTitle>
                              <AlertDescription>
                                Reorder {item.item} soon.
                              </AlertDescription>
                            </Alert>
                          ) : (
                            <span className="text-green-500">Adequate</span>
                          )}
                        </TableCell>
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
          Reset Dashboard
        </Button>
        <Button variant="link" onClick={() => window.open('/analytics-help', '_blank')}>
          Learn More About Real-Time Analytics
        </Button>
      </CardFooter>
    </Card>
  )
}
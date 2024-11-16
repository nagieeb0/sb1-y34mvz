'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Users, DollarSign, Calendar, Package, UserMinus, TrendingUp } from 'lucide-react'

// Simulated data (replace with actual Supabase queries and ML predictions in production)
const patientFlowData = [
  { month: 'Jan', patients: 120, predicted: 125 },
  { month: 'Feb', patients: 130, predicted: 135 },
  { month: 'Mar', patients: 140, predicted: 145 },
  { month: 'Apr', patients: 150, predicted: 155 },
  { month: 'May', patients: 160, predicted: 165 },
  { month: 'Jun', patients: 170, predicted: 175 },
]

const revenueData = [
  { month: 'Jan', actual: 50000, predicted: 52000 },
  { month: 'Feb', actual: 55000, predicted: 57000 },
  { month: 'Mar', actual: 60000, predicted: 62000 },
  { month: 'Apr', actual: 65000, predicted: 67000 },
  { month: 'May', actual: 70000, predicted: 72000 },
  { month: 'Jun', actual: 75000, predicted: 77000 },
]

const serviceDemandData = [
  { name: 'Cleaning', value: 400 },
  { name: 'Fillings', value: 300 },
  { name: 'Root Canal', value: 200 },
  { name: 'Orthodontics', value: 100 },
  { name: 'Whitening', value: 150 },
]

const inventoryPredictions = [
  { item: 'Dental Floss', currentStock: 500, predictedNeed: 600, reorderSuggestion: 'Reorder Soon' },
  { item: 'Toothbrushes', currentStock: 200, predictedNeed: 250, reorderSuggestion: 'Reorder Now' },
  { item: 'Latex Gloves', currentStock: 1000, predictedNeed: 900, reorderSuggestion: 'Adequate Stock' },
  { item: 'Fluoride Gel', currentStock: 50, predictedNeed: 75, reorderSuggestion: 'Reorder Immediately' },
]

const patientRetentionData = [
  { factor: 'Regular Check-ups', impact: 80 },
  { factor: 'Treatment Completion', impact: 70 },
  { factor: 'Positive Reviews', impact: 60 },
  { factor: 'Personalized Follow-ups', impact: 50 },
  { factor: 'Loyalty Programs', impact: 40 },
]

export default function AdvancedAnalytics({ clinicId }: { clinicId: string }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months')

  useEffect(() => {
    // In a real application, fetch analytics data from Supabase here
  }, [clinicId, selectedTimeframe])

  const handleRefreshData = () => {
    // Simulate refreshing data
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated with the latest information.",
    })
  }

  return (
    <Card className="w-[1200px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-6 w-6" />
          Advanced Analytics and Predictive Insights
        </CardTitle>
        <CardDescription>Leverage data-driven insights to optimize your clinic's performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex justify-between items-center">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefreshData}>Refresh Data</Button>
        </div>

        <Tabs defaultValue="patient-flow">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="patient-flow">
              <Users className="mr-2 h-4 w-4" />
              Patient Flow
            </TabsTrigger>
            <TabsTrigger value="revenue">
              <DollarSign className="mr-2 h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="service-demand">
              <Calendar className="mr-2 h-4 w-4" />
              Service Demand
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Package className="mr-2 h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="retention">
              <UserMinus className="mr-2 h-4 w-4" />
              Retention
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient-flow">
            <Card>
              <CardHeader>
                <CardTitle>Patient Flow Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={patientFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="patients" stroke="#8884d8" name="Actual Patients" />
                    <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Predicted Patients" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold">Insights:</h4>
                  <ul className="list-disc list-inside text-sm">
                    <li>Patient flow is expected to increase by 5% next month.</li>
                    <li>Consider increasing staff during peak hours (10 AM - 2 PM).</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actual" fill="#8884d8" name="Actual Revenue" />
                    <Bar dataKey="predicted" fill="#82ca9d" name="Predicted Revenue" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold">Insights:</h4>
                  <ul className="list-disc list-inside text-sm">
                    <li>Revenue is projected to grow by 7% in the next quarter.</li>
                    <li>Orthodontics services are expected to be the highest revenue generator.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service-demand">
            <Card>
              <CardHeader>
                <CardTitle>Service Demand Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={serviceDemandData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold">Insights:</h4>
                  <ul className="list-disc list-inside text-sm">
                    <li>Cleaning services are in highest demand, followed by fillings.</li>
                    <li>Consider running a promotion for orthodontics to boost demand.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Predictive Inventory Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Predicted Need</TableHead>
                      <TableHead>Reorder Suggestion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryPredictions.map((item) => (
                      <TableRow key={item.item}>
                        <TableCell>{item.item}</TableCell>
                        <TableCell>{item.currentStock}</TableCell>
                        <TableCell>{item.predictedNeed}</TableCell>
                        <TableCell>{item.reorderSuggestion}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold">Insights:</h4>
                  <ul className="list-disc list-inside text-sm">
                    <li>Fluoride Gel stock is critically low. Reorder immediately.</li>
                    <li>Dental Floss usage is increasing. Consider bulk ordering for cost savings.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="retention">
            <Card>
              <CardHeader>
                <CardTitle>Patient Retention and Attrition Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={patientRetentionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="factor" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="impact" fill="#8884d8" name="Impact on Retention" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold">Insights:</h4>
                  <ul className="list-disc list-inside text-sm">
                    <li>Regular check-ups have the highest impact on patient retention.</li>
                    <li>Implement a loyalty program to improve retention rates.</li>
                    <li>Focus on personalized follow-ups for patients who haven't visited in 6+ months.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset Analytics
        </Button>
        <Button variant="link" onClick={() => window.open('/analytics-help', '_blank')}>
          Learn More About Advanced Analytics
        </Button>
      </CardFooter>
    </Card>
  )
}
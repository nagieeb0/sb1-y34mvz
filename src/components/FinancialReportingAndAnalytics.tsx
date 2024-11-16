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
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DollarSign, TrendingUp, PieChart as PieChartIcon, BarChart2, Calendar, Download } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const revenueData = [
  { month: 'Jan', revenue: 50000, expenses: 30000 },
  { month: 'Feb', revenue: 55000, expenses: 32000 },
  { month: 'Mar', revenue: 60000, expenses: 35000 },
  { month: 'Apr', revenue: 58000, expenses: 33000 },
  { month: 'May', revenue: 62000, expenses: 36000 },
  { month: 'Jun', revenue: 65000, expenses: 38000 },
]

const profitMarginData = [
  { service: 'Dental Cleaning', margin: 70 },
  { service: 'Fillings', margin: 65 },
  { service: 'Root Canal', margin: 55 },
  { service: 'Crowns', margin: 60 },
  { service: 'Orthodontics', margin: 75 },
]

const paymentMethodData = [
  { method: 'Cash', value: 20 },
  { method: 'Credit Card', value: 35 },
  { method: 'Insurance', value: 40 },
  { method: 'Payment Plan', value: 5 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function FinancialReportingAndAnalytics({ clinicId }: { clinicId: string }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('last6months')
  const [showExportDialog, setShowExportDialog] = useState(false)

  useEffect(() => {
    // In a real application, fetch financial data from Supabase here based on clinicId and dateRange
  }, [clinicId, dateRange])

  const handleDateRangeChange = (range: string) => {
    setDateRange(range)
    // In a real application, fetch new data based on the selected date range
  }

  const handleExportReport = (format: 'pdf' | 'excel') => {
    // In a real application, generate and download the report in the specified format
    toast({
      title: "Report Exported",
      description: `Your financial report has been exported in ${format.toUpperCase()} format.`,
    })
    setShowExportDialog(false)
  }

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <DollarSign className="mr-2 h-6 w-6" />
          Financial Reporting and Analytics
        </CardTitle>
        <CardDescription>Comprehensive insights into your clinic's financial health</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last3months">Last 3 Months</SelectItem>
              <SelectItem value="last6months">Last 6 Months</SelectItem>
              <SelectItem value="lastyear">Last Year</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowExportDialog(true)}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <TrendingUp className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="revenue-expenses">
              <BarChart2 className="mr-2 h-4 w-4" />
              Revenue & Expenses
            </TabsTrigger>
            <TabsTrigger value="profit-margins">
              <PieChartIcon className="mr-2 h-4 w-4" />
              Profit Margins
            </TabsTrigger>
            <TabsTrigger value="cash-flow">
              <Calendar className="mr-2 h-4 w-4" />
              Cash Flow
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">${revenueData.reduce((sum, data) => sum + data.revenue, 0).toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">${revenueData.reduce((sum, data) => sum + data.expenses, 0).toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Net Profit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">${(revenueData.reduce((sum, data) => sum + data.revenue, 0) - revenueData.reduce((sum, data) => sum + data.expenses, 0)).toLocaleString()}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Average Profit Margin</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold">{(profitMarginData.reduce((sum, data) => sum + data.margin, 0) / profitMarginData.length).toFixed(2)}%</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue-expenses">
            <Card>
              <CardHeader>
                <CardTitle>Revenue and Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                      <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Expenses</TableHead>
                      <TableHead>Net Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revenueData.map((data) => (
                      <TableRow key={data.month}>
                        <TableCell>{data.month}</TableCell>
                        <TableCell>${data.revenue.toLocaleString()}</TableCell>
                        <TableCell>${data.expenses.toLocaleString()}</TableCell>
                        <TableCell>${(data.revenue - data.expenses).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profit-margins">
            <Card>
              <CardHeader>
                <CardTitle>Profit Margins by Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={profitMarginData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="service" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="margin" fill="#8884d8" name="Profit Margin (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <Table className="mt-4">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Profit Margin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitMarginData.map((data) => (
                      <TableRow key={data.service}>
                        <TableCell>{data.service}</TableCell>
                        <TableCell>{data.margin}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cash-flow">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Projected Revenue" />
                      <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Projected Expenses" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Methods Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <div className="h-[300px] w-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={paymentMethodData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {paymentMethodData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
        <Button variant="link" onClick={() => window.open('/financial-analytics-help', '_blank')}>
          Learn More About Financial Analytics
        </Button>
      </CardFooter>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Export Financial Report</DialogTitle>
            <DialogDescription>
              Choose the format for your exported financial report.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={() => handleExportReport('pdf')}>Export as PDF</Button>
            <Button onClick={() => handleExportReport('excel')}>Export as Excel</Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
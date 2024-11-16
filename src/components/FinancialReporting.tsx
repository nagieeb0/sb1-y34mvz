'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { supabase } from '@/lib/supabaseClient'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@/components/ui/chart'
import { Download, TrendingUp, TrendingDown } from 'lucide-react'

type FinancialData = {
  date: string;
  service: string;
  revenue: number;
  cost: number;
}

type ServiceSummary = {
  service: string;
  totalRevenue: number;
  totalCost: number;
  profitMargin: number;
  frequency: number;
}

export default function FinancialReporting({ clinicId }: { clinicId: string }) {
  const [financialData, setFinancialData] = useState<FinancialData[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  })
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('monthly')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchFinancialData()
  }, [dateRange, reportType])

  const fetchFinancialData = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('clinic_id', clinicId)
        .gte('date', dateRange.from.toISOString())
        .lte('date', dateRange.to.toISOString())

      if (error) throw error

      setFinancialData(data)
    } catch (error) {
      console.error('Error fetching financial data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch financial data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateServiceSummaries = (): ServiceSummary[] => {
    const summaries: { [key: string]: ServiceSummary } = {}

    financialData.forEach(transaction => {
      if (!summaries[transaction.service]) {
        summaries[transaction.service] = {
          service: transaction.service,
          totalRevenue: 0,
          totalCost: 0,
          profitMargin: 0,
          frequency: 0
        }
      }

      summaries[transaction.service].totalRevenue += transaction.revenue
      summaries[transaction.service].totalCost += transaction.cost
      summaries[transaction.service].frequency += 1
    })

    return Object.values(summaries).map(summary => ({
      ...summary,
      profitMargin: ((summary.totalRevenue - summary.totalCost) / summary.totalRevenue) * 100
    })).sort((a, b) => b.totalRevenue - a.totalRevenue)
  }

  const serviceSummaries = calculateServiceSummaries()

  const totalRevenue = serviceSummaries.reduce((sum, service) => sum + service.totalRevenue, 0)
  const totalProfit = serviceSummaries.reduce((sum, service) => sum + service.totalRevenue - service.totalCost, 0)
  const overallProfitMargin = (totalProfit / totalRevenue) * 100

  const handleExport = (format: 'pdf' | 'excel') => {
    // Simulated export functionality
    toast({
      title: "Export Initiated",
      description: `Exporting financial report as ${format.toUpperCase()}. This feature is simulated.`,
    })
  }

  return (
    <Card className="w-[1000px]">
      <CardHeader>
        <CardTitle>Financial Reporting</CardTitle>
        <CardDescription>View and analyze your clinic's financial performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
            <Select value={reportType} onValueChange={(value: 'weekly' | 'monthly') => setReportType(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly Report</SelectItem>
                <SelectItem value="monthly">Monthly Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalProfit.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Profit Margin</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallProfitMargin.toFixed(2)}%</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Service Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceSummaries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="totalRevenue" fill="#8884d8" name="Revenue" />
                <Bar yAxisId="right" dataKey="frequency" fill="#82ca9d" name="Frequency" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Service Details</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Profit Margin</TableHead>
                  <TableHead>Frequency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceSummaries.map((summary) => (
                  <TableRow key={summary.service}>
                    <TableCell>{summary.service}</TableCell>
                    <TableCell>${summary.totalRevenue.toFixed(2)}</TableCell>
                    <TableCell>${summary.totalCost.toFixed(2)}</TableCell>
                    <TableCell>{summary.profitMargin.toFixed(2)}%</TableCell>
                    <TableCell>{summary.frequency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button onClick={() => handleExport('pdf')}>
          <Download className="mr-2 h-4 w-4" /> Export as PDF
        </Button>
        <Button onClick={() => handleExport('excel')}>
          <Download className="mr-2 h-4 w-4" /> Export as Excel
        </Button>
      </CardFooter>
    </Card>
  )
}
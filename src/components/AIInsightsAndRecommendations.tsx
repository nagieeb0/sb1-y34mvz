'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@/components/ui/chart'
import { Users, TrendingUp, Calendar, Package, DollarSign, Brain } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type Insight = {
  id: string
  category: 'patient' | 'service' | 'scheduling' | 'inventory' | 'financial'
  title: string
  description: string
  recommendation: string
  impact: 'high' | 'medium' | 'low'
  createdAt: string
}

type ChartData = {
  [key: string]: number | string
}

export default function AIInsightsAndRecommendations({ clinicId }: { clinicId: string }) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Insight['category']>('patient')
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchInsights()
    fetchChartData()
  }, [selectedCategory])

  const fetchInsights = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('clinic_id', clinicId)
        .eq('category', selectedCategory)
        .order('created_at', { ascending: false })

      if (error) throw error

      setInsights(data)
    } catch (error) {
      console.error('Error fetching insights:', error)
      toast({
        title: "Error",
        description: "Failed to fetch AI insights. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchChartData = async () => {
    setIsLoading(true)
    try {
      // In a real application, you would fetch this data from Supabase
      // Here, we're simulating the data for demonstration purposes
      const data = generateMockChartData(selectedCategory)
      setChartData(data)
    } catch (error) {
      console.error('Error fetching chart data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch chart data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockChartData = (category: Insight['category']): ChartData[] => {
    switch (category) {
      case 'patient':
        return [
          { age: '0-18', count: 120 },
          { age: '19-35', count: 250 },
          { age: '36-50', count: 180 },
          { age: '51-65', count: 150 },
          { age: '65+', count: 100 },
        ]
      case 'service':
        return [
          { service: 'Cleaning', revenue: 5000 },
          { service: 'Fillings', revenue: 7500 },
          { service: 'Root Canal', revenue: 10000 },
          { service: 'Crowns', revenue: 12000 },
          { service: 'Orthodontics', revenue: 15000 },
        ]
      case 'scheduling':
        return [
          { day: 'Mon', appointments: 25 },
          { day: 'Tue', appointments: 30 },
          { day: 'Wed', appointments: 28 },
          { day: 'Thu', appointments: 35 },
          { day: 'Fri', appointments: 32 },
        ]
      case 'inventory':
        return [
          { item: 'Gloves', stock: 500 },
          { item: 'Masks', stock: 300 },
          { item: 'Syringes', stock: 200 },
          { item: 'Anesthetic', stock: 150 },
          { item: 'Dental Floss', stock: 400 },
        ]
      case 'financial':
        return [
          { month: 'Jan', revenue: 50000 },
          { month: 'Feb', revenue: 55000 },
          { month: 'Mar', revenue: 60000 },
          { month: 'Apr', revenue: 58000 },
          { month: 'May', revenue: 62000 },
        ]
      default:
        return []
    }
  }

  const renderChart = () => {
    switch (selectedCategory) {
      case 'patient':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="age"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )
      case 'service':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="service" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'scheduling':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="appointments" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        )
      case 'inventory':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="item" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'financial':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  return (
    <Card className="w-[1000px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-6 w-6" />
          AI-Powered Insights and Recommendations
        </CardTitle>
        <CardDescription>Data-driven suggestions to optimize your clinic's operations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Insight['category'])}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="patient">
              <Users className="mr-2 h-4 w-4" />
              Patient
            </TabsTrigger>
            <TabsTrigger value="service">
              <TrendingUp className="mr-2 h-4 w-4" />
              Service
            </TabsTrigger>
            <TabsTrigger value="scheduling">
              <Calendar className="mr-2 h-4 w-4" />
              Scheduling
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Package className="mr-2 h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="financial">
              <DollarSign className="mr-2 h-4 w-4" />
              Financial
            </TabsTrigger>
          </TabsList>
          <TabsContent value={selectedCategory}>
            <div className="mt-4 space-y-4">
              {renderChart()}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Insight</TableHead>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {insights.map((insight) => (
                    <TableRow key={insight.id}>
                      <TableCell>
                        <div className="font-medium">{insight.title}</div>
                        <div className="text-sm text-muted-foreground">{insight.description}</div>
                      </TableCell>
                      <TableCell>{insight.recommendation}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                          insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={fetchInsights}>
          Refresh Insights
        </Button>
        <Button variant="link" onClick={() => window.open('/ai-insights-help', '_blank')}>
          Learn more about AI Insights
        </Button>
      </CardFooter>
    </Card>
  )
}
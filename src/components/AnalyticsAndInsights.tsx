'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabaseClient'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@/components/ui/chart'
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { format, subMonths } from 'date-fns'

type AnalyticsData = {
  patientDemographics: {
    ageGroups: { [key: string]: number },
    genderDistribution: { [key: string]: number },
    averageDistance: number
  },
  serviceUsage: { [key: string]: number },
  appointmentPatterns: { [key: string]: number },
  revenueInsights: {
    byService: { [key: string]: number },
    monthlyTrend: { [key: string]: number }
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AnalyticsAndInsights({ clinicId }: { clinicId: string }) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 6),
    to: new Date()
  })
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange, selectedService])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    try {
      // In a real application, you would fetch this data from Supabase
      // Here, we're simulating the data for demonstration purposes
      const { data, error } = await supabase.rpc('get_analytics_data', {
        clinic_id: clinicId,
        start_date: dateRange.from.toISOString(),
        end_date: dateRange.to.toISOString(),
        service: selectedService
      })

      if (error) throw error

      setAnalyticsData(data)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch analytics data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!analyticsData) {
    return <div>Loading analytics data...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>DentEase Analytics Dashboard</CardTitle>
          <CardDescription>Gain insights into your clinic's performance and patient trends.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
            <Select value={selectedService || ''} onValueChange={setSelectedService}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Services</SelectItem>
                {Object.keys(analyticsData.serviceUsage).map((service) => (
                  <SelectItem key={service} value={service}>{service}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(analyticsData.patientDemographics.ageGroups).map(([key, value]) => ({ name: key, value }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {Object.entries(analyticsData.patientDemographics.ageGroups).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4">
                  <p>Average patient distance: {analyticsData.patientDemographics.averageDistance.toFixed(2)} km</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(analyticsData.serviceUsage).map(([key, value]) => ({ name: key, value }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={Object.entries(analyticsData.appointmentPatterns).map(([key, value]) => ({ name: key, value }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(analyticsData.revenueInsights.byService).map(([key, value]) => ({ name: key, value }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={Object.entries(analyticsData.revenueInsights.monthlyTrend).map(([key, value]) => ({ name: key, value }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
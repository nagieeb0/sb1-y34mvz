'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from '@/components/ui/chart'
import { Download, Calendar, DollarSign, Users, Star } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { format, subMonths } from 'date-fns'

type ReportType = 'appointments' | 'finances' | 'demographics' | 'feedback'
type ExportFormat = 'pdf' | 'excel'

type AppointmentData = {
  total: number
  cancellations: number
  noShows: number
  byDay: { [key: string]: number }
}

type FinancialData = {
  totalRevenue: number
  byService: { [key: string]: number }
  monthlyTotals: { [key: string]: number }
  averagePerAppointment: number
}

type DemographicData = {
  ageRanges: { [key: string]: number }
  genderDistribution: { [key: string]: number }
  locationDistribution: { [key: string]: number }
}

type FeedbackData = {
  averageRating: number
  ratingDistribution: { [key: string]: number }
  commonThemes: { [key: string]: number }
}

export default function DataExportAndReporting({ clinicId }: { clinicId: string }) {
  const [reportType, setReportType] = useState<ReportType>('appointments')
  const [dateRange, setDateRange] = useState({
    from: subMonths(new Date(), 1),
    to: new Date()
  })
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf')
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null)
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [demographicData, setDemographicData] = useState<DemographicData | null>(null)
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchReportData()
  }, [reportType, dateRange])

  const fetchReportData = async () => {
    setIsLoading(true)
    try {
      let data
      switch (reportType) {
        case 'appointments':
          data = await fetchAppointmentData()
          setAppointmentData(data)
          break
        case 'finances':
          data = await fetchFinancialData()
          setFinancialData(data)
          break
        case 'demographics':
          data = await fetchDemographicData()
          setDemographicData(data)
          break
        case 'feedback':
          data = await fetchFeedbackData()
          setFeedbackData(data)
          break
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch report data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAppointmentData = async (): Promise<AppointmentData> => {
    // Simulated data fetch from Supabase
    // In a real application, you would query your Supabase database here
    return {
      total: 150,
      cancellations: 10,
      noShows: 5,
      byDay: {
        'Mon': 30,
        'Tue': 35,
        'Wed': 28,
        'Thu': 32,
        'Fri': 25
      }
    }
  }

  const fetchFinancialData = async (): Promise<FinancialData> => {
    // Simulated data fetch from Supabase
    return {
      totalRevenue: 50000,
      byService: {
        'Dental Cleaning': 15000,
        'Root Canal': 20000,
        'Tooth Extraction': 10000,
        'Orthodontics': 5000
      },
      monthlyTotals: {
        'Jan': 12000,
        'Feb': 13000,
        'Mar': 11000,
        'Apr': 14000
      },
      averagePerAppointment: 333.33
    }
  }

  const fetchDemographicData = async (): Promise<DemographicData> => {
    // Simulated data fetch from Supabase
    return {
      ageRanges: {
        '0-18': 20,
        '19-35': 30,
        '36-50': 25,
        '51-65': 15,
        '65+': 10
      },
      genderDistribution: {
        'Male': 48,
        'Female': 51,
        'Other': 1
      },
      locationDistribution: {
        'Urban': 60,
        'Suburban': 30,
        'Rural': 10
      }
    }
  }

  const fetchFeedbackData = async (): Promise<FeedbackData> => {
    // Simulated data fetch from Supabase
    return {
      averageRating: 4.2,
      ratingDistribution: {
        '1': 5,
        '2': 10,
        '3': 15,
        '4': 40,
        '5': 30
      },
      commonThemes: {
        'Friendly Staff': 50,
        'Short Wait Times': 30,
        'Clean Facility': 40,
        'Effective Treatment': 45,
        'Clear Communication': 35
      }
    }
  }

  const handleExport = () => {
    // Simulated export functionality
    toast({
      title: "Export Initiated",
      description: `Exporting ${reportType} report as ${exportFormat.toUpperCase()}. Download will start shortly.`,
    })
    // In a real application, you would generate and trigger the download of the report here
  }

  const renderAppointmentReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{appointmentData?.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cancellations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{appointmentData?.cancellations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>No-Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{appointmentData?.noShows}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Appointments by Day</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(appointmentData?.byDay || {}).map(([day, count]) => ({ day, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${financialData?.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average per Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${financialData?.averagePerAppointment.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Service</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(financialData?.byService || {}).map(([service, amount]) => ({ name: service, value: amount }))}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {Object.entries(financialData?.byService || {}).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={Object.entries(financialData?.monthlyTotals || {}).map(([month, total]) => ({ month, total }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )

  const renderDemographicReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(demographicData?.ageRanges || {}).map(([range, count]) => ({ name: range, value: count }))}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {Object.entries(demographicData?.ageRanges || {}).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={Object.entries(demographicData?.genderDistribution || {}).map(([gender, count]) => ({ name: gender, value: count }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {Object.entries(demographicData?.genderDistribution || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 120}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Location Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={Object.entries(demographicData?.locationDistribution || {}).map(([location, count]) => ({ name: location, value: count }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {Object.entries(demographicData?.locationDistribution || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 120}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderFeedbackReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-yellow-400 fill-current" />
            <span className="text-3xl  font-bold">{feedbackData?.averageRating.toFixed(1)}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(feedbackData?.ratingDistribution || {}).map(([rating, count]) => ({ rating, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Common Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={Object.entries(feedbackData?.commonThemes || {}).map(([theme, count]) => ({ theme, count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="theme" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Card className="w-[1000px]">
      <CardHeader>
        <CardTitle>Data Export and Reporting</CardTitle>
        <CardDescription>Generate and export reports for your clinic</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="finances">
              <DollarSign className="mr-2 h-4 w-4" />
              Finances
            </TabsTrigger>
            <TabsTrigger value="demographics">
              <Users className="mr-2 h-4 w-4" />
              Demographics
            </TabsTrigger>
            <TabsTrigger value="feedback">
              <Star className="mr-2 h-4 w-4" />
              Feedback
            </TabsTrigger>
          </TabsList>
          <div className="mt-4 flex justify-between items-center">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
            <div className="flex items-center space-x-2">
              <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Export as" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          <TabsContent value="appointments">
            {isLoading ? <div>Loading...</div> : renderAppointmentReport()}
          </TabsContent>
          <TabsContent value="finances">
            {isLoading ? <div>Loading...</div> : renderFinancialReport()}
          </TabsContent>
          <TabsContent value="demographics">
            {isLoading ? <div>Loading...</div> : renderDemographicReport()}
          </TabsContent>
          <TabsContent value="feedback">
            {isLoading ? <div>Loading...</div> : renderFeedbackReport()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
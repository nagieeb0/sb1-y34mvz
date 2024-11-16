'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, FileText, Lock, Trash2, Download, Search } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const auditLogs = [
  { id: '1', action: 'Appointment Scheduled', user: 'Dr. Smith', role: 'Dentist', date: '2023-07-15T10:30:00Z' },
  { id: '2', action: 'Patient Record Modified', user: 'Jane Doe', role: 'Receptionist', date: '2023-07-15T11:45:00Z' },
  { id: '3', action: 'Inventory Updated', user: 'John Admin', role: 'Administrator', date: '2023-07-15T14:20:00Z' },
  { id: '4', action: 'Prescription Issued', user: 'Dr. Johnson', role: 'Dentist', date: '2023-07-16T09:15:00Z' },
  { id: '5', action: 'Patient Record Accessed', user: 'Sarah Nurse', role: 'Nurse', date: '2023-07-16T10:00:00Z' },
]

const complianceMetrics = {
  appointmentVolume: 150,
  patientRecordAccesses: 75,
  prescriptionsIssued: 30,
}

const accessAlerts = [
  { id: '1', type: 'Unusual Access', description: 'Multiple failed login attempts', date: '2023-07-15T22:30:00Z' },
  { id: '2', type: 'After Hours Access', description: 'Patient records accessed outside business hours', date: '2023-07-16T03:15:00Z' },
]

const dataRetentionLogs = [
  { id: '1', action: 'Patient Record Deleted', user: 'John Admin', date: '2023-07-10T14:30:00Z', reason: 'Patient Request' },
  { id: '2', action: 'Old Records Archived', user: 'System', date: '2023-07-01T00:00:00Z', reason: 'Automated 7-year archival' },
]

export default function ComplianceAndAudit({ clinicId }: { clinicId: string }) {
  const [selectedDateRange, setSelectedDateRange] = useState('7days')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredLogs, setFilteredLogs] = useState(auditLogs)
  const [showExportDialog, setShowExportDialog] = useState(false)

  useEffect(() => {
    // In a real application, fetch audit logs and compliance data from Supabase here
    filterLogs()
  }, [searchTerm, selectedDateRange])

  const filterLogs = () => {
    const filtered = auditLogs.filter(log => 
      (log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
       log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
       log.role.toLowerCase().includes(searchTerm.toLowerCase())) &&
      new Date(log.date) > getDateRangeStart()
    )
    setFilteredLogs(filtered)
  }

  const getDateRangeStart = () => {
    const now = new Date()
    switch (selectedDateRange) {
      case '7days':
        return new Date(now.setDate(now.getDate() - 7))
      case '30days':
        return new Date(now.setDate(now.getDate() - 30))
      case '90days':
        return new Date(now.setDate(now.getDate() - 90))
      default:
        return new Date(0) // All time
    }
  }

  const handleExportReport = () => {
    // Simulate exporting a compliance report
    toast({
      title: "Report Exported",
      description: "The compliance report has been exported successfully.",
    })
    setShowExportDialog(false)
  }

  return (
    <Card className="w-[1000px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-6 w-6" />
          Compliance Reporting and Audit Trail
        </CardTitle>
        <CardDescription>Monitor system activity and generate compliance reports</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="audit-log">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="audit-log">Audit Log</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="access-control">Access Control</TabsTrigger>
            <TabsTrigger value="data-retention">Data Retention</TabsTrigger>
          </TabsList>

          <TabsContent value="audit-log">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Track all major actions taken within the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="date-range">Date Range:</Label>
                    <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                      <SelectTrigger id="date-range" className="w-[180px]">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="90days">Last 90 Days</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-[300px]"
                    />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.role}</TableCell>
                        <TableCell>{new Date(log.date).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Reporting</CardTitle>
                <CardDescription>Generate and view compliance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Appointment Volume
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{complianceMetrics.appointmentVolume}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Patient Record Accesses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{complianceMetrics.patientRecordAccesses}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Prescriptions Issued
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{complianceMetrics.prescriptionsIssued}</div>
                    </CardContent>
                  </Card>
                </div>
                <Button onClick={() => setShowExportDialog(true)}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Compliance Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access-control">
            <Card>
              <CardHeader>
                <CardTitle>Access Control Monitoring</CardTitle>
                <CardDescription>Monitor access to sensitive data and unusual patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alert Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>{alert.type}</TableCell>
                        <TableCell>{alert.description}</TableCell>
                        <TableCell>{new Date(alert.date).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-retention">
            <Card>
              <CardHeader>
                <CardTitle>Data Retention and Deletion Log</CardTitle>
                <CardDescription>Track data retention actions and deletions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataRetentionLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{new Date(log.date).toLocaleString()}</TableCell>
                        <TableCell>{log.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Compliance Report</DialogTitle>
            <DialogDescription>
              Select the date range and format for your compliance report.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="export-date-range" className="text-right">
                Date Range
              </Label>
              <Select defaultValue="30days">
                <SelectTrigger id="export-date-range" className="col-span-3">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="export-format" className="text-right">
                Format
              </Label>
              <Select defaultValue="pdf">
                <SelectTrigger id="export-format" className="col-span-3">
                  <SelectValue placeholder="Select export format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleExportReport}>Export Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
        <Button variant="link" onClick={() => window.open('/compliance-help', '_blank')}>
          Learn More About Compliance
        </Button>
      </CardFooter>
    </Card>
  )
}
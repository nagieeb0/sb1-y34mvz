'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Shield, Eye, Clock, Database, UserCheck, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type AccessLog = {
  id: string
  userId: string
  userName: string
  action: string
  timestamp: string
}

type DataRetentionPolicy = {
  patientRecords: number
  financialData: number
  operationalData: number
}

type BackupStatus = {
  lastBackup: string
  nextScheduledBackup: string
  backupFrequency: 'daily' | 'weekly' | 'monthly'
}

export default function ComplianceAndDataProtection({ clinicId }: { clinicId: string }) {
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([])
  const [privacyPolicyAcknowledged, setPrivacyPolicyAcknowledged] = useState(false)
  const [dataRetentionPolicy, setDataRetentionPolicy] = useState<DataRetentionPolicy>({
    patientRecords: 7,
    financialData: 10,
    operationalData: 5
  })
  const [backupStatus, setBackupStatus] = useState<BackupStatus>({
    lastBackup: '2023-06-01 08:00:00',
    nextScheduledBackup: '2023-06-02 08:00:00',
    backupFrequency: 'daily'
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchAccessLogs()
    fetchPrivacyPolicyStatus()
    fetchDataRetentionPolicy()
    fetchBackupStatus()
  }, [])

  const fetchAccessLogs = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('access_logs')
        .select('*')
        .eq('clinic_id', clinicId)
        .order('timestamp', { ascending: false })
        .limit(50)

      if (error) throw error

      setAccessLogs(data)
    } catch (error) {
      console.error('Error fetching access logs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch access logs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPrivacyPolicyStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('privacy_policy_acknowledgments')
        .select('acknowledged')
        .eq('clinic_id', clinicId)
        .single()

      if (error) throw error

      setPrivacyPolicyAcknowledged(data.acknowledged)
    } catch (error) {
      console.error('Error fetching privacy policy status:', error)
    }
  }

  const fetchDataRetentionPolicy = async () => {
    try {
      const { data, error } = await supabase
        .from('data_retention_policies')
        .select('*')
        .eq('clinic_id', clinicId)
        .single()

      if (error) throw error

      setDataRetentionPolicy(data)
    } catch (error) {
      console.error('Error fetching data retention policy:', error)
    }
  }

  const fetchBackupStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('backup_status')
        .select('*')
        .eq('clinic_id', clinicId)
        .single()

      if (error) throw error

      setBackupStatus(data)
    } catch (error) {
      console.error('Error fetching backup status:', error)
    }
  }

  const handlePrivacyPolicyAcknowledgment = async () => {
    try {
      const { error } = await supabase
        .from('privacy_policy_acknowledgments')
        .upsert({ clinic_id: clinicId, acknowledged: true })

      if (error) throw error

      setPrivacyPolicyAcknowledged(true)
      toast({
        title: "Privacy Policy Acknowledged",
        description: "Thank you for acknowledging our privacy policy.",
      })
    } catch (error) {
      console.error('Error acknowledging privacy policy:', error)
      toast({
        title: "Error",
        description: "Failed to acknowledge privacy policy. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDataRetentionPolicyChange = async (field: keyof DataRetentionPolicy, value: number) => {
    try {
      const updatedPolicy = { ...dataRetentionPolicy, [field]: value }
      const { error } = await supabase
        .from('data_retention_policies')
        .upsert({ clinic_id: clinicId, ...updatedPolicy })

      if (error) throw error

      setDataRetentionPolicy(updatedPolicy)
      toast({
        title: "Data Retention Policy Updated",
        description: "Your data retention policy has been successfully updated.",
      })
    } catch (error) {
      console.error('Error updating data retention policy:', error)
      toast({
        title: "Error",
        description: "Failed to update data retention policy. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBackupFrequencyChange = async (frequency: BackupStatus['backupFrequency']) => {
    try {
      const { error } = await supabase
        .from('backup_status')
        .update({ backup_frequency: frequency })
        .eq('clinic_id', clinicId)

      if (error) throw error

      setBackupStatus({ ...backupStatus, backupFrequency: frequency })
      toast({
        title: "Backup Frequency Updated",
        description: `Your backup frequency has been set to ${frequency}.`,
      })
    } catch (error) {
      console.error('Error updating backup frequency:', error)
      toast({
        title: "Error",
        description: "Failed to update backup frequency. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDataRecovery = async () => {
    // In a real application, this would trigger a data recovery process
    toast({
      title: "Data Recovery Initiated",
      description: "Your data recovery process has been initiated. This may take some time.",
    })
  }

  return (
    <Card className="w-[1000px]">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-6 w-6" />
          Compliance and Data Protection
        </CardTitle>
        <CardDescription>Manage your clinic's data protection and compliance settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="access-logs">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="access-logs">
              <Eye className="mr-2 h-4 w-4" />
              Access Logs
            </TabsTrigger>
            <TabsTrigger value="privacy-policy">
              <FileText className="mr-2 h-4 w-4" />
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="data-retention">
              <Clock className="mr-2 h-4 w-4" />
              Data Retention
            </TabsTrigger>
            <TabsTrigger value="backups">
              <Database className="mr-2 h-4 w-4" />
              Backups
            </TabsTrigger>
            <TabsTrigger value="user-rights">
              <UserCheck className="mr-2 h-4 w-4" />
              User Rights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="access-logs">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.userName}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="privacy-policy">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="privacy-policy"
                  checked={privacyPolicyAcknowledged}
                  onCheckedChange={handlePrivacyPolicyAcknowledgment}
                />
                <Label htmlFor="privacy-policy">I acknowledge that I have read and agree to the privacy policy</Label>
              </div>
              <Button onClick={() => window.open('/privacy-policy', '_blank')}>View Privacy Policy</Button>
            </div>
          </TabsContent>

          <TabsContent value="data-retention">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-records">Patient Records Retention (years)</Label>
                  <Input
                    id="patient-records"
                    type="number"
                    value={dataRetentionPolicy.patientRecords}
                    onChange={(e) => handleDataRetentionPolicyChange('patientRecords', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="financial-data">Financial Data Retention (years)</Label>
                  <Input
                    id="financial-data"
                    type="number"
                    value={dataRetentionPolicy.financialData}
                    onChange={(e) => handleDataRetentionPolicyChange('financialData', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="operational-data">Operational Data Retention (years)</Label>
                <Input
                  id="operational-data"
                  type="number"
                  value={dataRetentionPolicy.operationalData}
                  onChange={(e) => handleDataRetentionPolicyChange('operationalData', parseInt(e.target.value))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="backups">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Last Backup</p>
                  <p>{new Date(backupStatus.lastBackup).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium">Next Scheduled Backup</p>
                  <p>{new Date(backupStatus.nextScheduledBackup).toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select
                  value={backupStatus.backupFrequency}
                  onValueChange={(value: BackupStatus['backupFrequency']) => handleBackupFrequencyChange(value)}
                >
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select backup frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleDataRecovery}>Initiate Data Recovery</Button>
            </div>
          </TabsContent>

          <TabsContent value="user-rights">
            <div className="space-y-4">
              <p>Patients can request access to their records or request data deletion. Use the buttons below to manage these requests.</p>
              <div className="flex space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Data Access Requests</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Data Access Requests</DialogTitle>
                      <DialogDescription>
                        Review and manage patient requests for data access.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>No pending data access requests.</p>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Data Deletion Requests</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Data Deletion Requests</DialogTitle>
                      <DialogDescription>
                        Review and manage patient requests for data deletion.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>No pending data deletion requests.</p>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={fetchAccessLogs}>
          Refresh Data
        </Button>
        <Button  variant="link" onClick={() => window.open('/compliance-help', '_blank')}>
          Learn more about compliance
        </Button>
      </CardFooter>
    </Card>
  )
}
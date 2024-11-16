'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Bell, Calendar, Package, Clock, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type NotificationSetting = {
  id: string
  type: 'appointment' | 'inventory' | 'followUp'
  enabled: boolean
  timing?: number
  timingUnit?: 'hours' | 'days' | 'weeks'
}

type Notification = {
  id: string
  type: 'appointment' | 'inventory' | 'followUp'
  message: string
  createdAt: string
  read: boolean
}

export default function NotificationsAndReminders({ userId, userType }: { userId: string, userType: 'doctor' | 'patient' }) {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchNotificationSettings()
    fetchNotifications()
  }, [])

  const fetchNotificationSettings = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error

      setNotificationSettings(data)
    } catch (error) {
      console.error('Error fetching notification settings:', error)
      toast({
        title: "Error",
        description: "Failed to fetch notification settings. Please try again.",
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
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

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

  const updateNotificationSetting = async (setting: NotificationSetting) => {
    try {
      const { error } = await supabase
        .from('notification_settings')
        .update(setting)
        .eq('id', setting.id)

      if (error) throw error

      setNotificationSettings(prevSettings =>
        prevSettings.map(s => s.id === setting.id ? setting : s)
      )

      toast({
        title: "Settings Updated",
        description: "Your notification settings have been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating notification setting:', error)
      toast({
        title: "Error",
        description: "Failed to update notification setting. Please try again.",
        variant: "destructive",
      })
    }
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error

      setNotifications(prevNotifications =>
        prevNotifications.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read. Please try again.",
        variant: "destructive",
      })
    }
  }

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      {notificationSettings.map(setting => (
        <div key={setting.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {setting.type === 'appointment' && <Calendar className="h-4 w-4" />}
            {setting.type === 'inventory' && <Package className="h-4 w-4" />}
            {setting.type === 'followUp' && <Clock className="h-4 w-4" />}
            <Label htmlFor={`${setting.type}-toggle`}>
              {setting.type === 'appointment' && 'Appointment Reminders'}
              {setting.type === 'inventory' && 'Inventory Alerts'}
              {setting.type === 'followUp' && 'Follow-up Reminders'}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            {setting.type !== 'inventory' && (
              <>
                <Input
                  type="number"
                  value={setting.timing}
                  onChange={(e) => updateNotificationSetting({ ...setting, timing: parseInt(e.target.value) })}
                  className="w-16"
                />
                <Select
                  value={setting.timingUnit}
                  onValueChange={(value: 'hours' | 'days' | 'weeks') => updateNotificationSetting({ ...setting, timingUnit: value })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
            <Switch
              id={`${setting.type}-toggle`}
              checked={setting.enabled}
              onCheckedChange={(checked) => updateNotificationSetting({ ...setting, enabled: checked })}
            />
          </div>
        </div>
      ))}
    </div>
  )

  const renderNotifications = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {notifications.map(notification => (
          <TableRow key={notification.id} className={notification.read ? 'opacity-50' : ''}>
            <TableCell>
              {notification.type === 'appointment' && <Calendar className="h-4 w-4" />}
              {notification.type === 'inventory' && <Package className="h-4 w-4" />}
              {notification.type === 'followUp' && <Clock className="h-4 w-4" />}
            </TableCell>
            <TableCell>{notification.message}</TableCell>
            <TableCell>{new Date(notification.createdAt).toLocaleString()}</TableCell>
            <TableCell>
              {notification.read ? (
                'Read'
              ) : (
                <Button variant="link" onClick={() => markNotificationAsRead(notification.id)}>
                  Mark as Read
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Notifications and Reminders</CardTitle>
        <CardDescription>Manage your notification preferences and view recent alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="notifications">
          <TabsList>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="notifications">
            {renderNotifications()}
          </TabsContent>
          <TabsContent value="settings">
            {renderNotificationSettings()}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={fetchNotifications}>
          <Bell className="mr-2 h-4 w-4" />
          Refresh Notifications
        </Button>
        <Button variant="link" onClick={() => window.open('/notification-help', '_blank')}>
          Learn more about notifications
        </Button>
      </CardFooter>
    </Card>
  )
}
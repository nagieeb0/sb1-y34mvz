'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabaseClient'

type Permission = {
  id: string;
  name: string;
  description: string;
}

type Role = {
  id: string;
  name: string;
  permissions: string[];
}

type User = {
  id: string;
  email: string;
  role: string;
}

const defaultPermissions: Permission[] = [
  { id: 'manage_appointments', name: 'Manage Appointments', description: 'Create, edit, and delete appointments' },
  { id: 'view_patient_records', name: 'View Patient Records', description: 'Access patient medical histories and records' },
  { id: 'edit_patient_records', name: 'Edit Patient Records', description: 'Modify patient medical histories and records' },
  { id: 'view_financial_data', name: 'View Financial Data', description: 'Access clinic financial information' },
  { id: 'manage_inventory', name: 'Manage Inventory', description: 'Add, edit, and remove inventory items' },
]

const defaultRoles: Role[] = [
  { id: 'admin', name: 'Admin', permissions: defaultPermissions.map(p => p.id) },
  { id: 'assistant', name: 'Assistant', permissions: ['manage_appointments', 'view_patient_records', 'edit_patient_records', 'manage_inventory'] },
  { id: 'receptionist', name: 'Receptionist', permissions: ['manage_appointments', 'view_patient_records'] },
]

export default function RoleBasedPermissionsSetup({ clinicId }: { clinicId: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>(defaultRoles)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('clinic_users')
      .select('id, email, role')
      .eq('clinic_id', clinicId)

    if (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      })
    } else {
      setUsers(data)
    }
  }

  const fetchRoles = async () => {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('clinic_id', clinicId)

    if (error) {
      console.error('Error fetching roles:', error)
    } else if (data.length > 0) {
      setRoles(data)
    }
  }

  const handleAddUser = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('clinic_users')
        .insert({ email: newUserEmail, role: newUserRole, clinic_id: clinicId })
        .select()

      if (error) throw error

      setUsers([...users, data[0]])
      setNewUserEmail('')
      setNewUserRole('')
      toast({
        title: "User Added",
        description: "New user has been added successfully.",
      })
    } catch (error) {
      console.error('Error adding user:', error)
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('clinic_users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user))
      toast({
        title: "Role Updated",
        description: "User role has been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating user role:', error)
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateRolePermissions = async (roleId: string, permissions: string[]) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('roles')
        .update({ permissions })
        .eq('id', roleId)

      if (error) throw error

      setRoles(roles.map(role => role.id === roleId ? { ...role, permissions } : role))
      toast({
        title: "Permissions Updated",
        description: "Role permissions have been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating role permissions:', error)
      toast({
        title: "Error",
        description: "Failed to update role permissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Role-Based Permissions Setup</CardTitle>
        <CardDescription>Manage user roles and permissions for your clinic.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Add New User</h3>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                placeholder="Email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddUser} disabled={isLoading || !newUserEmail || !newUserRole}>
                Add User
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Manage Users</h3>
            <div className="space-y-2 mt-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <span>{user.email}</span>
                  <Select
                    value={user.role}
                    onValueChange={(newRole) => handleUpdateUserRole(user.id, newRole)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Manage Role Permissions</h3>
            <div className="space-y-4 mt-2">
              {roles.map((role) => (
                <div key={role.id}>
                  <h4 className="font-medium">{role.name}</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {defaultPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${role.id}-${permission.id}`}
                          checked={role.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => {
                            const newPermissions = checked
                              ? [...role.permissions, permission.id]
                              : role.permissions.filter(p => p !== permission.id)
                            handleUpdateRolePermissions(role.id, newPermissions)
                          }}
                        />
                        <Label htmlFor={`${role.id}-${permission.id}`}>{permission.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
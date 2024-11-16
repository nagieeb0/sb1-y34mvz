'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type User = {
  id: string;
  email: string;
  role: 'Admin' | 'Assistant' | 'Receptionist';
  twoFactorEnabled: boolean;
}

export default function SecurityAndPrivacy() {
  const [user, setUser] = useState<User | null>(null)
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: password,
      })

      if (error) throw error

      if (user?.twoFactorEnabled) {
        // Simulate 2FA code sending
        toast({
          title: "2FA Code Sent",
          description: "A two-factor authentication code has been sent to your device.",
        })
      } else {
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
        })
      }
    } catch (error) {
      console.error('Error logging in:', error)
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactorVerification = async () => {
    setIsLoading(true)
    try {
      // Simulate 2FA verification
      if (twoFactorCode === '123456') {
        toast({
          title: "2FA Verified",
          description: "Two-factor authentication successful.",
        })
      } else {
        throw new Error('Invalid 2FA code')
      }
    } catch (error) {
      console.error('Error verifying 2FA:', error)
      toast({
        title: "2FA Verification Failed",
        description: "Invalid two-factor authentication code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    setIsLoading(true)
    try {
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) throw error

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      })

      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error changing password:', error)
      toast({
        title: "Password Change Failed",
        description: error instanceof Error ? error.message : "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle2FA = async () => {
    setIsLoading(true)
    try {
      const newTwoFactorStatus = !user?.twoFactorEnabled

      const { error } = await supabase
        .from('users')
        .update({ twoFactorEnabled: newTwoFactorStatus })
        .eq('id', user?.id)

      if (error) throw error

      setUser(prev => prev ? { ...prev, twoFactorEnabled: newTwoFactorStatus } : null)

      toast({
        title: newTwoFactorStatus ? "2FA Enabled" : "2FA Disabled",
        description: `Two-factor authentication has been ${newTwoFactorStatus ? 'enabled' : 'disabled'}.`,
      })
    } catch (error) {
      console.error('Error toggling 2FA:', error)
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrivacyConsent = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('users')
        .update({ privacyConsentGiven: privacyConsent })
        .eq('id', user?.id)

      if (error) throw error

      toast({
        title: "Privacy Consent Updated",
        description: `You have ${privacyConsent ? 'given' : 'withdrawn'} consent to our privacy policy.`,
      })
    } catch (error) {
      console.error('Error updating privacy consent:', error)
      toast({
        title: "Error",
        description: "Failed to update privacy consent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Security and Privacy</CardTitle>
        <CardDescription>Manage your account security and privacy settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Current Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button onClick={handlePasswordChange} disabled={isLoading} className="w-full">
          Change Password
        </Button>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="twoFactor"
            checked={user?.twoFactorEnabled}
            onCheckedChange={handleToggle2FA}
          />
          <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
        </div>

        {user?.twoFactorEnabled && (
          <div className="space-y-2">
            <Label htmlFor="twoFactorCode">Two-Factor Authentication Code</Label>
            <Input
              id="twoFactorCode"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="Enter 6-digit code"
            />
            <Button onClick={handleTwoFactorVerification} disabled={isLoading} className="w-full">
              Verify 2FA Code
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="privacyConsent"
              checked={privacyConsent}
              onCheckedChange={(checked) => setPrivacyConsent(checked as boolean)}
            />
            <Label htmlFor="privacyConsent">I consent to the privacy policy</Label>
          </div>
          <Button onClick={handlePrivacyConsent} disabled={isLoading} className="w-full">
            Update Privacy Consent
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          By using DentEase, you agree to our Terms of Service and Privacy Policy. We encrypt all sensitive data and never share your information without your consent.
        </p>
      </CardFooter>
    </Card>
  )
}
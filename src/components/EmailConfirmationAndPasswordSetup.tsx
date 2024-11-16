'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabaseClient'
import { createHash } from 'crypto'

// Mock function to simulate sending an email
const sendConfirmationEmail = async (email: string, code: string) => {
  console.log(`Sending confirmation code ${code} to ${email}`)
  // In a real application, this would send an actual email
  return Promise.resolve()
}

export default function EmailConfirmationAndPasswordSetup({ email }: { email: string }) {
  const [step, setStep] = useState<'sendCode' | 'confirmCode' | 'setPassword'>('sendCode')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const generateConfirmationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleSendCode = async () => {
    setIsLoading(true)
    const code = generateConfirmationCode()
    try {
      await sendConfirmationEmail(email, code)
      await supabase.from('doctors').update({ confirmation_code: code }).eq('email', email)
      setStep('confirmCode')
      toast({
        title: "Confirmation Code Sent",
        description: "Please check your email for the confirmation code.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to send confirmation code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmCode = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('confirmation_code')
        .eq('email', email)
        .single()

      if (error) throw error

      if (data.confirmation_code === confirmationCode) {
        await supabase.from('doctors').update({ email_confirmed: true }).eq('email', email)
        setStep('setPassword')
        toast({
          title: "Email Confirmed",
          description: "Your email has been confirmed. Please set your password.",
        })
      } else {
        throw new Error('Invalid confirmation code')
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Invalid confirmation code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetPassword = async () => {
    setIsLoading(true)
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const hashedPassword = createHash('sha256').update(password).digest('hex')
      const { error } = await supabase
        .from('doctors')
        .update({ password: hashedPassword })
        .eq('email', email)

      if (error) throw error

      toast({
        title: "Password Set",
        description: "Your password has been set successfully. You can now log in to DentEase.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to set password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>DentEase Account Setup</CardTitle>
        <CardDescription>Confirm your email and set your password.</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'sendCode' && (
          <div className="flex flex-col space-y-4">
            <p>Click the button below to receive a confirmation code via email.</p>
            <Button onClick={handleSendCode} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Confirmation Code"}
            </Button>
          </div>
        )}
        {step === 'confirmCode' && (
          <div className="flex flex-col space-y-4">
            <Label htmlFor="confirmationCode">Confirmation Code</Label>
            <Input
              id="confirmationCode"
              type="text"
              placeholder="Enter 6-digit code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
            <Button onClick={handleConfirmCode} disabled={isLoading}>
              {isLoading ? "Confirming..." : "Confirm Code"}
            </Button>
          </div>
        )}
        {step === 'setPassword' && (
          <div className="flex flex-col space-y-4">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
            </p>
            <Button onClick={handleSetPassword} disabled={isLoading}>
              {isLoading ? "Setting Password..." : "Set Password"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
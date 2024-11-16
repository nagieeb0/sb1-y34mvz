'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabaseClient'

const languages = [
  { id: 'en', name: 'English' },
  { id: 'ar', name: 'العربية' },
  { id: 'fr', name: 'Français' },
  { id: 'es', name: 'Español' },
]

export default function DoctorRegistration() {
  const [language, setLanguage] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!language || !email) {
      toast({
        title: "Error",
        description: "Please select a language and enter your email.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('doctors')
        .insert([{ language, email }])
        .select()

      if (error) throw error

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>DentEase Registration</CardTitle>
        <CardDescription>Set up your account to get started.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="language">Preferred Language</Label>
              <RadioGroup id="language" value={language} onValueChange={setLanguage}>
                {languages.map((lang) => (
                  <div key={lang.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={lang.id} id={lang.id} />
                    <Label htmlFor={lang.id}>{lang.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
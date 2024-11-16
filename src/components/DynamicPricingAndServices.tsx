'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabaseClient'

type Service = {
  id: string;
  name: string;
  basePrice: number;
  suggestedPrice: number;
  isOffered: boolean;
}

type EconomicFactors = {
  costOfLiving: number;
  averageIncome: number;
  competitionLevel: number;
}

export default function DynamicPricingAndServices({ clinicId }: { clinicId: string }) {
  const [services, setServices] = useState<Service[]>([])
  const [economicFactors, setEconomicFactors] = useState<EconomicFactors>({
    costOfLiving: 100,
    averageIncome: 50000,
    competitionLevel: 5
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchServices()
    fetchEconomicFactors()
  }, [])

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('clinic_services')
      .select('*')
      .eq('clinic_id', clinicId)

    if (error) {
      console.error('Error fetching services:', error)
      toast({
        title: "Error",
        description: "Failed to fetch services. Please try again.",
        variant: "destructive",
      })
    } else if (data) {
      setServices(data)
    }
  }

  const fetchEconomicFactors = async () => {
    const { data, error } = await supabase
      .from('economic_factors')
      .select('*')
      .eq('clinic_id', clinicId)
      .single()

    if (error) {
      console.error('Error fetching economic factors:', error)
      toast({
        title: "Error",
        description: "Failed to fetch economic factors. Please try again.",
        variant: "destructive",
      })
    } else if (data) {
      setEconomicFactors(data)
    }
  }

  const updateService = async (updatedService: Service) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('clinic_services')
        .update(updatedService)
        .eq('id', updatedService.id)

      if (error) throw error

      setServices(services.map(service => 
        service.id === updatedService.id ? updatedService : service
      ))
      toast({
        title: "Service Updated",
        description: "The service has been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating service:', error)
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateEconomicFactors = async (factors: EconomicFactors) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('economic_factors')
        .upsert({ clinic_id: clinicId, ...factors })

      if (error) throw error

      setEconomicFactors(factors)
      toast({
        title: "Economic Factors Updated",
        description: "The economic factors have been updated successfully.",
      })
    } catch (error) {
      console.error('Error updating economic factors:', error)
      toast({
        title: "Error",
        description: "Failed to update economic factors. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateSuggestedPrice = (basePrice: number) => {
    // This is a simplified calculation. In a real-world scenario, this would be more complex
    // and potentially use machine learning models or more sophisticated algorithms.
    const costFactor = economicFactors.costOfLiving / 100
    const incomeFactor = economicFactors.averageIncome / 50000
    const competitionFactor = 1 - (economicFactors.competitionLevel / 10)

    return Math.round(basePrice * costFactor * incomeFactor * competitionFactor)
  }

  const handleServiceChange = (serviceId: string, field: keyof Service, value: any) => {
    const updatedServices = services.map(service => {
      if (service.id === serviceId) {
        const updatedService = { ...service, [field]: value }
        if (field === 'basePrice') {
          updatedService.suggestedPrice = calculateSuggestedPrice(value)
        }
        updateService(updatedService)
        return updatedService
      }
      return service
    })
    setServices(updatedServices)
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Dynamic Pricing and Service Customization</CardTitle>
        <CardDescription>Manage your services and view AI-suggested pricing.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Economic Factors</h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              <div>
                <Label htmlFor="costOfLiving">Cost of Living Index</Label>
                <Input
                  id="costOfLiving"
                  type="number"
                  value={economicFactors.costOfLiving}
                  onChange={(e) => setEconomicFactors({ ...economicFactors, costOfLiving: parseFloat(e.target.value) })}
                  onBlur={() => updateEconomicFactors(economicFactors)}
                />
              </div>
              <div>
                <Label htmlFor="averageIncome">Average Income</Label>
                <Input
                  id="averageIncome"
                  type="number"
                  value={economicFactors.averageIncome}
                  onChange={(e) => setEconomicFactors({ ...economicFactors, averageIncome: parseFloat(e.target.value) })}
                  onBlur={() => updateEconomicFactors(economicFactors)}
                />
              </div>
              <div>
                <Label htmlFor="competitionLevel">Competition Level (1-10)</Label>
                <Input
                  id="competitionLevel"
                  type="number"
                  min="1"
                  max="10"
                  value={economicFactors.competitionLevel}
                  onChange={(e) => setEconomicFactors({ ...economicFactors, competitionLevel: parseFloat(e.target.value) })}
                  onBlur={() => updateEconomicFactors(economicFactors)}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Services and Pricing</h3>
            <div className="space-y-4 mt-2">
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-4">
                  <Checkbox
                    id={`offer-${service.id}`}
                    checked={service.isOffered}
                    onCheckedChange={(checked) => handleServiceChange(service.id, 'isOffered', checked)}
                  />
                  <Label htmlFor={`offer-${service.id}`} className="flex-grow">{service.name}</Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`base-${service.id}`}>Base Price:</Label>
                    <Input
                      id={`base-${service.id}`}
                      type="number"
                      value={service.basePrice}
                      onChange={(e) => handleServiceChange(service.id, 'basePrice', parseFloat(e.target.value))}
                      className="w-24"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`suggested-${service.id}`}>Suggested Price:</Label>
                    <Input
                      id={`suggested-${service.id}`}
                      type="number"
                      value={service.suggestedPrice}
                      onChange={(e) => handleServiceChange(service.id, 'suggestedPrice', parseFloat(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => services.forEach(updateService)} disabled={isLoading}>
          Save All Changes
        </Button>
      </CardFooter>
    </Card>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, PlusCircle } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  minThreshold: number;
  expirationDate?: string;
}

export default function InventoryManagement({ clinicId }: { clinicId: string }) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchInventoryItems()
  }, [])

  const fetchInventoryItems = async () => {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('clinic_id', clinicId)

    if (error) {
      console.error('Error fetching inventory items:', error)
      toast({
        title: "Error",
        description: "Failed to fetch inventory items. Please try again.",
        variant: "destructive",
      })
    } else if (data) {
      setInventoryItems(data)
    }
  }

  const addInventoryItem = async () => {
    setIsLoading(true)
    try {
      if (!newItem.name || newItem.quantity === undefined || newItem.minThreshold === undefined) {
        throw new Error('Please fill in all required fields')
      }

      const { data, error } = await supabase
        .from('inventory_items')
        .insert({ ...newItem, clinic_id: clinicId })
        .select()

      if (error) throw error

      setInventoryItems([...inventoryItems, data[0]])
      setNewItem({})
      toast({
        title: "Item Added",
        description: "New inventory item has been added successfully.",
      })
    } catch (error) {
      console.error('Error adding inventory item:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add inventory item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateInventoryItem = async (updatedItem: InventoryItem) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update(updatedItem)
        .eq('id', updatedItem.id)

      if (error) throw error

      setInventoryItems(inventoryItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ))
      toast({
        title: "Item Updated",
        description: "Inventory item has been updated successfully.",
      })

      // Check for low stock alert
      if (updatedItem.quantity < updatedItem.minThreshold) {
        toast({
          title: "Low Stock Alert",
          description: `${updatedItem.name} is below the minimum threshold. Please reorder.`,
          variant: "destructive",
        })
      }

      // Check for expiration date alert
      if (updatedItem.expirationDate) {
        const daysUntilExpiration = Math.ceil((new Date(updatedItem.expirationDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
        if (daysUntilExpiration <= 30) {
          toast({
            title: "Expiration Alert",
            description: `${updatedItem.name} will expire in ${daysUntilExpiration} days.`,
            variant: "warning",
          })
        }
      }
    } catch (error) {
      console.error('Error updating inventory item:', error)
      toast({
        title: "Error",
        description: "Failed to update inventory item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    const updatedItem = inventoryItems.find(item => item.id === id)
    if (updatedItem) {
      updateInventoryItem({ ...updatedItem, quantity: newQuantity })
    }
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Inventory Management</CardTitle>
        <CardDescription>Track and manage your clinic's supplies and equipment.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Add New Item</h3>
            <div className="grid grid-cols-5 gap-4 mt-2">
              <div className="col-span-2">
                <Label htmlFor="newItemName">Item Name</Label>
                <Input
                  id="newItemName"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <Label htmlFor="newItemQuantity">Quantity</Label>
                <Input
                  id="newItemQuantity"
                  type="number"
                  value={newItem.quantity || ''}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <Label htmlFor="newItemThreshold">Min Threshold</Label>
                <Input
                  id="newItemThreshold"
                  type="number"
                  value={newItem.minThreshold || ''}
                  onChange={(e) => setNewItem({ ...newItem, minThreshold: parseInt(e.target.value) })}
                  placeholder="Enter min threshold"
                />
              </div>
              <div>
                <Label htmlFor="newItemExpiration">Expiration Date</Label>
                <Input
                  id="newItemExpiration"
                  type="date"
                  value={newItem.expirationDate || ''}
                  onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={addInventoryItem} disabled={isLoading} className="mt-2">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-medium">Current Inventory</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Min Threshold</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>{item.minThreshold}</TableCell>
                    <TableCell>{item.expirationDate || 'N/A'}</TableCell>
                    <TableCell>
                      {item.quantity < item.minThreshold && (
                        <span className="flex items-center text-red-500">
                          <AlertCircle className="mr-1 h-4 w-4" /> Low Stock
                        </span>
                      )}
                      {item.expirationDate && new Date(item.expirationDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                        <span className="flex items-center text-yellow-500">
                          <AlertCircle className="mr-1 h-4 w-4" /> Expiring Soon
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Package, TrendingUp, AlertTriangle, ArrowRightLeft, ShoppingCart, BarChart2, Search } from 'lucide-react'

// Simulated data (replace with actual Supabase queries in production)
const locations = [
  { id: 1, name: 'Main Clinic' },
  { id: 2, name: 'Downtown Branch' },
  { id: 3, name: 'Suburban Office' },
]

const inventoryData = [
  { id: 1, name: 'Dental Floss', sku: 'DF001', locationId: 1, quantity: 500, minThreshold: 100 },
  { id: 2, name: 'Toothbrush', sku: 'TB001', locationId: 1, quantity: 200, minThreshold: 50 },
  { id: 3, name: 'Dental Floss', sku: 'DF001', locationId: 2, quantity: 300, minThreshold: 100 },
  { id: 4, name: 'Toothbrush', sku: 'TB001', locationId: 2, quantity: 150, minThreshold: 50 },
  { id: 5, name: 'Dental Floss', sku: 'DF001', locationId: 3, quantity: 400, minThreshold: 100 },
  { id: 6, name: 'Toothbrush', sku: 'TB001', locationId: 3, quantity: 100, minThreshold: 50 },
]

const transferHistory = [
  { id: 1, date: '2023-07-20', fromLocation: 'Main Clinic', toLocation: 'Downtown Branch', item: 'Dental Floss', quantity: 100 },
  { id: 2, date: '2023-07-18', fromLocation: 'Suburban Office', toLocation: 'Main Clinic', item: 'Toothbrush', quantity: 50 },
]

const orderHistory = [
  { id: 1, date: '2023-07-15', supplier: 'Dental Supplies Co.', items: [{ name: 'Dental Floss', quantity: 1000 }, { name: 'Toothbrush', quantity: 500 }], status: 'Delivered' },
  { id: 2, date: '2023-07-22', supplier: 'Oral Care Products', items: [{ name: 'Toothpaste', quantity: 200 }], status: 'In Transit' },
]

const usageData = [
  { month: 'Jan', 'Dental Floss': 300, 'Toothbrush': 150 },
  { month: 'Feb', 'Dental Floss': 400, 'Toothbrush': 200 },
  { month: 'Mar', 'Dental Floss': 350, 'Toothbrush': 180 },
  { month: 'Apr', 'Dental Floss': 450, 'Toothbrush': 220 },
  { month: 'May', 'Dental Floss': 500, 'Toothbrush': 250 },
  { month: 'Jun', 'Dental Floss': 480, 'Toothbrush': 240 },
]

export default function MultiLocationInventoryManagement() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showOrderDialog, setShowOrderDialog] = useState(false)
  const [transferDetails, setTransferDetails] = useState({ fromLocation: '', toLocation: '', item: '', quantity: 0 })
  const [orderDetails, setOrderDetails] = useState({ supplier: '', items: [{ name: '', quantity: 0 }] })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // In a real application, fetch inventory data from Supabase here
  }, [])

  const handleTransfer = () => {
    // In a real application, update inventory levels in Supabase and record the transfer
    toast({
      title: "Transfer Completed",
      description: `${transferDetails.quantity} ${transferDetails.item}(s) transferred from ${transferDetails.fromLocation} to ${transferDetails.toLocation}.`,
    })
    setShowTransferDialog(false)
    setTransferDetails({ fromLocation: '', toLocation: '', item: '', quantity: 0 })
  }

  const handleOrder = () => {
    // In a real application, place the order with the supplier and record it in Supabase
    toast({
      title: "Order Placed",
      description: `Order placed with ${orderDetails.supplier} for ${orderDetails.items.length} item(s).`,
    })
    setShowOrderDialog(false)
    setOrderDetails({ supplier: '', items: [{ name: '', quantity: 0 }] })
  }

  const filteredInventory = inventoryData.filter(item =>
    (selectedLocation === null || item.locationId === selectedLocation) &&
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Package className="mr-2 h-6 w-6" />
          Multi-Location Inventory Management
        </CardTitle>
        <CardDescription>Manage and optimize inventory across all clinic locations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transfers">Transfers</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={selectedLocation?.toString() || ''} onValueChange={(value) => setSelectedLocation(value ? parseInt(value) : null)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id.toString()}>{location.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center border rounded-md px-3 py-2">
                    <Search className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{locations.find(loc => loc.id === item.locationId)?.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {item.quantity <= item.minThreshold ? (
                            <Badge variant="destructive">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <TrendingUp className="mr-1 h-3 w-3" />
                              Sufficient
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setShowTransferDialog(true)}>
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Transfer Stock
                </Button>
                <Button onClick={() => setShowOrderDialog(true)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="transfers">
            <Card>
              <CardHeader>
                <CardTitle>Transfer History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transferHistory.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell>{transfer.date}</TableCell>
                        <TableCell>{transfer.fromLocation}</TableCell>
                        <TableCell>{transfer.toLocation}</TableCell>
                        <TableCell>{transfer.item}</TableCell>
                        <TableCell>{transfer.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderHistory.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell>
                          {order.items.map((item, index) => (
                            <div key={index}>{item.name}: {item.quantity}</div>
                          ))}
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'Delivered' ? 'secondary' : 'default'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setShowOrderDialog(true)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Place New Order
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Dental Floss" fill="#8884d8" />
                      <Bar dataKey="Toothbrush" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting">
            <Card>
              <CardHeader>
                <CardTitle>Demand Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line  type="monotone" dataKey="Dental Floss" stroke="#8884d8" />
                      <Line type="monotone" dataKey="Toothbrush" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transfer Stock</DialogTitle>
            <DialogDescription>
              Transfer inventory between clinic locations.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fromLocation" className="text-right">
                From
              </Label>
              <Select value={transferDetails.fromLocation} onValueChange={(value) => setTransferDetails({ ...transferDetails, fromLocation: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.name}>{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="toLocation" className="text-right">
                To
              </Label>
              <Select value={transferDetails.toLocation} onValueChange={(value) => setTransferDetails({ ...transferDetails, toLocation: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.name}>{location.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item" className="text-right">
                Item
              </Label>
              <Select value={transferDetails.item} onValueChange={(value) => setTransferDetails({ ...transferDetails, item: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryData.map((item) => (
                    <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={transferDetails.quantity}
                onChange={(e) => setTransferDetails({ ...transferDetails, quantity: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleTransfer}>Confirm Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
            <DialogDescription>
              Order new inventory from suppliers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Input
                id="supplier"
                value={orderDetails.supplier}
                onChange={(e) => setOrderDetails({ ...orderDetails, supplier: e.target.value })}
                className="col-span-3"
              />
            </div>
            {orderDetails.items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`item-${index}`} className="text-right">
                  Item {index + 1}
                </Label>
                <Input
                  id={`item-${index}`}
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...orderDetails.items]
                    newItems[index].name = e.target.value
                    setOrderDetails({ ...orderDetails, items: newItems })
                  }}
                  className="col-span-2"
                />
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...orderDetails.items]
                    newItems[index].quantity = parseInt(e.target.value)
                    setOrderDetails({ ...orderDetails, items: newItems })
                  }}
                  className="col-span-1"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setOrderDetails({ ...orderDetails, items: [...orderDetails.items, { name: '', quantity: 0 }] })}>
              Add Item
            </Button>
            <Button onClick={handleOrder}>Place Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
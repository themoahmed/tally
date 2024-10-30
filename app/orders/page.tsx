'use client'

import { useState, useEffect } from 'react'
import { format, differenceInHours } from 'date-fns'
import { Upload, Download, Plus, ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

type Order = {
  name: string
  variant: string
  qty: number
  price: number
  date: string
}

// Updated sample data
const sampleOrders: Order[] = [
    { name: "USC Swoosh Design", variant: "Gildan H000 Black S", qty: 10, price: 25.00, date: "2024-10-28" },
    { name: "USC Swoosh Design", variant: "Gildan H000 Black M", qty: 5, price: 45.00, date: "2024-10-26" },
    { name: "USC Swoosh Design", variant: "Gildan H000 Black L", qty: 8, price: 30.00, date: "2024-10-29" },
    { name: "I <3 Tommy Trojan Shirt", variant: "Gildan H000 Black S", qty: 12, price: 25.00, date: "2024-10-28" },
    { name: "I <3 Tommy Trojan Shirt", variant: "Gildan H000 Black M", qty: 7, price: 45.00, date: "2024-10-26" },
    { name: "I <3 Tommy Trojan Shirt", variant: "Gildan H000 White L", qty: 8, price: 30.00, date: "2024-10-29" },
    { name: "USC Swoosh Design", variant: "Gildan H000 Red XL", qty: 15, price: 35.00, date: "2024-10-30" },
    { name: "I <3 Tommy Trojan Shirt", variant: "Gildan H000 Red L", qty: 10, price: 35.00, date: "2024-10-30" },
    { name: "USC Swoosh Design", variant: "Gildan H000 Blue M", qty: 20, price: 28.00, date: "2024-10-31" },
    { name: "I <3 Tommy Trojan Shirt", variant: "Gildan H000 Blue S", qty: 18, price: 28.00, date: "2024-10-31" },
  ]

type SortConfig = {
  key: keyof Order
  direction: 'asc' | 'desc'
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders)
  const [filterName, setFilterName] = useState('')
  const [filterAge, setFilterAge] = useState('')
  const [filterDateStart, setFilterDateStart] = useState('')
  const [filterDateEnd, setFilterDateEnd] = useState('')
  const [csvContent, setCsvContent] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' })
  const [urgentThreshold, setUrgentThreshold] = useState(24)
  const [warningThreshold, setWarningThreshold] = useState(48)
  const [newOrder, setNewOrder] = useState<Order>({ name: '', variant: '', qty: 0, price: 0, date: '' })

  useEffect(() => {
    filterAndSortOrders()
  }, [orders, filterName, filterAge, filterDateStart, filterDateEnd, sortConfig])

  const filterAndSortOrders = () => {
    let filtered = orders.filter(order => 
      order.name.toLowerCase().includes(filterName.toLowerCase()) ||
      order.variant.toLowerCase().includes(filterName.toLowerCase())
    )

    if (filterAge) {
      filtered = filtered.filter(order => {
        const age = differenceInHours(new Date(), new Date(order.date))
        if (filterAge === 'new' && age <= urgentThreshold) return true
        if (filterAge === 'medium' && age > urgentThreshold && age <= warningThreshold) return true
        if (filterAge === 'old' && age > warningThreshold) return true
        return false
      })
    }

    if (filterDateStart && filterDateEnd) {
      filtered = filtered.filter(order => 
        new Date(order.date) >= new Date(filterDateStart) &&
        new Date(order.date) <= new Date(filterDateEnd)
      )
    }

    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

    setFilteredOrders(filtered)
  }

  const handleSort = (key: keyof Order) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setCsvContent(content)
        const lines = content.split('\n')
        const newOrders: Order[] = lines.slice(1).map(line => {
          const [name, variant, qty, price, date] = line.split(',')
          return {
            name,
            variant,
            qty: parseInt(qty),
            price: parseFloat(price),
            date
          }
        })
        setOrders([...orders, ...newOrders])
      }
      reader.readAsText(file)
    }
  }

  const getAgeColor = (date: string) => {
    const age = differenceInHours(new Date(), new Date(date))
    if (age <= urgentThreshold) return 'bg-green-100 hover:bg-green-200'
    if (age <= warningThreshold) return 'bg-yellow-100 hover:bg-yellow-200'
    return 'bg-red-100 hover:bg-red-200'
  }

  const getSortIcon = (key: keyof Order) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />
    }
    return <ChevronsUpDown className="inline w-4 h-4" />
  }

  const handleDownloadSampleCSV = () => {
    const csvContent = "name,variant,qty,price,date\nDesign,Gildan H000 Black S,10,25.00,2024-10-28\nDesign,Gildan H000 Black M,5,45.00,2024-10-26\nDesign,Gildan H000 Black L,8,30.00,2024-10-29"
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "sample_orders.csv")
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleAddOrder = () => {
    if (newOrder.name && newOrder.variant && newOrder.qty && newOrder.price && newOrder.date) {
      setOrders([...orders, newOrder])
      setNewOrder({ name: '', variant: '', qty: 0, price: 0, date: '' })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          placeholder="Filter by name or variant"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="max-w-xs"
        />
        <Select value={filterAge} onValueChange={setFilterAge}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by age" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New (&lt;{urgentThreshold}h)</SelectItem>
            <SelectItem value="medium">{urgentThreshold}-{warningThreshold}h</SelectItem>
            <SelectItem value="old">&gt;{warningThreshold}h</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={filterDateStart}
          onChange={(e) => setFilterDateStart(e.target.value)}
          className="max-w-xs"
        />
        <Input
          type="date"
          value={filterDateEnd}
          onChange={(e) => setFilterDateEnd(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="urgent-threshold">Urgent Threshold (hours):</Label>
          <Slider
            id="urgent-threshold"
            min={1}
            max={72}
            step={1}
            value={[urgentThreshold]}
            onValueChange={(value) => setUrgentThreshold(value[0])}
            className="w-[200px]"
          />
          <span>{urgentThreshold}h</span>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="warning-threshold">Warning Threshold (hours):</Label>
          <Slider
            id="warning-threshold"
            min={1}
            max={72}
            step={1}
            value={[warningThreshold]}
            onValueChange={(value) => setWarningThreshold(value[0])}
            className="w-[200px]"
          />
          <span>{warningThreshold}h</span>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" /> Upload CSV
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload Orders CSV</DialogTitle>
              <DialogDescription>
                Upload a CSV file with columns: Name, Variant, Quantity, Price, Date
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="csv-file" className="sr-only">
                Choose CSV file
              </Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
              />
              {csvContent && (
                <div className="mt-4">
                  <h3 className="font-semibold">Preview:</h3>
                  <pre className="mt-2 whitespace-pre-wrap">{csvContent.slice(0, 200)}...</pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={handleDownloadSampleCSV}>
          <Download className="mr-2 h-4 w-4" /> Download Sample CSV
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Order</DialogTitle>
              <DialogDescription>
                Enter the details for the new order
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newOrder.name}
                  onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="variant" className="text-right">
                  Variant
                </Label>
                <Input
                  id="variant"
                  value={newOrder.variant}
                  onChange={(e) => setNewOrder({ ...newOrder, variant: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newOrder.qty}
                  onChange={(e) => setNewOrder({ ...newOrder, qty: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newOrder.price}
                  onChange={(e) => setNewOrder({ ...newOrder, price: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={newOrder.date}
                  onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddOrder}>Add Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
              Design Name {getSortIcon('name')}
            </TableHead>
            <TableHead onClick={() => handleSort('variant')} className="cursor-pointer">
              Variant {getSortIcon('variant')}
            </TableHead>
            <TableHead onClick={() => handleSort('qty')} className="cursor-pointer">
              Quantity {getSortIcon('qty')}
            </TableHead>
            <TableHead onClick={() => handleSort('price')} className="cursor-pointer">
              Price {getSortIcon('price')}
            </TableHead>
            <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
              Order Date {getSortIcon('date')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {filteredOrders.map((order, index) => (
            <TableRow key={index} className={`transition-colors ${getAgeColor(order.date)}`}>
              <TableCell>{order.name}</TableCell>
              <TableCell>{order.variant}</TableCell>
              <TableCell>{order.qty}</TableCell>
              <TableCell>${order.price.toFixed(2)}</TableCell>
              <TableCell>{format(new Date(order.date), 'yyyy-MM-dd')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
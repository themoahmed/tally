'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Order = {
  name: string
  variant: string
  qty: number
  price: number
  date: string
}

type BlankNeeded = {
  [key: string]: number
}

type ProductNeeded = {
  [key: string]: {
    [key: string]: number
  }
}

export default function TodoPage() {
  const [view, setView] = useState<'materials' | 'orders'>('materials')
  const [blanksNeeded, setBlanksNeeded] = useState<BlankNeeded>({})
  const [productsNeeded, setProductsNeeded] = useState<ProductNeeded>({})

  const sampleOrders: Order[] = [
    { name: "Design1", variant: "Gildan H000 Black S", qty: 10, price: 25.00, date: "2024-10-28" },
    { name: "Design1", variant: "Gildan H000 Black M", qty: 5, price: 45.00, date: "2024-10-26" },
    { name: "Design1", variant: "Gildan H000 Black L", qty: 8, price: 30.00, date: "2024-10-29" },
    { name: "Design2", variant: "Gildan H000 Black S", qty: 12, price: 25.00, date: "2024-10-28" },
    { name: "Design2", variant: "Gildan H000 Black M", qty: 7, price: 45.00, date: "2024-10-26" },
    { name: "Design3", variant: "Gildan H000 White L", qty: 8, price: 30.00, date: "2024-10-29" },
    { name: "Design4", variant: "Gildan H000 Red XL", qty: 15, price: 35.00, date: "2024-10-30" },
    { name: "Design4", variant: "Gildan H000 Red L", qty: 10, price: 35.00, date: "2024-10-30" },
    { name: "Design5", variant: "Gildan H000 Blue M", qty: 20, price: 28.00, date: "2024-10-31" },
    { name: "Design5", variant: "Gildan H000 Blue S", qty: 18, price: 28.00, date: "2024-10-31" },
  ]

  useEffect(() => {
    const calculateBlanksNeeded = (orders: Order[]): BlankNeeded => {
      return orders.reduce((acc, order) => {
        acc[order.variant] = (acc[order.variant] || 0) + order.qty
        return acc
      }, {} as BlankNeeded)
    }

    const calculateProductsNeeded = (orders: Order[]): ProductNeeded => {
      return orders.reduce((acc, order) => {
        if (!acc[order.name]) {
          acc[order.name] = {}
        }
        acc[order.name][order.variant] = (acc[order.name][order.variant] || 0) + order.qty
        return acc
      }, {} as ProductNeeded)
    }

    setBlanksNeeded(calculateBlanksNeeded(sampleOrders))
    setProductsNeeded(calculateProductsNeeded(sampleOrders))
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">To-Do Page: Outstanding Orders</h1>
      
      <div className="flex justify-center space-x-4 mb-6">
        <Button 
          onClick={() => setView('materials')}
          variant={view === 'materials' ? 'default' : 'outline'}
        >
          Materials
        </Button>
        <Button 
          onClick={() => setView('orders')}
          variant={view === 'orders' ? 'default' : 'outline'}
        >
          Orders
        </Button>
      </div>

      {view === 'materials' && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead>Quantity Needed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(blanksNeeded).map(([variant, qty]) => (
              <TableRow key={variant}>
                <TableCell>{variant}</TableCell>
                <TableCell>{qty} units</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {view === 'orders' && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(productsNeeded).flatMap(([product, variants]) =>
              Object.entries(variants).map(([variant, qty]) => (
                <TableRow key={`${product}-${variant}`}>
                  <TableCell>{product}</TableCell>
                  <TableCell>{variant}</TableCell>
                  <TableCell>{qty}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
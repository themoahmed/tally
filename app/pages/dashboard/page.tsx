'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Package, AlertTriangle, DollarSign, ShoppingCart, TrendingUp, ArrowUpRight } from 'lucide-react'

// Mock data for demonstration
const inventorySummary = {
  totalMaterials: 150,
  lowStockItems: 12,
  totalValue: 15000,
  categories: 8
}

const recentActivities = [
  { id: 1, action: 'Added new material', material: 'Cotton Fabric', quantity: 500, date: '2023-10-28' },
  { id: 2, action: 'Updated stock', material: 'Buttons', quantity: -200, date: '2023-10-27' },
  { id: 3, action: 'Removed material', material: 'Zipper', quantity: 0, date: '2023-10-26' },
  { id: 4, action: 'Added new material', material: 'Denim', quantity: 300, date: '2023-10-25' },
]

const monthlyData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
]

export default function HomePage() {
  const [chartData] = useState(monthlyData)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventorySummary.totalMaterials}</div>
            <p className="text-xs text-muted-foreground">items in inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventorySummary.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">items below threshold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${inventorySummary.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">total inventory value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventorySummary.categories}</div>
            <p className="text-xs text-muted-foreground">unique categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Inventory Value</CardTitle>
            <CardDescription>Total inventory value over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates in your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>{activity.material}</TableCell>
                    <TableCell>{activity.quantity}</TableCell>
                    <TableCell>{activity.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quick Actions</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/inventory" passHref>
          <Button className="w-full">
            <Package className="mr-2 h-4 w-4" /> View Inventory
          </Button>
        </Link>
        <Link href="/add-material" passHref>
          <Button className="w-full">
            <TrendingUp className="mr-2 h-4 w-4" /> Add Material
          </Button>
        </Link>
        <Link href="/low-stock" passHref>
          <Button className="w-full">
            <AlertTriangle className="mr-2 h-4 w-4" /> Low Stock Items
          </Button>
        </Link>
        <Link href="/reports" passHref>
          <Button className="w-full">
            <ArrowUpRight className="mr-2 h-4 w-4" /> Generate Report
          </Button>
        </Link>
      </div>
    </div>
  )
}
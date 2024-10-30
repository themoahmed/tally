'use client'

import { useState, useEffect } from 'react'
import { format, differenceInHours } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"

type Material = {
  name: string
  variant: string
  qty: number
  threshold: number
  lastUpdated: string
}

const sampleMaterials: Material[] = [
  { name: "Black Shirt", variant: "S", qty: 5, threshold: 10, lastUpdated: "2024-10-28" },
  { name: "Black Shirt", variant: "M", qty: 8, threshold: 15, lastUpdated: "2024-10-26" },
  { name: "White Shirt", variant: "L", qty: 12, threshold: 20, lastUpdated: "2024-10-29" },
  { name: "Red Shirt", variant: "XL", qty: 3, threshold: 10, lastUpdated: "2024-10-30" },
  { name: "Blue Shirt", variant: "S", qty: 7, threshold: 15, lastUpdated: "2024-10-31" },
]

export default function QueuePage() {
  const [materials, setMaterials] = useState<Material[]>(sampleMaterials)
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(materials)
  const [filterName, setFilterName] = useState('')
  const [thresholdPercentage, setThresholdPercentage] = useState(100)

  useEffect(() => {
    filterMaterials()
  }, [materials, filterName, thresholdPercentage])

  const filterMaterials = () => {
    let filtered = materials.filter(material => 
      (material.name.toLowerCase().includes(filterName.toLowerCase()) ||
      material.variant.toLowerCase().includes(filterName.toLowerCase())) &&
      material.qty <= (material.threshold * thresholdPercentage / 100)
    )

    setFilteredMaterials(filtered)
  }

  const handleComplete = (index: number) => {
    const updatedMaterials = [...materials]
    updatedMaterials.splice(index, 1)
    setMaterials(updatedMaterials)
  }

  const getRowColor = (qty: number, threshold: number) => {
    const percentage = (qty / threshold) * 100
    if (percentage <= 25) return 'bg-red-100 hover:bg-red-200'
    if (percentage <= 50) return 'bg-yellow-100 hover:bg-yellow-200'
    return 'bg-green-100 hover:bg-green-200'
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Material Queue</h1>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          placeholder="Filter by name or variant"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex items-center gap-2">
          <span>Threshold %:</span>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[thresholdPercentage]}
            onValueChange={(value) => setThresholdPercentage(value[0])}
            className="w-[200px]"
          />
          <span>{thresholdPercentage}%</span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material Name</TableHead>
            <TableHead>Variant</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Threshold</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMaterials.map((material, index) => (
            <TableRow key={index} className={`transition-colors ${getRowColor(material.qty, material.threshold)}`}>
              <TableCell>{material.name}</TableCell>
              <TableCell>{material.variant}</TableCell>
              <TableCell>{material.qty}</TableCell>
              <TableCell>{material.threshold}</TableCell>
              <TableCell>{format(new Date(material.lastUpdated), 'yyyy-MM-dd')}</TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleComplete(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
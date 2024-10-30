'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
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
  qty: number
  threshold: number
  lastUpdated: string
}

const sampleMaterials: Material[] = [
  { name: "Gildan H000 White M", qty: 5, threshold: 10, lastUpdated: "2024-10-28" },
  { name: "Gildan H000 Navy L", qty: 8, threshold: 15, lastUpdated: "2024-10-26" },
  { name: "Gildan H000 Black M", qty: 5, threshold: 15, lastUpdated: "2024-10-26" },
  { name: "Gildan H000 Black S", qty: 0, threshold: 20, lastUpdated: "2024-10-29" },
  { name: "Gildan H000 Heather Grey M", qty: 3, threshold: 10, lastUpdated: "2024-10-30" },
  { name: "Gildan H000 Maroon L", qty: 7, threshold: 15, lastUpdated: "2024-10-31" },
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
      material.name.toLowerCase().includes(filterName.toLowerCase()) &&
      material.qty <= (material.threshold * thresholdPercentage / 100)
    )

    setFilteredMaterials(filtered)
  }

  const handleRemove = (index: number) => {
    const updatedMaterials = [...materials]
    updatedMaterials.splice(index, 1)
    setMaterials(updatedMaterials)
  }

  const getRowColor = (qty: number) => {
    return qty === 0 ? 'bg-red-100 hover:bg-red-200' : ''
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Material Queue</h1>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          placeholder="Filter by material name"
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
            <TableHead>Quantity</TableHead>
            <TableHead>Threshold</TableHead>
            <TableHead>Quantity Below Threshold</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMaterials.map((material, index) => (
            <TableRow key={index} className={`transition-colors ${getRowColor(material.qty)}`}>
              <TableCell>{material.name}</TableCell>
              <TableCell>{material.qty}</TableCell>
              <TableCell>{material.threshold}</TableCell>
              <TableCell>{Math.max(material.threshold - material.qty, 0)}</TableCell>
              <TableCell>{format(new Date(material.lastUpdated), 'yyyy-MM-dd')}</TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleRemove(index)}>
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
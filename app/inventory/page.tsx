'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Package, AlertTriangle, DollarSign, ShoppingCart, Pencil, Trash2, Plus, Upload, Minus } from 'lucide-react'

// Mock data for demonstration
const mockMaterials = [
  { id: 1, name: 'Cotton Fabric', category: 'Fabric', quantity: 500, unit: 'yards', buyingPrice: 5, threshold: 100, supplier: 'Fabric Co', buyLink: 'https://fabricco.com', status: 'In-stock', image: null },
  { id: 2, name: 'Buttons', category: 'Accessories', quantity: 1000, unit: 'pcs', buyingPrice: 0.1, threshold: 200, supplier: 'Button World', buyLink: 'https://buttonworld.com', status: 'Low stock', image: null },
]

export default function InventoryPage() {
  const [materials, setMaterials] = useState(mockMaterials)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState(null)
  const [categories, setCategories] = useState(['Fabric', 'Accessories', 'Thread'])
  const [newCategory, setNewCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)

  const addMaterial = (newMaterial) => {
    setMaterials([...materials, { 
      ...newMaterial, 
      id: materials.length + 1,
      buyingPrice: Number(newMaterial.buyingPrice),
      quantity: Number(newMaterial.quantity),
      threshold: Number(newMaterial.threshold),
      image: selectedImage
    }])
    setIsAddModalOpen(false)
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
    }
    setNewCategory('')
    setSelectedCategory('')
    setSelectedImage(null)
  }

  const updateMaterial = (updatedMaterial) => {
    setMaterials(materials.map(material => 
      material.id === updatedMaterial.id ? { ...updatedMaterial, buyingPrice: Number(updatedMaterial.buyingPrice), quantity: Number(updatedMaterial.quantity), threshold: Number(updatedMaterial.threshold) } : material
    ))
    setIsEditModalOpen(false)
    setEditingMaterial(null)
  }

  const deleteMaterial = (id) => {
    setMaterials(materials.filter(material => material.id !== id))
  }

  const handleCategoryChange = (value) => {
    if (value === 'new') {
      setSelectedCategory('new')
    } else {
      setSelectedCategory(value)
      setNewCategory('')
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    setMaterials(materials.map(material => 
      material.id === id ? { ...material, quantity: Math.max(0, newQuantity) } : material
    ))
  }

  const openEditModal = (material) => {
    setEditingMaterial(material)
    setSelectedCategory(material.category)
    setSelectedImage(material.image)
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-6 p-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">items in inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.filter(m => m.status === 'Low stock').length}</div>
            <p className="text-xs text-muted-foreground">items below threshold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${materials.reduce((sum, m) => sum + (typeof m.buyingPrice === 'number' ? m.buyingPrice : Number(m.buyingPrice)) * m.quantity, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">total inventory value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length}
            </div>
            <p className="text-xs text-muted-foreground">unique categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#20214F]">
              <Plus className="mr-2 h-4 w-4" /> Add Material
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Material</DialogTitle>
              <DialogDescription>
                Enter the details of the new material here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const newMaterial = Object.fromEntries(formData)
              if (selectedCategory === 'new') {
                newMaterial.category = newCategory
              }
              addMaterial(newMaterial)
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" /> Upload Image
                    </Button>
                    {selectedImage && (
                      <div className="mt-2">
                        <Image
                          src={selectedImage}
                          alt="Selected material"
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" name="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select name="category" onValueChange={handleCategoryChange} value={selectedCategory}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                      <SelectItem value="new">Create new category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedCategory === 'new' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newCategory" className="text-right">
                      New Category
                    </Label>
                    <Input
                      id="newCategory"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input id="quantity" name="quantity" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit" className="text-right">
                    Unit
                  </Label>
                  <Input id="unit" name="unit" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="buyingPrice" className="text-right">
                    Buying Price
                  </Label>
                  <Input id="buyingPrice" name="buyingPrice" type="number" step="0.01" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="threshold" className="text-right">
                    Threshold
                  </Label>
                  <Input id="threshold" name="threshold" type="number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplier" className="text-right">
                    Supplier
                  </Label>
                  <Input id="supplier" name="supplier" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="buyLink" className="text-right">
                    Buy Link
                  </Label>
                  <Input id="buyLink" name="buyLink" type="url" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Material</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Buying Price</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell>
                  <Image
                    src={material.image || "/placeholder.svg?height=40&width=40"}
                    alt={material.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell>{material.category}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(material.id, material.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={material.quantity}
                      onChange={(e) => updateQuantity(material.id,   parseInt(e.target.value, 10))}
                      className="w-20 text-center"
                    />
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(material.id, material.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {material.unit}
                </TableCell>
                <TableCell>
                  ${typeof material.buyingPrice === 'number' 
                    ? material.buyingPrice.toFixed(2) 
                    : Number(material.buyingPrice).toFixed(2)}
                </TableCell>
                <TableCell>{material.threshold} {material.unit}</TableCell>
                <TableCell>
                  <a href={material.buyLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {material.supplier}
                  </a>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    material.status === 'In-stock' ? 'bg-green-100 text-green-800' : 
                    material.status === 'Low stock' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {material.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(material)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the material
                          from your inventory.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMaterial(material.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
            <DialogDescription>
              Make changes to the material here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingMaterial && (
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const updatedMaterial = Object.fromEntries(formData)
              updateMaterial({ ...editingMaterial, ...updatedMaterial })
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-image" className="text-right">
                    Image
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current.click()}
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" /> Upload Image
                    </Button>
                    {(selectedImage || editingMaterial.image) && (
                      <div className="mt-2">
                        <Image
                          src={selectedImage || editingMaterial.image || "/placeholder.svg?height=100&width=100"}
                          alt="Selected material"
                          width={100}
                          height={100}
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input id="edit-name" name="name" defaultValue={editingMaterial.name} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-category" className="text-right">
                    Category
                  </Label>
                  <Select name="category" onValueChange={handleCategoryChange} defaultValue={editingMaterial.category}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                      <SelectItem value="new">Create new category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedCategory === 'new' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-newCategory" className="text-right">
                      New Category
                    </Label>
                    <Input
                      id="edit-newCategory"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-quantity" className="text-right">
                    Quantity
                  </Label>
                  <Input id="edit-quantity" name="quantity" type="number" defaultValue={editingMaterial.quantity} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-unit" className="text-right">
                    Unit
                  </Label>
                  <Input id="edit-unit" name="unit" defaultValue={editingMaterial.unit} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-buyingPrice" className="text-right">
                    Buying Price
                  </Label>
                  <Input id="edit-buyingPrice" name="buyingPrice" type="number" step="0.01" defaultValue={editingMaterial.buyingPrice} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-threshold" className="text-right">
                    Threshold
                  </Label>
                  <Input id="edit-threshold" name="threshold" type="number" defaultValue={editingMaterial.threshold} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-supplier" className="text-right">
                    Supplier
                  </Label>
                  <Input id="edit-supplier" name="supplier" defaultValue={editingMaterial.supplier} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-buyLink" className="text-right">
                    Buy Link
                  </Label>
                  <Input id="edit-buyLink" name="buyLink" type="url" defaultValue={editingMaterial.buyLink} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
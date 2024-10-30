'use client'

import { useState } from 'react'
import { Edit, Trash2, Plus, X, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

type Variant = {
  name: string
  price: number
  buffer: number
  supplies: { name: string; quantity: number }[]
}

type Product = {
  id: string
  title: string
  description: string
  category: string
  variants: Variant[]
  images: string[]
}

const categories = ['T-Shirts', 'Hoodies', 'Mugs', 'Posters', 'Other']

// Sample data - in a real application, this would come from an API
const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'USC Swoosh Design',
    description: 'Embroidered Swoosh Design',
    category: 'T-Shirts',
    variants: [
      { name: 'Small', price: 19.99, buffer: 10, supplies: [{ name: 'Fabric', quantity: 1 }] },
      { name: 'Medium', price: 19.99, buffer: 15, supplies: [{ name: 'Fabric', quantity: 1.2 }] },
      { name: 'Large', price: 21.99, buffer: 12, supplies: [{ name: 'Fabric', quantity: 1.4 }] },
    ],
    images: ['/images/swoosh4.png'],
  },
  {
    id: '2',
    title: 'I <3 USC moms',
    description: 'Warm and cozy hoodie for cold days',
    category: 'Hoodies',
    variants: [
      { name: 'Small', price: 39.99, buffer: 8, supplies: [{ name: 'Fabric', quantity: 2 }] },
      { name: 'Medium', price: 39.99, buffer: 10, supplies: [{ name: 'Fabric', quantity: 2.2 }] },
      { name: 'Large', price: 42.99, buffer: 8, supplies: [{ name: 'Fabric', quantity: 2.4 }] },
    ],
    images: ['/images/uscmoms.jpg'],
  },
]

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('title')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredProducts = products
    .filter(product => 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'All' || product.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      } else if (sortBy === 'price') {
        return a.variants[0].price - b.variants[0].price
      }
      return 0
    })

  const handleDelete = (id: string) => {
    setProducts(products.filter(product => product.id !== id))
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleSave = (updatedProduct: Product) => {
    if (updatedProduct.id) {
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
    } else {
      const newProduct = { ...updatedProduct, id: Date.now().toString() }
      setProducts([...products, newProduct])
    }
    setIsDialogOpen(false)
    setEditingProduct(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, product: Product) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file))
      const updatedProduct = { ...product, images: [...product.images, ...newImages] }
      setEditingProduct(updatedProduct)
    }
  }

  const removeImage = (index: number, product: Product) => {
    const updatedImages = product.images.filter((_, i) => i !== index)
    const updatedProduct = { ...product, images: updatedImages }
    setEditingProduct(updatedProduct)
  }

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map(product => (
        <Card key={product.id}>
          <CardHeader>
            <CardTitle>{product.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <img src={product.images[0]} alt={product.title} className="w-full h-48 object-cover mb-4 rounded-md" />
            <p className="text-sm text-gray-500 mb-2">{product.description}</p>
            <Badge>{product.category}</Badge>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              <p className="font-bold">${product.variants[0].price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{product.variants.length} variants</p>
            </div>
            <div>
              <Button variant="outline" size="icon" className="mr-2" onClick={() => handleEdit(product)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )

  const ListView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredProducts.map(product => (
          <TableRow key={product.id}>
            <TableCell>
              <img src={product.images[0]} alt={product.title} className="w-16 h-16 object-cover rounded-md" />
            </TableCell>
            <TableCell>{product.title}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>${product.variants[0].price.toFixed(2)}</TableCell>
            <TableCell>
              <Button variant="outline" size="icon" className="mr-2" onClick={() => handleEdit(product)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const ProductForm = ({ product }: { product: Product | null }) => {
    const [formData, setFormData] = useState<Product>(
      product || {
        id: '',
        title: '',
        description: '',
        category: '',
        variants: [],
        images: [],
      }
    )

    const [newVariant, setNewVariant] = useState<Variant>({ name: '', price: 0, buffer: 0, supplies: [] })
    const [newSupply, setNewSupply] = useState({ name: '', quantity: 0 })

    const addVariant = () => {
      if (newVariant.name) {
        setFormData(prev => ({
          ...prev,
          variants: [...prev.variants, newVariant]
        }))
        setNewVariant({ name: '', price: 0, buffer: 0, supplies: [] })
      }
    }

    const removeVariant = (index: number) => {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index)
      }))
    }

    const addSupply = (variantIndex: number) => {
      if (newSupply.name && newSupply.quantity > 0) {
        setFormData(prev => ({
          ...prev,
          variants: prev.variants.map((v, i) => 
            i === variantIndex 
              ? { ...v, supplies: [...v.supplies, newSupply] }
              : v
          )
        }))
        setNewSupply({ name: '', quantity: 0 })
      }
    }

    const removeSupply = (variantIndex: number, supplyIndex: number) => {
      setFormData(prev => ({
        ...prev,
        variants: prev.variants.map((v, i) => 
          i === variantIndex 
            ? { ...v, supplies: v.supplies.filter((_, j) => j !== supplyIndex) }
            : v
        )
      }))
    }

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            value={formData.title} 
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={formData.description} 
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={value => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Images</Label>
          <div className="flex flex-wrap gap-4 mt-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image} alt={`Product ${index + 1}`} className="w-24 h-24 object-cover rounded" />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-0 right-0" 
                  onClick={() => removeImage(index, formData)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Label htmlFor="image-upload" className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center cursor-pointer">
              <Upload className="h-8 w-8" />
              <input 
                id="image-upload" 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                onChange={e => handleImageUpload(e, formData)}
              />
            </Label>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Variants</h3>
          {formData.variants.map((variant, index) => (
            <Card key={index} className="mb-4">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-md font-medium">{variant.name}</h4>
                  <Button variant="destructive" size="sm" onClick={() => removeVariant(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label>Price</Label>
                    <Input type="number" value={variant.price} onChange={e => {
                      const newVariants = [...formData.variants]
                      newVariants[index].price = Number(e.target.value)
                      setFormData(prev => ({ ...prev, variants: newVariants }))
                    }} />
                  </div>
                  <div>
                    <Label>Buffer</Label>
                    <Input type="number" value={variant.buffer} onChange={e => {
                      const newVariants = [...formData.variants]
                      newVariants[index].buffer = Number(e.target.value)
                      setFormData(prev => ({ ...prev, variants: newVariants }))
                    }} />
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Supplies</h5>
                  {variant.supplies.map((supply, supplyIndex) => (
                    <div key={supplyIndex} className="flex items-center gap-2 mb-2">
                      <Input value={supply.name} readOnly className="flex-grow" />
                      <Input type="number" value={supply.quantity} readOnly className="w-24" />
                      <Button variant="destructive" size="icon" onClick={() => removeSupply(index, supplyIndex)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-end gap-2  mt-2">
                    <div className="flex-grow">
                      <Label htmlFor={`supply-name-${index}`}>Supply Name</Label>
                      <Input 
                        id={`supply-name-${index}`}
                        value={newSupply.name} 
                        onChange={e => setNewSupply(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`supply-quantity-${index}`}>Quantity</Label>
                      <Input 
                        id={`supply-quantity-${index}`}
                        type="number" 
                        value={newSupply.quantity} 
                        onChange={e => setNewSupply(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                      />
                    </div>
                    <Button onClick={() => addSupply(index)}>Add Supply</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="mb-4">
            <CardContent className="pt-6">
              <h4 className="text-md font-medium mb-4">Add New Variant</h4>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="variant-name">Name</Label>
                  <Input 
                    id="variant-name"
                    value={newVariant.name} 
                    onChange={e => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="variant-price">Price</Label>
                  <Input 
                    id="variant-price"
                    type="number" 
                    value={newVariant.price} 
                    onChange={e => setNewVariant(prev => ({ ...prev, price: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="variant-buffer">Buffer</Label>
                  <Input 
                    id="variant-buffer"
                    type="number" 
                    value={newVariant.buffer} 
                    onChange={e => setNewVariant(prev => ({ ...prev, buffer: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <Button onClick={addVariant}>Add Variant</Button>
            </CardContent>
          </Card>
        </div>

        <Button onClick={() => handleSave(formData)} className="w-full">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Products Management</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? <GridView /> : <ListView />}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setEditingProduct(null)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Make changes to the product here.' : 'Add the details of your new product here.'}
            </DialogDescription>
          </DialogHeader>
          <ProductForm product={editingProduct} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
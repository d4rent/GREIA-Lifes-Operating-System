'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/contexts/auth-context'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface PropertyListing {
  id: string
  title: string
  description: string
  price: number
  type: 'RENTAL' | 'SALE' | 'ROOM' | 'COMMERCIAL'
  status: 'ACTIVE' | 'PENDING' | 'SOLD' | 'RENTED' | 'EXPIRED' | 'DRAFT'
  location: string
  latitude: number
  longitude: number
  propertyType: string
  bedrooms: number
  bathrooms: number
  area: number
  furnished: boolean
  media: {
    id: string
    type: 'IMAGE' | 'VIDEO'
    url: string
    thumbnail?: string
  }[]
  user: {
    id: string
    name: string
    image: string
  }
  createdAt: string
  viewCount: number
  bookmarkCount: number
  inquiryCount: number
}

export default function PropertyPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [listings, setListings] = useState<PropertyListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    type: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    furnished: '',
    location: '',
  })
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    type: 'RENTAL',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    furnished: false,
    location: '',
    media: [] as File[],
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchListings()
  }, [user, filters])

  const fetchListings = async () => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value)
      })

      const response = await fetch(`/api/listings/property?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch listings')
      const data = await response.json()
      setListings(data)
      setLoading(false)
    } catch (error) {
      setError('Error loading listings')
      setLoading(false)
    }
  }

  const handleCreateListing = async () => {
    try {
      const formData = new FormData()
      Object.entries(newListing).forEach(([key, value]) => {
        if (key === 'media') {
          value.forEach((file: File) => {
            formData.append('media', file)
          })
        } else {
          formData.append(key, value.toString())
        }
      })

      const response = await fetch('/api/listings/property', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to create listing')

      setShowCreateDialog(false)
      setNewListing({
        title: '',
        description: '',
        price: '',
        type: 'RENTAL',
        propertyType: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        furnished: false,
        location: '',
        media: [],
      })
      fetchListings()
    } catch (error) {
      setError('Error creating listing')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Property Listings</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>Create Listing</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Property Listing</DialogTitle>
              <DialogDescription>
                Fill in the details for your property listing
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={newListing.title}
                onChange={(e) =>
                  setNewListing({ ...newListing, title: e.target.value })
                }
              />
              <Input
                placeholder="Description"
                value={newListing.description}
                onChange={(e) =>
                  setNewListing({ ...newListing, description: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Price"
                value={newListing.price}
                onChange={(e) =>
                  setNewListing({ ...newListing, price: e.target.value })
                }
              />
              <Select
                value={newListing.type}
                onValueChange={(value) =>
                  setNewListing({ ...newListing, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RENTAL">Rental</SelectItem>
                  <SelectItem value="SALE">Sale</SelectItem>
                  <SelectItem value="ROOM">Room</SelectItem>
                  <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Property Type"
                value={newListing.propertyType}
                onChange={(e) =>
                  setNewListing({ ...newListing, propertyType: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Bedrooms"
                  value={newListing.bedrooms}
                  onChange={(e) =>
                    setNewListing({ ...newListing, bedrooms: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Bathrooms"
                  value={newListing.bathrooms}
                  onChange={(e) =>
                    setNewListing({ ...newListing, bathrooms: e.target.value })
                  }
                />
              </div>
              <Input
                type="number"
                placeholder="Area (sq ft)"
                value={newListing.area}
                onChange={(e) =>
                  setNewListing({ ...newListing, area: e.target.value })
                }
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newListing.furnished}
                  onChange={(e) =>
                    setNewListing({ ...newListing, furnished: e.target.checked })
                  }
                />
                <label>Furnished</label>
              </div>
              <Input
                placeholder="Location"
                value={newListing.location}
                onChange={(e) =>
                  setNewListing({ ...newListing, location: e.target.value })
                }
              />
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) =>
                    setNewListing({
                      ...newListing,
                      media: Array.from(e.target.files || []),
                    })
                  }
                />
                {newListing.media.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {newListing.media.map((file, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt="Property"
                          width={100}
                          height={100}
                          className="rounded object-cover"
                        />
                        <button
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6"
                          onClick={() =>
                            setNewListing({
                              ...newListing,
                              media: newListing.media.filter((_, i) => i !== index),
                            })
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleCreateListing}>Create Listing</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              value={filters.type}
              onValueChange={(value) =>
                setFilters({ ...filters, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="RENTAL">Rental</SelectItem>
                <SelectItem value="SALE">Sale</SelectItem>
                <SelectItem value="ROOM">Room</SelectItem>
                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Min Price"
              type="number"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
            />
            <Input
              placeholder="Max Price"
              type="number"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />
            <Input
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
            <Select
              value={filters.bedrooms}
              onValueChange={(value) =>
                setFilters({ ...filters, bedrooms: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.bathrooms}
              onValueChange={(value) =>
                setFilters({ ...filters, bathrooms: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Bathrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.furnished}
              onValueChange={(value) =>
                setFilters({ ...filters, furnished: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Furnished" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <div className="relative h-48">
              {listing.media[0] && (
                <Image
                  src={listing.media[0].url}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              )}
              <Badge
                className="absolute top-2 right-2"
                variant={listing.type === 'RENTAL' ? 'default' : 'secondary'}
              >
                {listing.type}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">
                  ${listing.price.toLocaleString()}
                  {listing.type === 'RENTAL' && '/mo'}
                </span>
                <div className="flex items-center space-x-2 text-gray-500">
                  <span>👁️ {listing.viewCount}</span>
                  <span>⭐ {listing.bookmarkCount}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-2 text-gray-600">
                <span>🛏️ {listing.bedrooms} beds</span>
                <span>🚿 {listing.bathrooms} baths</span>
                <span>📏 {listing.area} sqft</span>
              </div>
              <p className="text-gray-600 mb-4">{listing.location}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Image
                    src={listing.user.image}
                    alt={listing.user.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm">{listing.user.name}</span>
                </div>
                <Button variant="outline" size="sm">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
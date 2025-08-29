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

interface LeisureListing {
  id: string
  title: string
  description: string
  price: number
  type: 'LEISURE'
  category: 'EVENT' | 'ACTIVITY' | 'TOUR' | 'CLASS'
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'DRAFT'
  location: string
  latitude: number
  longitude: number
  eventType: string
  startDate: string
  endDate: string
  capacity: number
  registeredCount: number
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

export default function LeisurePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [listings, setListings] = useState<LeisureListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    startDate: '',
    endDate: '',
  })
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    eventType: '',
    location: '',
    startDate: '',
    endDate: '',
    capacity: '',
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

      const response = await fetch(`/api/listings/leisure?${queryParams}`)
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

      const response = await fetch('/api/listings/leisure', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to create listing')

      setShowCreateDialog(false)
      setNewListing({
        title: '',
        description: '',
        price: '',
        category: '',
        eventType: '',
        location: '',
        startDate: '',
        endDate: '',
        capacity: '',
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
        <h1 className="text-2xl font-bold">Leisure & Events</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>Create Event/Activity</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Event/Activity Listing</DialogTitle>
              <DialogDescription>
                Fill in the details for your event or activity
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
                value={newListing.category}
                onValueChange={(value) =>
                  setNewListing({ ...newListing, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EVENT">Event</SelectItem>
                  <SelectItem value="ACTIVITY">Activity</SelectItem>
                  <SelectItem value="TOUR">Tour</SelectItem>
                  <SelectItem value="CLASS">Class</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Event Type"
                value={newListing.eventType}
                onChange={(e) =>
                  setNewListing({ ...newListing, eventType: e.target.value })
                }
              />
              <Input
                placeholder="Location"
                value={newListing.location}
                onChange={(e) =>
                  setNewListing({ ...newListing, location: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Start Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={newListing.startDate}
                    onChange={(e) =>
                      setNewListing({ ...newListing, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm">End Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={newListing.endDate}
                    onChange={(e) =>
                      setNewListing({ ...newListing, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <Input
                type="number"
                placeholder="Capacity"
                value={newListing.capacity}
                onChange={(e) =>
                  setNewListing({ ...newListing, capacity: e.target.value })
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
                          alt="Event"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="EVENT">Events</SelectItem>
                <SelectItem value="ACTIVITY">Activities</SelectItem>
                <SelectItem value="TOUR">Tours</SelectItem>
                <SelectItem value="CLASS">Classes</SelectItem>
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
            <Input
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
            <Input
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
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
              <Badge className="absolute top-2 right-2">
                {listing.category}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-2">{listing.title}</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">
                  ${listing.price.toLocaleString()}
                </span>
                <div className="flex items-center space-x-2 text-gray-500">
                  <span>👁️ {listing.viewCount}</span>
                  <span>⭐ {listing.bookmarkCount}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{listing.location}</p>
              <div className="mb-4">
                <div className="text-sm text-gray-600">
                  {new Date(listing.startDate).toLocaleDateString()} - {new Date(listing.endDate).toLocaleDateString()}
                  <br />
                  {new Date(listing.startDate).toLocaleTimeString()} - {new Date(listing.endDate).toLocaleTimeString()}
                </div>
                <div className="mt-2 text-sm">
                  {listing.registeredCount} / {listing.capacity} spots taken
                </div>
              </div>
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
                  Register
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
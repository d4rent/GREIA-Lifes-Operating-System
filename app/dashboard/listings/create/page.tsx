'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/auth-context'
import { ListingType, ListingCategory } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectOption } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/image-upload'

interface ListingFormData {
  title: string
  description: string
  type: ListingType
  category: ListingCategory
  price: string
  currency: string
  location: string
  images: string[]
  features: Record<string, any>
}

const LISTING_TYPE_LABELS = {
  [ListingType.RENTAL]: 'Rental Property',
  [ListingType.SALE]: 'Property for Sale',
  [ListingType.SERVICE]: 'Professional Service',
  [ListingType.EVENT]: 'Event/Experience',
  [ListingType.PRODUCT]: 'Product',
  [ListingType.TICKET]: 'Event Ticket',
  [ListingType.BOOKING]: 'Appointment/Service Booking'
}

const CATEGORY_LABELS = {
  [ListingCategory.PROPERTY]: 'Real Estate',
  [ListingCategory.AUTOMOTIVE]: 'Automotive',
  [ListingCategory.PROFESSIONAL]: 'Professional Services',
  [ListingCategory.ENTERTAINMENT]: 'Entertainment',
  [ListingCategory.TRAVEL]: 'Travel',
  [ListingCategory.RETAIL]: 'Retail',
  [ListingCategory.OTHER]: 'Other'
}

export default function CreateListingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    type: ListingType.RENTAL,
    category: ListingCategory.PROPERTY,
    price: '',
    currency: 'USD',
    location: '',
    images: [],
    features: {}
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }))
  }

  const handleFeatureChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [name]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to create listing')
      }

      const data = await response.json()
      router.push(`/dashboard/listings/${data.id}`)
    } catch (error) {
      setError('An error occurred while creating the listing')
    } finally {
      setLoading(false)
    }
  }

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case ListingType.RENTAL:
      case ListingType.SALE:
        return (
          <>
            <div className="space-y-2">
              <Label>Property Details</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="bedrooms"
                  type="number"
                  placeholder="Bedrooms"
                  onChange={e => handleFeatureChange('bedrooms', e.target.value)}
                />
                <Input
                  name="bathrooms"
                  type="number"
                  placeholder="Bathrooms"
                  onChange={e => handleFeatureChange('bathrooms', e.target.value)}
                />
                <Input
                  name="area"
                  type="number"
                  placeholder="Area (sq ft)"
                  onChange={e => handleFeatureChange('area', e.target.value)}
                />
              </div>
            </div>
          </>
        )
      case ListingType.SERVICE:
      case ListingType.BOOKING:
        return (
          <>
            <div className="space-y-2">
              <Label>Service Details</Label>
              <Input
                name="duration"
                placeholder="Duration (e.g., 1 hour)"
                onChange={e => handleFeatureChange('duration', e.target.value)}
              />
              <Input
                name="availability"
                placeholder="Availability (e.g., Mon-Fri 9-5)"
                onChange={e => handleFeatureChange('availability', e.target.value)}
              />
            </div>
          </>
        )
      // Add more type-specific fields as needed
      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="type">Listing Type</Label>
              <Select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                {Object.entries(LISTING_TYPE_LABELS).map(([value, label]) => (
                  <SelectOption key={value} value={value}>{label}</SelectOption>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectOption key={value} value={value}>{label}</SelectOption>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <SelectOption value="USD">USD</SelectOption>
                  <SelectOption value="EUR">EUR</SelectOption>
                  <SelectOption value="GBP">GBP</SelectOption>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {renderTypeSpecificFields()}

            <div className="space-y-2">
              <Label>Images</Label>
              <ImageUpload
                onUpload={handleImageUpload}
                maxFiles={5}
                accept="image/*"
              />
              <div className="grid grid-cols-4 gap-4 mt-2">
                {formData.images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Listing image ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
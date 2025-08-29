'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/contexts/auth-context'
import { Listing, User, InquiryType } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectOption } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface ListingWithOwner extends Listing {
  owner: Pick<User, 'id' | 'name' | 'image'>
}

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [listing, setListing] = useState<ListingWithOwner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [inquiryType, setInquiryType] = useState<InquiryType>('INFORMATION')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch listing')
        const data = await response.json()
        setListing(data)
      } catch (error) {
        setError('Error loading listing')
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [params.id])

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      router.push('/auth/signin')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: inquiryType,
          message,
          listingId: listing?.id,
          receiverId: listing?.ownerId
        })
      })

      if (!response.ok) throw new Error('Failed to submit inquiry')

      // Clear form and show success message
      setMessage('')
      setInquiryType('INFORMATION')
      alert('Inquiry submitted successfully')
    } catch (error) {
      setError('Failed to submit inquiry')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!listing) return <div>Listing not found</div>

  const renderTransactionButton = () => {
    switch (listing.type) {
      case 'RENTAL':
        return (
          <Button
            onClick={() => setInquiryType('BOOKING_REQUEST')}
            className="w-full"
          >
            Book Now
          </Button>
        )
      case 'SALE':
        return (
          <Button
            onClick={() => setInquiryType('PURCHASE_INTENT')}
            className="w-full"
          >
            Make an Offer
          </Button>
        )
      case 'SERVICE':
      case 'BOOKING':
        return (
          <Button
            onClick={() => setInquiryType('BOOKING_REQUEST')}
            className="w-full"
          >
            Book Service
          </Button>
        )
      case 'TICKET':
        return (
          <Button
            onClick={() => setInquiryType('PURCHASE_INTENT')}
            className="w-full"
          >
            Purchase Ticket
          </Button>
        )
      default:
        return (
          <Button
            onClick={() => setInquiryType('INFORMATION')}
            className="w-full"
          >
            Contact Seller
          </Button>
        )
    }
  }

  const renderListingDetails = () => {
    const features = listing.features as Record<string, any>

    switch (listing.type) {
      case 'RENTAL':
      case 'SALE':
        return (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-lg font-bold">{features.bedrooms}</p>
              <p className="text-sm text-gray-500">Bedrooms</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{features.bathrooms}</p>
              <p className="text-sm text-gray-500">Bathrooms</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{features.area}</p>
              <p className="text-sm text-gray-500">Sq Ft</p>
            </div>
          </div>
        )
      case 'SERVICE':
      case 'BOOKING':
        return (
          <div className="mb-6">
            <p className="mb-2">
              <span className="font-bold">Duration:</span> {features.duration}
            </p>
            <p>
              <span className="font-bold">Availability:</span> {features.availability}
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Listing Details */}
        <div className="md:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <p className="text-gray-500">{listing.location}</p>
          </div>

          <div className="mb-6">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              {listing.images[0] && (
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  fill
                  className="rounded-lg object-cover"
                />
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {listing.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-w-1 aspect-h-1">
                  <Image
                    src={image}
                    alt={`${listing.title} ${index + 2}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {renderListingDetails()}

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p>{listing.description}</p>
          </div>
        </div>

        {/* Inquiry/Transaction Card */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {listing.price.toLocaleString()} {listing.currency}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInquiry} className="space-y-4">
                <div>
                  <Select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value as InquiryType)}
                  >
                    <SelectOption value="INFORMATION">General Inquiry</SelectOption>
                    <SelectOption value="VIEWING_REQUEST">Request Viewing</SelectOption>
                    <SelectOption value="BOOKING_REQUEST">Book Now</SelectOption>
                    <SelectOption value="PURCHASE_INTENT">Make Offer</SelectOption>
                  </Select>
                </div>

                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message to the seller..."
                  rows={4}
                  required
                />

                {renderTransactionButton()}
              </form>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center space-x-4">
                  {listing.owner.image && (
                    <Image
                      src={listing.owner.image}
                      alt={listing.owner.name || ''}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">{listing.owner.name}</p>
                    <p className="text-sm text-gray-500">Listed {new Date(listing.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
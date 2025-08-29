'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/contexts/auth-context'
import { Inquiry, Transaction, InquiryStatus, TransactionStatus } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectOption } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface InquiryWithDetails extends Inquiry {
  listing: {
    title: string
    type: string
    price: number
    currency: string
  }
  creator: {
    name: string
    email: string
    image: string | null
  }
  transaction?: {
    id: string
    status: TransactionStatus
    amount: number
    currency: string
  } | null
}

export default function CRMPage() {
  const { user } = useAuth()
  const [inquiries, setInquiries] = useState<InquiryWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryWithDetails | null>(null)
  const [noteContent, setNoteContent] = useState('')
  const [filter, setFilter] = useState({
    status: '',
    type: '',
    search: ''
  })

  useEffect(() => {
    fetchInquiries()
  }, [filter])

  const fetchInquiries = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.status) params.append('status', filter.status)
      if (filter.type) params.append('type', filter.type)

      const response = await fetch(`/api/inquiries?${params}`)
      if (!response.ok) throw new Error('Failed to fetch inquiries')
      const data = await response.json()
      setInquiries(data)
    } catch (error) {
      setError('Error loading inquiries')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (inquiryId: string, status: InquiryStatus) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) throw new Error('Failed to update status')
      fetchInquiries()
    } catch (error) {
      setError('Error updating inquiry status')
    }
  }

  const handleAddNote = async () => {
    if (!selectedInquiry || !noteContent) return

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: noteContent,
          type: 'GENERAL',
          inquiryId: selectedInquiry.id
        })
      })

      if (!response.ok) throw new Error('Failed to add note')
      setNoteContent('')
      // Refresh inquiry details
      const inquiryResponse = await fetch(`/api/inquiries/${selectedInquiry.id}`)
      if (inquiryResponse.ok) {
        const data = await inquiryResponse.json()
        setSelectedInquiry(data)
      }
    } catch (error) {
      setError('Error adding note')
    }
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      return (
        inquiry.listing.title.toLowerCase().includes(searchLower) ||
        inquiry.creator.name.toLowerCase().includes(searchLower) ||
        inquiry.creator.email.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const renderInquiryCard = (inquiry: InquiryWithDetails) => (
    <Card
      key={inquiry.id}
      className={`mb-4 cursor-pointer ${selectedInquiry?.id === inquiry.id ? 'border-primary' : ''}`}
      onClick={() => setSelectedInquiry(inquiry)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{inquiry.listing.title}</h3>
            <p className="text-sm text-gray-500">
              {inquiry.type.replace('_', ' ')} - {inquiry.status}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium">
              {inquiry.listing.price} {inquiry.listing.currency}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(inquiry.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {inquiry.creator.image && (
            <Image
              src={inquiry.creator.image}
              alt={inquiry.creator.name}
              width={32}
              height={32}
              className="rounded-full mr-2"
            />
          )}
          <div>
            <p className="text-sm font-medium">{inquiry.creator.name}</p>
            <p className="text-sm text-gray-500">{inquiry.creator.email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Lead Management</h1>
        <p className="text-gray-500">Manage your inquiries and track leads</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Filters and Inquiry List */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Search inquiries..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                />
                <Select
                  value={filter.status}
                  onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                >
                  <SelectOption value="">All Statuses</SelectOption>
                  <SelectOption value="PENDING">Pending</SelectOption>
                  <SelectOption value="ACCEPTED">Accepted</SelectOption>
                  <SelectOption value="REJECTED">Rejected</SelectOption>
                  <SelectOption value="CONVERTED">Converted</SelectOption>
                </Select>
                <Select
                  value={filter.type}
                  onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                >
                  <SelectOption value="">All Types</SelectOption>
                  <SelectOption value="BOOKING_REQUEST">Booking Request</SelectOption>
                  <SelectOption value="PURCHASE_INTENT">Purchase Intent</SelectOption>
                  <SelectOption value="VIEWING_REQUEST">Viewing Request</SelectOption>
                  <SelectOption value="INFORMATION">Information</SelectOption>
                </Select>
              </div>

              <div className="mt-4 space-y-4">
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  filteredInquiries.map(renderInquiryCard)
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inquiry Details */}
        <div className="col-span-2">
          {selectedInquiry ? (
            <Card>
              <CardHeader>
                <CardTitle>Inquiry Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="communication">Communication</TabsTrigger>
                    {selectedInquiry.transaction && (
                      <TabsTrigger value="transaction">Transaction</TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="details">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Status</h3>
                        <Select
                          value={selectedInquiry.status}
                          onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as InquiryStatus)}
                        >
                          <SelectOption value="PENDING">Pending</SelectOption>
                          <SelectOption value="ACCEPTED">Accepted</SelectOption>
                          <SelectOption value="REJECTED">Rejected</SelectOption>
                          <SelectOption value="CONVERTED">Converted</SelectOption>
                        </Select>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Message</h3>
                        <p className="text-gray-700">{selectedInquiry.message}</p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Add Note</h3>
                        <Textarea
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          placeholder="Add a note about this inquiry..."
                          rows={3}
                        />
                        <Button
                          onClick={handleAddNote}
                          className="mt-2"
                          disabled={!noteContent}
                        >
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="communication">
                    <div className="space-y-4">
                      <Button
                        onClick={() => {/* Implement message sending */}}
                        className="w-full"
                      >
                        Send Message
                      </Button>

                      {/* Message history would go here */}
                    </div>
                  </TabsContent>

                  {selectedInquiry.transaction && (
                    <TabsContent value="transaction">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Transaction Details</h3>
                          <p>Status: {selectedInquiry.transaction.status}</p>
                          <p>
                            Amount: {selectedInquiry.transaction.amount}{' '}
                            {selectedInquiry.transaction.currency}
                          </p>
                        </div>

                        <Button
                          onClick={() => {/* Implement payment processing */}}
                          className="w-full"
                        >
                          Process Payment
                        </Button>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select an inquiry to view details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
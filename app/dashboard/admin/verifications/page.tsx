'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/contexts/auth-context'
import { ProfessionalInfo, VerificationStatus, User } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectOption } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface VerificationWithUser extends ProfessionalInfo {
  user: Pick<User, 'id' | 'name' | 'email' | 'verificationStatus'>
}

export default function AdminVerificationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [verifications, setVerifications] = useState<VerificationWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedVerification, setSelectedVerification] = useState<VerificationWithUser | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState('')
  const [filter, setFilter] = useState<VerificationStatus | ''>('')

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
    fetchVerifications()
  }, [user, filter])

  const fetchVerifications = async () => {
    try {
      const params = new URLSearchParams()
      if (filter) params.append('status', filter)

      const response = await fetch(`/api/admin/verifications?${params}`)
      if (!response.ok) throw new Error('Failed to fetch verifications')
      const data = await response.json()
      setVerifications(data)
    } catch (error) {
      setError('Error loading verifications')
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationAction = async (
    verificationId: string,
    action: 'VERIFIED' | 'REJECTED'
  ) => {
    try {
      const response = await fetch(`/api/admin/verifications/${verificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: action,
          rejectionReason: action === 'REJECTED' ? rejectionReason : undefined
        })
      })

      if (!response.ok) throw new Error('Failed to update verification')
      
      // Refresh verifications list
      fetchVerifications()
      setSelectedVerification(null)
      setRejectionReason('')
    } catch (error) {
      setError('Error updating verification')
    }
  }

  const renderVerificationCard = (verification: VerificationWithUser) => (
    <Card
      key={verification.id}
      className={`mb-4 cursor-pointer ${selectedVerification?.id === verification.id ? 'border-primary' : ''}`}
      onClick={() => setSelectedVerification(verification)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{verification.user.name}</h3>
            <p className="text-sm text-gray-500">{verification.user.email}</p>
            <p className="text-sm mt-2">
              License: {verification.licenseType} - {verification.licenseNumber}
            </p>
          </div>
          <div className="text-right">
            <span className={`px-2 py-1 rounded text-sm ${
              verification.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              verification.status === 'VERIFIED' ? 'bg-green-100 text-green-800' :
              verification.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
              'bg-gray-100'
            }`}>
              {verification.status}
            </span>
            <p className="text-sm text-gray-500 mt-1">
              Submitted: {new Date(verification.submittedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Verification Requests</h1>
        <p className="text-gray-500">Review and manage professional verification requests</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Verification List */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value as VerificationStatus)}
                className="mb-4"
              >
                <SelectOption value="">All Status</SelectOption>
                <SelectOption value="PENDING">Pending</SelectOption>
                <SelectOption value="VERIFIED">Verified</SelectOption>
                <SelectOption value="REJECTED">Rejected</SelectOption>
              </Select>

              <div className="space-y-4">
                {verifications.map(renderVerificationCard)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Details */}
        <div className="col-span-2">
          {selectedVerification ? (
            <Card>
              <CardHeader>
                <CardTitle>Verification Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-1">License Type</h3>
                      <p>{selectedVerification.licenseType}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">License Number</h3>
                      <p>{selectedVerification.licenseNumber}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Jurisdiction</h3>
                      <p>{selectedVerification.jurisdiction}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">License Expiry</h3>
                      <p>{new Date(selectedVerification.licenseExpiry).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {selectedVerification.companyName && (
                    <div>
                      <h3 className="font-medium mb-1">Company Information</h3>
                      <p>{selectedVerification.companyName}</p>
                      <p className="text-sm text-gray-500">{selectedVerification.companyAddress}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium mb-2">Verification Documents</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedVerification.verificationDocuments.map((doc, index) => (
                        <div
                          key={index}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedDocument(doc)
                            setShowDocumentModal(true)
                          }}
                        >
                          {doc.endsWith('.pdf') ? (
                            <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                              <p className="text-sm">PDF Document {index + 1}</p>
                            </div>
                          ) : (
                            <Image
                              src={doc}
                              alt={`Document ${index + 1}`}
                              width={200}
                              height={150}
                              className="rounded object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedVerification.status === 'PENDING' && (
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Reason for rejection (required for rejecting)"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                      <div className="flex space-x-4">
                        <Button
                          onClick={() => handleVerificationAction(selectedVerification.id, 'VERIFIED')}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleVerificationAction(selectedVerification.id, 'REJECTED')}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                          disabled={!rejectionReason}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedVerification.status === 'REJECTED' && (
                    <div className="bg-red-50 p-4 rounded">
                      <h3 className="font-medium text-red-800 mb-1">Rejection Reason</h3>
                      <p className="text-red-600">{selectedVerification.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a verification request to review
            </div>
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      <Dialog open={showDocumentModal} onOpenChange={setShowDocumentModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedDocument.endsWith('.pdf') ? (
              <iframe
                src={selectedDocument}
                className="w-full h-[600px]"
                title="Document preview"
              />
            ) : (
              <Image
                src={selectedDocument}
                alt="Document preview"
                width={800}
                height={600}
                className="rounded object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
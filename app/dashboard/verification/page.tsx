'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { LicenseType, VerificationStatus } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectOption } from '@/components/ui/select'
import { ImageUpload } from '@/components/ui/image-upload'

interface VerificationFormData {
  licenseType: LicenseType
  licenseNumber: string
  licenseExpiry: string
  jurisdiction: string
  companyName: string
  companyAddress: string
  taxId: string
  insuranceInfo: string
  verificationDocuments: string[]
}

export default function VerificationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [verificationInfo, setVerificationInfo] = useState<any>(null)
  const [formData, setFormData] = useState<VerificationFormData>({
    licenseType: LicenseType.REAL_ESTATE_AGENT,
    licenseNumber: '',
    licenseExpiry: '',
    jurisdiction: '',
    companyName: '',
    companyAddress: '',
    taxId: '',
    insuranceInfo: '',
    verificationDocuments: []
  })

  useEffect(() => {
    fetchVerificationStatus()
  }, [])

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch('/api/verification/status')
      if (!response.ok) throw new Error('Failed to fetch verification status')
      const data = await response.json()
      setVerificationInfo(data)
      
      // Pre-fill form if verification exists
      if (data.professionalInfo) {
        setFormData({
          ...data.professionalInfo,
          licenseExpiry: new Date(data.professionalInfo.licenseExpiry)
            .toISOString()
            .split('T')[0]
        })
      }
    } catch (error) {
      setError('Error loading verification status')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDocumentUpload = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      verificationDocuments: [...prev.verificationDocuments, ...urls]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/verification/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to submit verification')

      // Refresh verification status
      await fetchVerificationStatus()
      alert('Verification submitted successfully')
    } catch (error) {
      setError('Error submitting verification')
    } finally {
      setSubmitting(false)
    }
  }

  const renderVerificationStatus = () => {
    if (!verificationInfo) return null

    const statusColors = {
      UNVERIFIED: 'bg-gray-100',
      PENDING: 'bg-yellow-100',
      VERIFIED: 'bg-green-100',
      REJECTED: 'bg-red-100',
      SUSPENDED: 'bg-orange-100',
      EXPIRED: 'bg-red-100'
    }

    return (
      <div className={`p-4 rounded-lg mb-6 ${statusColors[verificationInfo.verificationStatus]}`}>
        <h2 className="text-lg font-semibold mb-2">Verification Status</h2>
        <p className="mb-2">Status: {verificationInfo.verificationStatus}</p>
        {verificationInfo.verificationStatus === 'REJECTED' && (
          <p className="text-red-600">Reason: {verificationInfo.professionalInfo?.rejectionReason}</p>
        )}
        {verificationInfo.verificationStatus === 'VERIFIED' && (
          <div>
            <p>Verified on: {new Date(verificationInfo.professionalInfo?.verifiedAt).toLocaleDateString()}</p>
            <p>License expires: {new Date(verificationInfo.professionalInfo?.licenseExpiry).toLocaleDateString()}</p>
          </div>
        )}
      </div>
    )
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Professional Verification</h1>
      
      {renderVerificationStatus()}

      {verificationInfo?.verificationStatus !== 'VERIFIED' && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="licenseType">License Type</Label>
                <Select
                  id="licenseType"
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleChange}
                  required
                >
                  <SelectOption value={LicenseType.REAL_ESTATE_AGENT}>Real Estate Agent</SelectOption>
                  <SelectOption value={LicenseType.REAL_ESTATE_BROKER}>Real Estate Broker</SelectOption>
                  <SelectOption value={LicenseType.PROPERTY_MANAGER}>Property Manager</SelectOption>
                  <SelectOption value={LicenseType.CONTRACTOR}>Contractor</SelectOption>
                  <SelectOption value={LicenseType.BUSINESS_LICENSE}>Business License</SelectOption>
                  <SelectOption value={LicenseType.PROFESSIONAL_LICENSE}>Professional License</SelectOption>
                  <SelectOption value={LicenseType.OTHER}>Other</SelectOption>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseExpiry">License Expiry Date</Label>
                <Input
                  id="licenseExpiry"
                  name="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jurisdiction">Jurisdiction</Label>
                <Input
                  id="jurisdiction"
                  name="jurisdiction"
                  placeholder="State/Region where license is valid"
                  value={formData.jurisdiction}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input
                  id="companyAddress"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / Business Number</Label>
                <Input
                  id="taxId"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceInfo">Insurance Information</Label>
                <Input
                  id="insuranceInfo"
                  name="insuranceInfo"
                  value={formData.insuranceInfo}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Verification Documents</Label>
                <p className="text-sm text-gray-500 mb-2">
                  Please upload clear images/PDFs of your:
                  <br />• Professional license
                  <br />• Government ID
                  <br />• Insurance certificate (if applicable)
                  <br />• Business registration (if applicable)
                </p>
                <ImageUpload
                  onUpload={handleDocumentUpload}
                  maxFiles={5}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {formData.verificationDocuments.map((url, index) => (
                    <div key={index} className="relative">
                      {url.endsWith('.pdf') ? (
                        <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                          <p className="text-sm">PDF Document {index + 1}</p>
                        </div>
                      ) : (
                        <img
                          src={url}
                          alt={`Document ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Verification'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
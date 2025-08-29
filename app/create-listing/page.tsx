'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  Wrench, 
  Calendar, 
  Users, 
  Upload, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Camera,
  FileText,
  CreditCard,
  MapPin,
  Clock,
  Star
} from "lucide-react"
import Link from "next/link"

type ListingType = 'property' | 'service' | 'leisure' | 'social'

interface FormData {
  type: ListingType | null
  category: string
  title: string
  description: string
  location: string
  price: string
  images: File[]
  verificationDocs: File[]
  businessLicense: File[]
  idDocument: File[]
  profilePhoto: File[]
}

export default function CreateListing() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    type: null,
    category: '',
    title: '',
    description: '',
    location: '',
    price: '',
    images: [],
    verificationDocs: [],
    businessLicense: [],
    idDocument: [],
    profilePhoto: []
  })

  const totalSteps = 4
  const progress = (step / totalSteps) * 100

  const listingTypes = [
    {
      id: 'property' as ListingType,
      title: 'Properties',
      description: 'Buy, sell, or rent properties',
      icon: Building2,
      color: 'bg-blue-500',
      categories: ['Apartment', 'House', 'Commercial', 'Land', 'Vacation Rental']
    },
    {
      id: 'service' as ListingType,
      title: 'Services',
      description: 'Offer professional services',
      icon: Wrench,
      color: 'bg-green-500',
      categories: ['Plumbing', 'Electrical', 'Architecture', 'Legal', 'Financial', 'Consulting', 'Home Maintenance']
    },
    {
      id: 'leisure' as ListingType,
      title: 'Leisure',
      description: 'Events, experiences & entertainment',
      icon: Calendar,
      color: 'bg-purple-500',
      categories: ['Events', 'Restaurants', 'Tours', 'Car Rental', 'Art Gallery', 'Entertainment', 'Sports']
    },
    {
      id: 'social' as ListingType,
      title: 'Social',
      description: 'Organizations & networking',
      icon: Users,
      color: 'bg-orange-500',
      categories: ['Organization', 'Group', 'Community', 'Business Network', 'Club']
    }
  ]

  const getVerificationRequirements = (type: ListingType) => {
    const requirements = {
      property: [
        'Real Estate License',
        'Government ID',
        'Professional Photo',
        'Property Documentation'
      ],
      service: [
        'Professional License/Certification',
        'Government ID',
        'Professional Photo',
        'Insurance Documentation'
      ],
      leisure: [
        'Business License',
        'Government ID',
        'Professional Photo',
        'Venue/Event Documentation'
      ],
      social: [
        'Organization Registration',
        'Government ID',
        'Professional Photo',
        'Group/Company Documentation'
      ]
    }
    return requirements[type] || []
  }

  const handleFileUpload = (field: keyof FormData, files: FileList | null) => {
    if (files) {
      setFormData(prev => ({
        ...prev,
        [field]: Array.from(files)
      }))
    }
  }

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-semibold">greia</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Step {step} of {totalSteps}</Badge>
              <Button variant="ghost" asChild>
                <Link href="/">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Create Your Listing</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Choose Listing Type */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What would you like to list?</CardTitle>
              <CardDescription>
                Choose the type of listing you want to create. This will guide us through the verification process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {listingTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <div
                      key={type.id}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                        formData.type === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                    >
                      <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                      <p className="text-gray-600 mb-4">{type.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {type.categories.slice(0, 3).map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                        {type.categories.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{type.categories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-end mt-8">
                <Button 
                  onClick={nextStep} 
                  disabled={!formData.type}
                  className="px-8"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Basic Information */}
        {step === 2 && formData.type && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Basic Information</CardTitle>
              <CardDescription>
                Tell us about your {listingTypes.find(t => t.id === formData.type)?.title.toLowerCase()} listing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {listingTypes.find(t => t.id === formData.type)?.categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a descriptive title for your listing"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your listing"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="City, Country"
                      className="pl-10"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      placeholder="Enter price or rate"
                      className="pl-10"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Listing Images</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Upload high-quality images of your listing</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload('images', e.target.files)}
                    className="hidden"
                    id="images"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="images" className="cursor-pointer">
                      Choose Images
                    </label>
                  </Button>
                  {formData.images.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      {formData.images.length} image(s) selected
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={!formData.category || !formData.title || !formData.description}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Verification Documents */}
        {step === 3 && formData.type && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                Verification Documents
              </CardTitle>
              <CardDescription>
                To ensure safety and trust, we need to verify your identity and qualifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Required Documents for {listingTypes.find(t => t.id === formData.type)?.title}</h4>
                <ul className="space-y-1">
                  {getVerificationRequirements(formData.type).map((req, index) => (
                    <li key={index} className="flex items-center text-blue-800">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Professional License/Certification */}
              <div>
                <Label>Professional License/Certification</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Upload your professional license or certification</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('businessLicense', e.target.files)}
                    className="hidden"
                    id="license"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="license" className="cursor-pointer">
                      Upload License
                    </label>
                  </Button>
                  {formData.businessLicense.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      {formData.businessLicense.length} document(s) uploaded
                    </p>
                  )}
                </div>
              </div>

              {/* Government ID */}
              <div>
                <Label>Government ID</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Upload a clear photo of your government-issued ID</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('idDocument', e.target.files)}
                    className="hidden"
                    id="id"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="id" className="cursor-pointer">
                      Upload ID
                    </label>
                  </Button>
                  {formData.idDocument.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">ID uploaded</p>
                  )}
                </div>
              </div>

              {/* Professional Photo */}
              <div>
                <Label>Professional Photo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Upload a professional headshot photo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('profilePhoto', e.target.files)}
                    className="hidden"
                    id="photo"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="photo" className="cursor-pointer">
                      Upload Photo
                    </label>
                  </Button>
                  {formData.profilePhoto.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">Photo uploaded</p>
                  )}
                </div>
              </div>

              {/* Additional Documents */}
              <div>
                <Label>Additional Verification Documents</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 mb-2">Upload any additional supporting documents</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('verificationDocs', e.target.files)}
                    className="hidden"
                    id="additional"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="additional" className="cursor-pointer">
                      Upload Documents
                    </label>
                  </Button>
                  {formData.verificationDocs.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      {formData.verificationDocs.length} additional document(s) uploaded
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Verification Process</h4>
                    <p className="text-yellow-700 text-sm">
                      Our team will review your documents within 24-48 hours. You'll receive an email 
                      notification once your listing is approved and live on the platform.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={formData.businessLicense.length === 0 || formData.idDocument.length === 0 || formData.profilePhoto.length === 0}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && formData.type && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Review Your Listing</CardTitle>
              <CardDescription>
                Please review all information before submitting your listing for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Listing Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Type:</span> {listingTypes.find(t => t.id === formData.type)?.title}</div>
                    <div><span className="font-medium">Category:</span> {formData.category}</div>
                    <div><span className="font-medium">Title:</span> {formData.title}</div>
                    <div><span className="font-medium">Location:</span> {formData.location}</div>
                    <div><span className="font-medium">Price:</span> {formData.price}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Uploaded Documents</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Professional License ({formData.businessLicense.length} files)
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Government ID ({formData.idDocument.length} files)
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Professional Photo ({formData.profilePhoto.length} files)
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Listing Images ({formData.images.length} files)
                    </div>
                    {formData.verificationDocs.length > 0 && (
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Additional Documents ({formData.verificationDocs.length} files)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-700 text-sm">{formData.description}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">What happens next?</h4>
                    <ul className="text-blue-800 text-sm mt-2 space-y-1">
                      <li>• Your listing will be reviewed within 24-48 hours</li>
                      <li>• We'll verify all your documents and information</li>
                      <li>• You'll receive an email notification once approved</li>
                      <li>• Your listing will go live and start receiving inquiries</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button className="px-8 bg-blue-600 hover:bg-blue-700">
                  Submit for Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

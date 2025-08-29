'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Building2, 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star, 
  Shield, 
  Heart,
  Filter,
  Phone,
  Mail,
  Calendar
} from "lucide-react"
import Link from "next/link"

export default function Properties() {
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [bedrooms, setBedrooms] = useState('')

  const properties = [
    {
      id: 1,
      title: "Modern Apartment in Dublin City Centre",
      location: "Dublin City Centre, Ireland",
      price: "€450,000",
      type: "For Sale",
      bedrooms: 2,
      bathrooms: 2,
      area: "850 sq ft",
      image: "/api/placeholder/400/300",
      agent: {
        name: "Sarah O'Connor",
        rating: 4.9,
        reviews: 127,
        verified: true,
        avatar: "SO"
      },
      features: ["City Views", "Modern Finishes", "Transport Links"],
      description: "Stunning modern apartment with panoramic city views, premium finishes, and excellent transport links."
    },
    {
      id: 2,
      title: "Luxury Villa in Barcelona",
      location: "Eixample, Barcelona, Spain",
      price: "€1,200,000",
      type: "For Sale",
      bedrooms: 4,
      bathrooms: 3,
      area: "2100 sq ft",
      image: "/api/placeholder/400/300",
      agent: {
        name: "Emma Thompson",
        rating: 4.8,
        reviews: 89,
        verified: true,
        avatar: "ET"
      },
      features: ["Private Garden", "Modern Amenities", "Prime Location"],
      description: "Elegant villa in prime Barcelona location with private garden, modern amenities, and architectural excellence."
    },
    {
      id: 3,
      title: "Penthouse in London",
      location: "Canary Wharf, London, UK",
      price: "£850,000",
      type: "For Sale",
      bedrooms: 3,
      bathrooms: 2,
      area: "1200 sq ft",
      image: "/api/placeholder/400/300",
      agent: {
        name: "Michael Chen",
        rating: 4.7,
        reviews: 156,
        verified: true,
        avatar: "MC"
      },
      features: ["Thames Views", "Luxury Finishes", "Premium Building"],
      description: "Spectacular penthouse with Thames views, luxury finishes, and access to premium building amenities."
    },
    {
      id: 4,
      title: "Charming Townhouse in Amsterdam",
      location: "Jordaan, Amsterdam, Netherlands",
      price: "€675,000",
      type: "For Sale",
      bedrooms: 3,
      bathrooms: 2,
      area: "1100 sq ft",
      image: "/api/placeholder/400/300",
      agent: {
        name: "Lisa van der Berg",
        rating: 4.9,
        reviews: 203,
        verified: true,
        avatar: "LB"
      },
      features: ["Historic Character", "Modern Renovation", "Central Location"],
      description: "Historic townhouse beautifully renovated with modern comforts while preserving original character."
    }
  ]

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
            <nav className="hidden md:flex space-x-6">
              <Link href="/properties" className="text-blue-600 font-medium">Properties</Link>
              <Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
              <Link href="/leisure" className="text-gray-600 hover:text-gray-900">Leisure</Link>
              <Link href="/connect" className="text-gray-600 hover:text-gray-900">Connect</Link>
            </nav>
            <div className="flex space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Property</h1>
            <p className="text-xl opacity-90">Discover verified properties from trusted agents worldwide</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search by location, property type..."
                    className="pl-10 border-0 focus-visible:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="border-0">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-250k">€0 - €250k</SelectItem>
                  <SelectItem value="250k-500k">€250k - €500k</SelectItem>
                  <SelectItem value="500k-1m">€500k - €1M</SelectItem>
                  <SelectItem value="1m+">€1M+</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+ Bed</SelectItem>
                  <SelectItem value="2">2+ Beds</SelectItem>
                  <SelectItem value="3">3+ Beds</SelectItem>
                  <SelectItem value="4">4+ Beds</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-600">{properties.length} properties found</span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                  <Badge className="absolute top-3 left-3 bg-blue-600">
                    {property.type}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg leading-tight">{property.title}</h3>
                    <span className="text-xl font-bold text-blue-600">{property.price}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {property.bedrooms}
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {property.bathrooms}
                    </div>
                    <div className="flex items-center">
                      <Square className="w-4 h-4 mr-1" />
                      {property.area}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Agent Info */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-semibold text-sm">{property.agent.avatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-sm">{property.agent.name}</span>
                          {property.agent.verified && (
                            <Shield className="w-3 h-3 text-green-600 ml-1" />
                          )}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                          {property.agent.rating} ({property.agent.reviews})
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-3 h-3" />
                      </Button>
                      <Button size="sm">
                        <Calendar className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Properties
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

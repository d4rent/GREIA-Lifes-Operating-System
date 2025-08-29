'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Wrench, 
  Search, 
  MapPin, 
  Star, 
  Shield, 
  Clock,
  Filter,
  Phone,
  Mail,
  Calendar,
  Zap,
  Hammer,
  PaintBucket,
  Briefcase,
  Calculator,
  Users
} from "lucide-react"
import Link from "next/link"

export default function Services() {
  const [searchQuery, setSearchQuery] = useState('')
  const [serviceCategory, setServiceCategory] = useState('')
  const [location, setLocation] = useState('')

  const serviceCategories = [
    { id: 'construction', name: 'Construction & Trades', icon: Hammer, count: 45 },
    { id: 'electrical', name: 'Electrical', icon: Zap, count: 23 },
    { id: 'plumbing', name: 'Plumbing', icon: Wrench, count: 31 },
    { id: 'design', name: 'Architecture & Design', icon: PaintBucket, count: 18 },
    { id: 'financial', name: 'Financial Services', icon: Calculator, count: 27 },
    { id: 'legal', name: 'Legal Services', icon: Briefcase, count: 15 },
    { id: 'consulting', name: 'Consulting', icon: Users, count: 22 },
  ]

  const professionals = [
    {
      id: 1,
      name: "John Smith",
      title: "Licensed Architect",
      company: "Smith Architecture Studio",
      location: "Dublin, Ireland",
      rating: 4.9,
      reviews: 127,
      verified: true,
      avatar: "JS",
      hourlyRate: "€85/hour",
      responseTime: "Within 2 hours",
      specialties: ["Residential Design", "Sustainable Architecture", "Planning Permission"],
      description: "Award-winning architect specializing in sustainable residential and commercial design with over 15 years of experience.",
      availability: "Available",
      completedProjects: 89,
      badges: ["Top Rated", "Quick Response"]
    },
    {
      id: 2,
      name: "David Chen",
      title: "Mortgage Broker",
      company: "Chen Financial Solutions",
      location: "London, UK",
      rating: 4.9,
      reviews: 89,
      verified: true,
      avatar: "DC",
      hourlyRate: "Free Consultation",
      responseTime: "Within 1 hour",
      specialties: ["First-time Buyers", "Investment Properties", "Remortgaging"],
      description: "Experienced mortgage broker helping clients secure the best rates and terms for over 10 years.",
      availability: "Available",
      completedProjects: 156,
      badges: ["Expert", "Fast Response"]
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      title: "Master Electrician",
      company: "Rodriguez Electrical",
      location: "Barcelona, Spain",
      rating: 4.8,
      reviews: 203,
      verified: true,
      avatar: "MR",
      hourlyRate: "€65/hour",
      responseTime: "Within 30 minutes",
      specialties: ["Home Rewiring", "Smart Home Installation", "Emergency Repairs"],
      description: "Certified master electrician with expertise in residential and commercial electrical systems.",
      availability: "Available",
      completedProjects: 234,
      badges: ["Emergency Service", "Licensed"]
    },
    {
      id: 4,
      name: "Thomas Mueller",
      title: "Plumbing Specialist",
      company: "Mueller Plumbing Services",
      location: "Amsterdam, Netherlands",
      rating: 4.7,
      reviews: 145,
      verified: true,
      avatar: "TM",
      hourlyRate: "€55/hour",
      responseTime: "Within 1 hour",
      specialties: ["Bathroom Installation", "Leak Repairs", "Boiler Service"],
      description: "Professional plumber with 12 years of experience in residential and commercial plumbing.",
      availability: "Busy until Friday",
      completedProjects: 178,
      badges: ["Reliable", "Warranty Included"]
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
              <Link href="/properties" className="text-gray-600 hover:text-gray-900">Properties</Link>
              <Link href="/services" className="text-blue-600 font-medium">Services</Link>
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
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Services</h1>
            <p className="text-xl opacity-90">Connect with verified professionals for all your property needs</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search services or professionals..."
                  className="pl-10 border-0 focus-visible:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="border-0">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dublin">Dublin, Ireland</SelectItem>
                  <SelectItem value="london">London, UK</SelectItem>
                  <SelectItem value="barcelona">Barcelona, Spain</SelectItem>
                  <SelectItem value="amsterdam">Amsterdam, Netherlands</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-green-600 hover:bg-green-700">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {serviceCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.id} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.count} professionals</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Select value={serviceCategory} onValueChange={setServiceCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-600">{professionals.length} professionals found</span>
              <Select defaultValue="highest-rated">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highest-rated">Highest Rated</SelectItem>
                  <SelectItem value="most-reviews">Most Reviews</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Professional Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {professionals.map((professional) => (
              <Card key={professional.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <span className="text-blue-600 font-bold text-lg">{professional.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h3 className="font-semibold text-lg">{professional.name}</h3>
                          {professional.verified && (
                            <Shield className="w-4 h-4 text-green-600 ml-2" />
                          )}
                        </div>
                        <p className="text-gray-600 mb-1">{professional.title}</p>
                        <p className="text-sm text-gray-500 mb-2">{professional.company}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {professional.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 mb-1">{professional.hourlyRate}</div>
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                        {professional.rating} ({professional.reviews})
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{professional.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {professional.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {professional.badges.map((badge) => (
                      <Badge key={badge} className="text-xs bg-green-100 text-green-800">
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Response: {professional.responseTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{professional.completedProjects} projects</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        professional.availability === 'Available' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm text-gray-600">{professional.availability}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Calendar className="w-4 h-4 mr-1" />
                        Book Now
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
              Load More Professionals
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Need a Professional Service?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get matched with verified professionals in your area
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Post Your Project
            </Button>
            <Button size="lg" variant="outline">
              Browse All Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

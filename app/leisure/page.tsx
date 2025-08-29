'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar, 
  Search, 
  MapPin, 
  Star, 
  Clock,
  Filter,
  Ticket,
  Car,
  Utensils,
  Music,
  Palette,
  Camera,
  Users,
  Heart,
  Share
} from "lucide-react"
import Link from "next/link"

export default function Leisure() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')

  const categories = [
    { id: 'events', name: 'Events & Gigs', icon: Music, count: 34 },
    { id: 'restaurants', name: 'Restaurants', icon: Utensils, count: 67 },
    { id: 'tours', name: 'Tours & Experiences', icon: Camera, count: 23 },
    { id: 'art', name: 'Art & Galleries', icon: Palette, count: 18 },
    { id: 'rentals', name: 'Car Rentals', icon: Car, count: 12 },
    { id: 'entertainment', name: 'Entertainment', icon: Ticket, count: 29 },
  ]

  const listings = [
    {
      id: 1,
      title: "Jazz Night at The Blue Note",
      category: "Events & Gigs",
      location: "Dublin, Ireland",
      date: "2024-09-15",
      time: "8:00 PM",
      price: "€25",
      image: "/api/placeholder/400/300",
      rating: 4.8,
      reviews: 156,
      description: "Experience an intimate evening of jazz with local and international artists in Dublin's premier jazz venue.",
      features: ["Live Music", "Bar Available", "Reserved Seating"],
      capacity: "120 people",
      organizer: "Blue Note Venue",
      ticketsLeft: 45,
      type: "event"
    },
    {
      id: 2,
      title: "Michelin Star Dining Experience",
      category: "Restaurants",
      location: "Barcelona, Spain",
      date: "Available Daily",
      time: "7:00 PM - 11:00 PM",
      price: "€85/person",
      image: "/api/placeholder/400/300",
      rating: 4.9,
      reviews: 234,
      description: "Indulge in a culinary journey with our award-winning chef's tasting menu featuring local ingredients.",
      features: ["Tasting Menu", "Wine Pairing", "Private Dining"],
      capacity: "60 seats",
      organizer: "Restaurant Estrella",
      availability: "Book 2 weeks ahead",
      type: "restaurant"
    },
    {
      id: 3,
      title: "Historic City Walking Tour",
      category: "Tours & Experiences",
      location: "Amsterdam, Netherlands",
      date: "Daily Tours",
      time: "10:00 AM & 2:00 PM",
      price: "€20/person",
      image: "/api/placeholder/400/300",
      rating: 4.7,
      reviews: 89,
      description: "Discover Amsterdam's rich history and hidden gems with our expert local guides on this 3-hour walking tour.",
      features: ["Expert Guide", "Small Groups", "Photo Stops"],
      capacity: "15 people max",
      organizer: "Amsterdam Heritage Tours",
      duration: "3 hours",
      type: "tour"
    },
    {
      id: 4,
      title: "Contemporary Art Exhibition",
      category: "Art & Galleries",
      location: "London, UK",
      date: "Sep 1 - Oct 31",
      time: "10:00 AM - 6:00 PM",
      price: "£15",
      image: "/api/placeholder/400/300",
      rating: 4.6,
      reviews: 67,
      description: "Explore cutting-edge contemporary art from emerging and established artists in this curated exhibition.",
      features: ["Audio Guide", "Artist Talks", "Gift Shop"],
      capacity: "Open access",
      organizer: "Modern Art Gallery",
      special: "Student discounts available",
      type: "exhibition"
    },
    {
      id: 5,
      title: "Luxury Car Rental - BMW X5",
      category: "Car Rentals",
      location: "Munich, Germany",
      date: "Available",
      time: "24/7 Pickup",
      price: "€120/day",
      image: "/api/placeholder/400/300",
      rating: 4.8,
      reviews: 145,
      description: "Experience luxury and comfort with our premium BMW X5, perfect for business trips or weekend getaways.",
      features: ["GPS Navigation", "Full Insurance", "24/7 Support"],
      capacity: "5 passengers",
      organizer: "Premium Car Rentals",
      mileage: "Unlimited",
      type: "rental"
    },
    {
      id: 6,
      title: "Comedy Show - Stand-up Night",
      category: "Entertainment",
      location: "Paris, France",
      date: "2024-09-20",
      time: "9:00 PM",
      price: "€18",
      image: "/api/placeholder/400/300",
      rating: 4.5,
      reviews: 92,
      description: "Laugh the night away with top comedians performing their best material in an intimate comedy club setting.",
      features: ["Multiple Acts", "Drinks Available", "Intimate Venue"],
      capacity: "80 people",
      organizer: "Comedy Central Paris",
      showLength: "2 hours",
      type: "entertainment"
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
              <Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
              <Link href="/leisure" className="text-blue-600 font-medium">Leisure</Link>
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
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Experiences</h1>
            <p className="text-xl opacity-90">Find events, restaurants, tours, and entertainment near you</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search experiences..."
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
                  <SelectItem value="barcelona">Barcelona, Spain</SelectItem>
                  <SelectItem value="amsterdam">Amsterdam, Netherlands</SelectItem>
                  <SelectItem value="london">London, UK</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                className="border-0 focus-visible:ring-0"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Button className="bg-purple-600 hover:bg-purple-700">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Card key={cat.id} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{cat.name}</h3>
                    <p className="text-xs text-gray-500">{cat.count} listings</p>
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
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
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
              <span className="text-gray-600">{listings.length} experiences found</span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="date">By Date</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-gray-400" />
                  </div>
                  <Badge className="absolute top-3 left-3 bg-purple-600">
                    {listing.category}
                  </Badge>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/80 hover:bg-white"
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg leading-tight">{listing.title}</h3>
                    <span className="text-lg font-bold text-purple-600">{listing.price}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{listing.location}</span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{listing.date} • {listing.time}</span>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 mr-2">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-sm text-gray-600">{listing.rating} ({listing.reviews} reviews)</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Additional Info */}
                  <div className="text-xs text-gray-500 mb-4">
                    <div className="flex items-center justify-between">
                      <span>By {listing.organizer}</span>
                      <span>{listing.capacity}</span>
                    </div>
                    {listing.ticketsLeft && (
                      <div className="mt-1 text-orange-600">
                        Only {listing.ticketsLeft} tickets left!
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Ticket className="w-4 h-4 mr-1" />
                      Book Now
                    </Button>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Experiences
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">This Weekend's Highlights</h2>
            <p className="text-xl text-gray-600">Don't miss these popular experiences</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Live Music Events</h3>
                <p className="text-gray-600 text-sm mb-4">Experience the best live music venues and concerts</p>
                <Button variant="outline">Explore Events</Button>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Fine Dining</h3>
                <p className="text-gray-600 text-sm mb-4">Book tables at the city's best restaurants</p>
                <Button variant="outline">Find Restaurants</Button>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">City Tours</h3>
                <p className="text-gray-600 text-sm mb-4">Discover hidden gems with local expert guides</p>
                <Button variant="outline">Book Tours</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

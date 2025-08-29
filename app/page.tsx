'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Building2, Wrench, Calendar, Users, Shield, Star, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Blue Gradient */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 flex flex-col items-center justify-center text-white px-4">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">G</span>
            </div>
            <span className="text-xl font-semibold">greia</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="/properties" className="hover:text-blue-200 transition-colors">Properties</Link>
            <Link href="/services" className="hover:text-blue-200 transition-colors">Services</Link>
            <Link href="/leisure" className="hover:text-blue-200 transition-colors">Leisure</Link>
            <Link href="/connect" className="hover:text-blue-200 transition-colors">Connect</Link>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" className="text-white hover:bg-white/10">Sign In</Button>
            <Button className="bg-white text-blue-600 hover:bg-blue-50">Sign Up</Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-light mb-8 leading-tight">
            my<br />
            home<br />
            worldwide
          </h1>
          
          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Building2 className="w-4 h-4 mr-2" />
              Properties
            </Button>
            <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Wrench className="w-4 h-4 mr-2" />
              Services
            </Button>
            <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Calendar className="w-4 h-4 mr-2" />
              Leisure
            </Button>
            <Button variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Users className="w-4 h-4 mr-2" />
              Connect
            </Button>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-2 max-w-2xl mx-auto flex items-center shadow-xl">
            <div className="flex-1 flex items-center px-4">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <Input 
                placeholder="Search properties, services, events, or connect with people..."
                className="border-0 focus-visible:ring-0 text-gray-700 placeholder:text-gray-400"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need in One Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with verified professionals, discover amazing properties, book unique experiences, 
              and build meaningful relationships in your community.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Properties */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Properties</h3>
              <p className="text-gray-600 mb-6">Buy, rent, or sell properties with verified agents. Schedule viewings and manage inquiries seamlessly.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Verified real estate agents</li>
                <li>• Virtual & in-person viewings</li>
                <li>• Secure messaging & payments</li>
                <li>• Document verification</li>
              </ul>
            </div>

            {/* Services */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Services</h3>
              <p className="text-gray-600 mb-6">Book trusted professionals for any job. From plumbers to architects, all verified and rated.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Licensed professionals</li>
                <li>• Instant booking & payments</li>
                <li>• Real-time messaging</li>
                <li>• Service guarantees</li>
              </ul>
            </div>

            {/* Leisure */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Leisure</h3>
              <p className="text-gray-600 mb-6">Discover events, book experiences, and explore local venues. From restaurants to art galleries.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Event tickets & bookings</li>
                <li>• Restaurant reservations</li>
                <li>• Tour & experience booking</li>
                <li>• Car rental services</li>
              </ul>
            </div>

            {/* Connect */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <p className="text-gray-600 mb-6">Build your network, join organizations, and manage your business relationships with integrated CRM.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>• Social networking</li>
                <li>• Business CRM tools</li>
                <li>• Organization groups</li>
                <li>• Task management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <span className="text-blue-600 font-semibold">Verified & Trusted</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Every Listing is Verified for Your Safety
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We verify every professional, property, and business on our platform with comprehensive 
                documentation and identity checks.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">License Verification</h4>
                    <p className="text-gray-600">All professionals must provide valid licenses and certifications</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Identity Confirmation</h4>
                    <p className="text-gray-600">Photo ID and document verification for all users</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Continuous Monitoring</h4>
                    <p className="text-gray-600">Regular reviews and updates to maintain quality standards</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">JS</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">John Smith</h4>
                      <p className="text-sm text-gray-500">Licensed Architect</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">Verified</span>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">4.9 (127 reviews)</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  "Award-winning architect specializing in sustainable residential and commercial design."
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Book Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of verified professionals and satisfied customers on our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/create-listing" className="flex items-center">
                Create Your Listing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Browse Listings
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="text-xl font-semibold">greia</span>
              </div>
              <p className="text-gray-400">
                Your trusted platform for properties, services, leisure, and connections worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/properties" className="hover:text-white">Properties</Link></li>
                <li><Link href="/services" className="hover:text-white">Services</Link></li>
                <li><Link href="/leisure" className="hover:text-white">Leisure</Link></li>
                <li><Link href="/connect" className="hover:text-white">Connect</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety</Link></li>
                <li><Link href="/verification" className="hover:text-white">Verification</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white">Press</Link></li>
                <li><Link href="/legal" className="hover:text-white">Legal</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Greia Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

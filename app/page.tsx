import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Luxury property"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to GREIA
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your global partner in luxury living, property management, and lifestyle services
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-white text-black hover:bg-gray-100">
              <Link href="/properties">Explore Properties</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/connect">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <h3 className="text-2xl font-semibold">{service.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link href={service.link} className="text-blue-600 hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{property.price}</span>
                    <Button asChild>
                      <Link href={`/properties/${property.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Luxury Living?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join GREIA today and discover a world of exclusive properties and premium services.
          </p>
          <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
            <Link href="/connect">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

const services = [
  {
    title: "Property Management",
    description: "Comprehensive property management services for homeowners and investors.",
    link: "/services#property-management"
  },
  {
    title: "Luxury Rentals",
    description: "Exclusive access to high-end properties worldwide for short and long-term stays.",
    link: "/services#luxury-rentals"
  },
  {
    title: "Lifestyle Services",
    description: "Personalized concierge services to enhance your living experience.",
    link: "/services#lifestyle-services"
  }
]

const featuredProperties = [
  {
    id: 1,
    title: "Oceanfront Villa",
    location: "Miami Beach, FL",
    price: "$5,000/night",
    image: "/properties/oceanfront-villa.jpg"
  },
  {
    id: 2,
    title: "Mountain Chalet",
    location: "Aspen, CO",
    price: "$3,500/night",
    image: "/properties/mountain-chalet.jpg"
  },
  {
    id: 3,
    title: "City Penthouse",
    location: "New York, NY",
    price: "$4,200/night",
    image: "/properties/city-penthouse.jpg"
  }
]

const testimonials = [
  {
    quote: "GREIA provided an exceptional experience from start to finish. The property exceeded our expectations.",
    name: "Sarah Johnson",
    location: "London, UK",
    avatar: "/testimonials/sarah.jpg"
  },
  {
    quote: "The attention to detail and personalized service made our stay unforgettable.",
    name: "Michael Chen",
    location: "Hong Kong",
    avatar: "/testimonials/michael.jpg"
  },
  {
    quote: "Professional, reliable, and truly luxurious. GREIA is our go-to for premium properties.",
    name: "Isabella Martinez",
    location: "Madrid, Spain",
    avatar: "/testimonials/isabella.jpg"
  }
]
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
        {/* Logo Section */}
        <div className="mb-24 animate-fadeIn">
          <Image
            src="/images/greia-full-logo.png"
            alt="GREIA Logo"
            width={400}
            height={100}
            className="w-auto h-auto max-w-[280px] md:max-w-[400px]"
            priority
          />
        </div>
        
        {/* Hero Text */}
        <div className="mb-32 animate-fadeInUp">
          <Image
            src="/images/my-home-worldwide.png"
            alt="my home worldwide"
            width={600}
            height={200}
            className="w-auto h-auto max-w-[400px] md:max-w-[600px]"
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-x-16 gap-y-8 text-gray-800 animate-fadeInUp">
          <Link 
            href="/properties" 
            className="text-lg md:text-xl uppercase tracking-widest hover:text-gray-600 transition-colors duration-300"
          >
            Properties
          </Link>
          <Link 
            href="/services" 
            className="text-lg md:text-xl uppercase tracking-widest hover:text-gray-600 transition-colors duration-300"
          >
            Services
          </Link>
          <Link 
            href="/leisure" 
            className="text-lg md:text-xl uppercase tracking-widest hover:text-gray-600 transition-colors duration-300"
          >
            Leisure
          </Link>
          <Link 
            href="/connect" 
            className="text-lg md:text-xl uppercase tracking-widest hover:text-gray-600 transition-colors duration-300"
          >
            Connect
          </Link>
        </nav>
      </div>
    </main>
  )
}
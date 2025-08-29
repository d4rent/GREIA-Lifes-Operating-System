import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        {/* GREIA Logo */}
        <div className="absolute top-8 left-8 z-10">
          <Image
            src="/images/greia-full-logo.png"
            alt="GREIA Logo"
            width={300}
            height={80}
            className="w-auto h-auto"
          />
        </div>
        
        {/* Hero Text */}
        <div className="text-center z-10">
          <Image
            src="/images/my-home-worldwide.png"
            alt="my home worldwide"
            width={800}
            height={300}
            className="w-auto h-auto"
          />
        </div>

        {/* Navigation Links */}
        <nav className="absolute bottom-20 left-0 right-0 flex justify-center gap-8 text-white text-xl">
          <Link href="/properties" className="hover:text-gray-300 transition-colors">
            Properties
          </Link>
          <Link href="/services" className="hover:text-gray-300 transition-colors">
            Services
          </Link>
          <Link href="/leisure" className="hover:text-gray-300 transition-colors">
            Leisure
          </Link>
          <Link href="/connect" className="hover:text-gray-300 transition-colors">
            Connect
          </Link>
        </nav>
      </div>
    </main>
  )
}
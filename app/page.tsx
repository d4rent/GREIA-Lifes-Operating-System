import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Main Content */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center relative px-4 bg-gradient-to-b from-gray-50 via-white to-gray-50">
        {/* Logo Section - Top Center */}
        <div className="mb-20 animate-fadeIn">
          <Image
            src="/images/greia-full-logo.png"
            alt="GREIA Logo"
            width={400}
            height={100}
            className="w-auto max-w-[280px] md:max-w-[400px]"
            priority
          />
        </div>
        
        {/* Hero Text - Center */}
        <div className="mb-28 animate-fadeInUp">
          <Image
            src="/images/my-home-worldwide.png"
            alt="my home worldwide"
            width={600}
            height={200}
            className="w-auto max-w-[400px] md:max-w-[600px]"
            priority
          />
        </div>

        {/* Navigation Links - Bottom */}
        <nav className="flex flex-wrap justify-center gap-x-16 gap-y-6 text-gray-800 text-lg md:text-xl animate-fadeInUp">
          <Link href="/properties" className="hover:text-gray-600 transition-colors uppercase tracking-widest">
            Properties
          </Link>
          <Link href="/services" className="hover:text-gray-600 transition-colors uppercase tracking-widest">
            Services
          </Link>
          <Link href="/leisure" className="hover:text-gray-600 transition-colors uppercase tracking-widest">
            Leisure
          </Link>
          <Link href="/connect" className="hover:text-gray-600 transition-colors uppercase tracking-widest">
            Connect
          </Link>
        </nav>
      </div>
    </main>
  )
}
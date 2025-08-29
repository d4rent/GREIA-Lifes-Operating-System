import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        {/* GREIA Logo */}
        <div className="absolute top-8 left-8 z-20 animate-fadeIn">
          <Image
            src="/images/greia-full-logo.png"
            alt="GREIA Logo"
            width={300}
            height={80}
            className="w-auto h-[60px] md:h-[80px]"
            priority
          />
        </div>
        
        {/* Hero Text */}
        <div className="text-center z-10 transform -translate-y-20 animate-fadeInUp">
          <Image
            src="/images/my-home-worldwide.png"
            alt="my home worldwide"
            width={800}
            height={300}
            className="w-auto h-auto max-w-[90vw] md:max-w-[800px]"
            priority
          />
        </div>

        {/* Navigation Links */}
        <nav className="absolute bottom-20 left-0 right-0 flex justify-center gap-12 text-gray-800 text-xl z-20 animate-fadeInUp">
          <Link href="/properties" className="hover-underline transition-all duration-300 uppercase tracking-wider">
            Properties
          </Link>
          <Link href="/services" className="hover-underline transition-all duration-300 uppercase tracking-wider">
            Services
          </Link>
          <Link href="/leisure" className="hover-underline transition-all duration-300 uppercase tracking-wider">
            Leisure
          </Link>
          <Link href="/connect" className="hover-underline transition-all duration-300 uppercase tracking-wider">
            Connect
          </Link>
        </nav>

        {/* Social Links */}
        <div className="absolute bottom-8 right-8 flex gap-6 z-20 animate-fadeIn">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
          </a>
        </div>
      </div>
    </main>
  )
}
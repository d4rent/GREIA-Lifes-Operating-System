import Link from 'next/link'

export default function Connect() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Connect</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/contact" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>Get in touch with our team</p>
          </Link>
          <Link href="/support" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Support</h2>
            <p>Need help? We're here for you</p>
          </Link>
          <Link href="/feedback" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
            <p>Share your thoughts with us</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
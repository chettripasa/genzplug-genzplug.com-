export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            About GenZPlug
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            A modern e-commerce platform built for the next generation
          </p>
        </div>

        <div className="prose prose-lg mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-6">
                GenZPlug is designed to provide a seamless, secure, and modern shopping experience. 
                We leverage cutting-edge technologies to create a platform that&apos;s fast, reliable, and user-friendly.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Technology Stack
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Next.js 14</strong> - React framework with App Router</li>
                <li><strong>TypeScript</strong> - Type-safe development</li>
                <li><strong>TailwindCSS</strong> - Utility-first CSS framework</li>
                <li><strong>MongoDB</strong> - NoSQL database with Mongoose ODM</li>
                <li><strong>Stripe</strong> - Payment processing</li>
                <li><strong>NextAuth.js</strong> - Authentication</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Key Features
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Secure Authentication</h4>
                  <p className="text-gray-600 text-sm">
                    Multiple authentication providers with secure session management
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Processing</h4>
                  <p className="text-gray-600 text-sm">
                    Integrated Stripe payments with webhook support for real-time updates
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Product Management</h4>
                  <p className="text-gray-600 text-sm">
                    Full CRUD operations for products with image support
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Responsive Design</h4>
                  <p className="text-gray-600 text-sm">
                    Mobile-first design that works on all devices
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-6">
              Experience the future of e-commerce with GenZPlug
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="/products"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Browse Products
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-md font-medium"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Cancel Header */}
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600">Your payment was cancelled. No charges were made to your account.</p>
        </div>

        {/* Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What happened?</h2>
          <div className="space-y-3 text-left">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-medium">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Payment Cancelled</p>
                <p className="text-sm text-gray-600">You cancelled the payment process before it was completed.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-medium">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">No Charges</p>
                <p className="text-sm text-gray-600">No money was charged to your payment method.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xs font-medium">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Items Still Available</p>
                <p className="text-sm text-gray-600">Your items are still in your cart and ready for checkout.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-4">
            If you experienced any issues during checkout or have questions about your order, 
            please don&apos;t hesitate to contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="mailto:support@genzplug.com"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/help"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors text-center"
          >
            View My Cart
          </Link>
        </div>
      </div>
    </div>
  );
}

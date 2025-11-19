import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The most charming way to ask to meet
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your personal link, share it anywhere, and see who says "Yes" to meeting you
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create My Link
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create your link
              </h3>
              <p className="text-gray-600">
                Sign up and customize your profile with your social links and message
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Share it anywhere
              </h3>
              <p className="text-gray-600">
                Add it to your bio, email signature, or share it directly with people
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                See who says "Yes"
              </h3>
              <p className="text-gray-600">
                Track your analytics and connect with people who want to meet you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Example Demo Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            See it in action
          </h2>

          {/* Mock Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center space-y-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold">
                A
              </div>

              {/* Name */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Hi, I'm Alex</h3>
                <p className="text-gray-600 mt-2">
                  Product designer & coffee enthusiast
                </p>
              </div>

              {/* Question */}
              <div className="py-4">
                <p className="text-xl font-semibold text-gray-900">
                  May I meet you?
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Yes, you may
                </button>
                <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                  No, sorry
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to make connections?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join MayIMeetYou.io and start building meaningful relationships
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </main>
  )
}

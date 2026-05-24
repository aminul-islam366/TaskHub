import Link from "next/link";

const HeroSection = () => (
  <section className="relative bg-gray-900 overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600 rounded-full blur-3xl" />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Trusted by 10,000+ users worldwide
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          Complete Twitter Tasks
          <span className="block text-emerald-400 mt-1">
            & Earn Real Rewards
          </span>
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join TaskHub — the #1 micro-task platform for Twitter growth. Follow,
          Retweet, and Like to earn. Or post tasks to grow your audience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tasks"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-semibold transition shadow-lg text-sm"
          >
            Browse Tasks →
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-8 py-3.5 rounded-xl font-semibold transition text-sm"
          >
            Start Earning Free
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-500 text-sm">
          {["No fees to join", "Instant task access", "Verified payouts"].map(
            (t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> {t}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;

import Link from "next/link";

const CTASection = () => (
  <section className="py-20 bg-gray-900">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        Ready to start earning?
      </h2>
      <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
        Join TaskHub for free and start completing tasks or growing your Twitter
        presence today.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/register"
          className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-semibold transition text-sm"
        >
          Create Free Account
        </Link>
        <Link
          href="/tasks"
          className="inline-flex items-center justify-center border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3.5 rounded-xl font-semibold transition text-sm"
        >
          Browse Tasks
        </Link>
      </div>
    </div>
  </section>
);

export default CTASection;

import Link from "next/link";
import React from "react";

const CTASection = () => {
  return (
    <section className="py-16 bg-liner-to-r from-emerald-500 to-emerald-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-4xl font-bold mb-6">Ready to Get Started?</h3>
        <p className="text-xl mb-8 text-gray-600">
          Join thousands of users completing tasks and growing their Twitter
          presence!
        </p>
        <Link
          href="/tasks/add"
          className="bg-gray-100 text-emerald-600 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition inline-block"
        >
          Create Your First Task
        </Link>
      </div>
    </section>
  );
};

export default CTASection;

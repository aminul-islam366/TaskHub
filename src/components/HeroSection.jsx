import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Complete Twitter Tasks & Earn Rewards
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join TaskHub to complete simple Twitter tasks like Follow, Retweet,
          and Like. Create your own tasks and grow your Twitter presence!
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/tasks"
            className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Browse Tasks
          </Link>
          <Link
            href="/tasks/add"
            className="bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition border-2 border-white"
          >
            Create Task
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

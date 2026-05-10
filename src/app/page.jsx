"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import DashboardOverview from "@/components/DashboardOverview";
import HeroSection from "@/components/HeroSection";
import LiveStats from "@/components/LiveStats";
import Works from "@/components/Works";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import FeaturesSection from "@/components/FeaturesSection";

export default function Home() {
  const [recentTasks, setRecentTasks] = useState([]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Twitter Follow":
        return "👥";
      case "Twitter Retweet":
        return "🔄";
      case "Twitter Like":
        return "❤️";
      default:
        return "📋";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Twitter Follow":
        return "bg-emerald-100 text-emerald-800";
      case "Twitter Retweet":
        return "bg-green-100 text-green-800";
      case "Twitter Like":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/*  Section - Animated */}
      <LiveStats />

      {/* Recent Tasks Section - Dynamic */}
      {recentTasks.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800">Latest Tasks</h3>
              <Link
                href="/tasks"
                className="text-emerald-600 font-semibold hover:text-emerald-700"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(task.category)}`}
                      >
                        {getCategoryIcon(task.category)} {task.category}
                      </span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ${task.reward}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>
                        Slots: {task.completions}/{task.requiredCompletions}
                      </span>
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    </div>

                    <Link
                      href={`/tasks/${task._id}`}
                      className="block w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition text-center"
                    >
                      Complete Task
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Platform Stats Dashboard */}
      <DashboardOverview />

      {/* Task Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Available Task Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition border-t-4 border-emerald-500">
              <div className="text-5xl mb-4">�</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Twitter Follow
              </h4>
              <p className="text-gray-600 mb-4">
                Follow Twitter accounts and earn rewards. Help others grow their
                audience.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Avg. Reward</span>
                <span className="text-lg font-bold text-emerald-600">
                  $0.50
                </span>
              </div>
              <Link
                href="/tasks"
                className="text-emerald-600 font-semibold hover:text-emerald-700"
              >
                View Tasks →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition border-t-4 border-green-500">
              <div className="text-5xl mb-4">�</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Twitter Retweet
              </h4>
              <p className="text-gray-600 mb-4">
                Retweet posts to increase their reach and visibility. Earn
                rewards instantly.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Avg. Reward</span>
                <span className="text-lg font-bold text-green-600">$0.75</span>
              </div>
              <Link
                href="/tasks"
                className="text-green-600 font-semibold hover:text-green-700"
              >
                View Tasks →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition border-t-4 border-red-500">
              <div className="text-5xl mb-4">❤️</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Twitter Like
              </h4>
              <p className="text-gray-600 mb-4">
                Like tweets to show support and engagement. Quick and easy
                tasks.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Avg. Reward</span>
                <span className="text-lg font-bold text-red-600">$0.25</span>
              </div>
              <Link
                href="/tasks"
                className="text-red-600 font-semibold hover:text-red-700"
              >
                View Tasks →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <Works />

      {/* Features Section */}
      <FeaturesSection />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <CTASection />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
}

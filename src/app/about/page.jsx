"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            About TaskHub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The leading platform for Twitter micro-tasks and social media growth
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            At TaskHub, we connect people who want to grow their Twitter
            presence with users who want to earn rewards by completing simple
            tasks. Our platform makes it easy to increase followers, boost
            engagement, and build a stronger social media presence.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            We believe in creating a fair and transparent marketplace where
            everyone benefits. Task creators get real engagement, and task
            completers earn rewards for their time and effort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Our Vision
            </h3>
            <p className="text-gray-600">
              To become the most trusted platform for social media growth and
              micro-task completion worldwide.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Innovation
            </h3>
            <p className="text-gray-600">
              We constantly improve our verification system and user experience
              to ensure quality and fairness.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Trust</h3>
            <p className="text-gray-600">
              Building trust through transparent processes, secure verification,
              and reliable payment systems.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl shadow-lg p-12 mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            TaskHub by the Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <p className="text-lg">Tasks Completed</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p className="text-lg">Active Users</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5K+</div>
              <p className="text-lg">Daily Tasks</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <p className="text-lg">Satisfaction Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            How TaskHub Works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-600">1</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Create or Browse Tasks
                </h3>
                <p className="text-gray-600">
                  Task creators post Twitter tasks (Follow, Retweet, Like) with
                  rewards. Users browse available tasks.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-600">2</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Complete Tasks
                </h3>
                <p className="text-gray-600">
                  Users complete the required action on Twitter and submit their
                  username for verification.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-600">3</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Verification
                </h3>
                <p className="text-gray-600">
                  Task creators verify submissions to ensure tasks were
                  completed correctly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-600">4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Earn Rewards
                </h3>
                <p className="text-gray-600">
                  Once verified, users receive their rewards and can continue
                  completing more tasks.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-white rounded-xl shadow-lg p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Join thousands of users on TaskHub today!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/tasks/add"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              Create Task
            </Link>
            <Link
              href="/tasks"
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Browse Tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

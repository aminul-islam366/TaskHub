"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LiveStats from "@/components/LiveStats";
import Works from "@/components/Works";
import FeaturesSection from "@/components/FeaturesSection";
import DashboardOverview from "@/components/DashboardOverview";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const categoryConfig = {
  "Twitter Follow": { icon: "👥", color: "bg-blue-100 text-blue-700" },
  "Twitter Retweet": { icon: "🔄", color: "bg-emerald-100 text-emerald-700" },
  "Twitter Like": { icon: "❤️", color: "bg-rose-100 text-rose-700" },
};

export default function Home() {
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((tasks) => setRecentTasks(tasks.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <LiveStats />

      {/* Recent Tasks */}
      {recentTasks.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
                  Live Tasks
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Latest Available Tasks
                </h2>
              </div>
              <Link
                href="/tasks"
                className="text-sm text-emerald-600 font-semibold hover:text-emerald-700"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentTasks.map((task) => {
                const cfg = categoryConfig[task.category] || {
                  icon: "📋",
                  color: "bg-gray-100 text-gray-700",
                };
                const isFull = task.completions >= task.requiredCompletions;
                return (
                  <div
                    key={task._id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}
                      >
                        {cfg.icon} {task.category}
                      </span>
                      <span className="text-xl font-bold text-emerald-600">
                        ${task.reward}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-4 line-clamp-2">
                      {task.description}
                    </p>
                    <Link
                      href={`/tasks/${task._id}`}
                      className={`block w-full text-center py-2 rounded-xl text-xs font-semibold transition ${
                        isFull
                          ? "bg-gray-100 text-gray-400 pointer-events-none"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      {isFull ? "Full" : "Complete & Earn"}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
              Task Types
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Available Categories
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                cat: "Twitter Follow",
                icon: "👥",
                reward: "$0.50",
                desc: "Follow Twitter accounts and help creators grow their audience.",
                border: "border-blue-200",
                badge: "bg-blue-50 text-blue-700",
              },
              {
                cat: "Twitter Retweet",
                icon: "🔄",
                reward: "$0.75",
                desc: "Retweet posts to increase their reach and visibility.",
                border: "border-emerald-200",
                badge: "bg-emerald-50 text-emerald-700",
              },
              {
                cat: "Twitter Like",
                icon: "❤️",
                reward: "$0.25",
                desc: "Like tweets to boost engagement. Quick and easy tasks.",
                border: "border-rose-200",
                badge: "bg-rose-50 text-rose-700",
              },
            ].map((c) => (
              <div
                key={c.cat}
                className={`bg-white rounded-2xl p-6 border ${c.border} hover:shadow-md transition`}
              >
                <div
                  className={`w-12 h-12 ${c.badge} rounded-xl flex items-center justify-center text-2xl mb-4`}
                >
                  {c.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{c.cat}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  {c.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Avg. reward</span>
                  <span className="font-bold text-emerald-600">{c.reward}</span>
                </div>
                <Link
                  href="/tasks"
                  className="block mt-4 text-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold transition"
                >
                  Browse Tasks →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Works />
      <FeaturesSection />
      <DashboardOverview />
      <Testimonials />
      <CTASection />
      <Newsletter />
      <Footer />
    </div>
  );
}

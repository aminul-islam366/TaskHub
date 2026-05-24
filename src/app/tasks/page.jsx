"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CATEGORIES = ["All", "Twitter Follow", "Twitter Retweet", "Twitter Like"];

const catCfg = {
  "Twitter Follow": {
    icon: "👥",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    bar: "bg-emerald-500",
  },
  "Twitter Retweet": {
    icon: "🔄",
    pill: "bg-gray-100 text-gray-700 border border-gray-200",
    bar: "bg-gray-500",
  },
  "Twitter Like": {
    icon: "❤️",
    pill: "bg-red-50 text-red-600 border border-red-200",
    bar: "bg-red-400",
  },
};
const fallback = {
  icon: "📋",
  pill: "bg-gray-100 text-gray-700 border border-gray-200",
  bar: "bg-gray-400",
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-5 bg-gray-100 rounded-full w-28" />
        <div className="h-6 bg-gray-100 rounded w-12" />
      </div>
      <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-full mb-1" />
      <div className="h-4 bg-gray-100 rounded w-2/3 mb-5" />
      <div className="h-2 bg-gray-100 rounded-full mb-5" />
      <div className="h-10 bg-gray-100 rounded-xl" />
    </div>
  );
}

export default function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = tasks
    .filter((t) => {
      const matchCat = category === "All" || t.category === category;
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sort === "reward-high") return b.reward - a.reward;
      if (sort === "reward-low") return a.reward - b.reward;
      if (sort === "slots")
        return (
          b.requiredCompletions -
          b.completions -
          (a.requiredCompletions - a.completions)
        );
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const available = tasks.filter(
    (t) => t.completions < t.requiredCompletions,
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-emerald-400 text-sm font-semibold uppercase tracking-widest mb-1">
                Marketplace
              </p>
              <h1 className="text-3xl font-bold">Browse Tasks</h1>
              <p className="text-gray-400 mt-1 text-sm">
                {loading
                  ? "Loading tasks..."
                  : `${available} tasks available right now`}
              </p>
            </div>
            <Link
              href="/tasks/add"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shrink-0"
            >
              + Post a Task
            </Link>
          </div>

          {/* Stats bar */}
          {!loading && (
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-400 border-t border-gray-800 pt-5">
              {[
                { label: "Total Tasks", val: tasks.length },
                { label: "Available", val: available },
                {
                  label: "Completed",
                  val: tasks.reduce((s, t) => s + (t.completions || 0), 0),
                },
              ].map((s) => (
                <div key={s.label}>
                  <span className="text-white font-bold text-lg">{s.val}</span>
                  <span className="ml-1.5">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition"
              />
            </div>

            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => {
                const c = catCfg[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                      category === cat
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {cat === "All"
                      ? "All Tasks"
                      : `${c.icon} ${cat.replace("Twitter ", "")}`}
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="reward-high">Highest Reward</option>
              <option value="reward-low">Lowest Reward</option>
              <option value="slots">Most Slots</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🔍
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              No tasks found
            </h3>
            <p className="text-gray-500 text-sm">
              {search || category !== "All"
                ? "Try adjusting your filters"
                : "Check back soon for new tasks"}
            </p>
            {(search || category !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-4 text-emerald-600 text-sm font-semibold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((task) => {
              const c = catCfg[task.category] || fallback;
              const isFull = task.completions >= task.requiredCompletions;
              const progress = Math.min(
                (task.completions / task.requiredCompletions) * 100,
                100,
              );
              const slotsLeft = task.requiredCompletions - task.completions;

              return (
                <div
                  key={task._id}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 flex flex-col group"
                >
                  {/* Card top accent */}
                  <div
                    className={`h-1 rounded-t-2xl ${isFull ? "bg-gray-200" : "bg-emerald-500"}`}
                  />

                  <div className="p-5 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.pill}`}
                      >
                        {c.icon} {task.category}
                      </span>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          ${task.reward}
                        </div>
                        <div className="text-xs text-gray-400">per task</div>
                      </div>
                    </div>

                    {/* Title & desc */}
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
                      {task.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">
                          {task.completions} done
                        </span>
                        <span
                          className={
                            isFull
                              ? "text-red-500 font-medium"
                              : "text-emerald-600 font-medium"
                          }
                        >
                          {isFull
                            ? "Full"
                            : `${slotsLeft} slot${slotsLeft !== 1 ? "s" : ""} left`}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${isFull ? "bg-gray-300" : "bg-emerald-500"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                      <span>by {task.createdByName || "TaskHub"}</span>
                      <span
                        className={`flex items-center gap-1 font-medium ${isFull ? "text-gray-400" : "text-emerald-600"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isFull ? "bg-gray-300" : "bg-emerald-500 animate-pulse"}`}
                        />
                        {isFull ? "Closed" : "Open"}
                      </span>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/tasks/${task._id}`}
                      className={`block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition ${
                        isFull
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                          : "bg-gray-900 hover:bg-emerald-600 text-white"
                      }`}
                    >
                      {isFull ? "No Slots Left" : `Earn $${task.reward}`}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

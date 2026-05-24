"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const CATEGORIES = ["All", "Twitter Follow", "Twitter Retweet", "Twitter Like"];

const categoryConfig = {
  "Twitter Follow": {
    icon: "👥",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  "Twitter Retweet": {
    icon: "🔄",
    color: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  "Twitter Like": {
    icon: "❤️",
    color: "bg-rose-100 text-rose-700",
    dot: "bg-rose-500",
  },
};

export default function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTasks = tasks.filter((t) => {
    const matchCat =
      selectedCategory === "All" || t.category === selectedCategory;
    const matchSearch =
      !searchTerm ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const cfg = (cat) =>
    categoryConfig[cat] || {
      icon: "📋",
      color: "bg-gray-100 text-gray-700",
      dot: "bg-gray-400",
    };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Tasks</h1>
              <p className="text-gray-500 mt-1">
                {isLoading
                  ? "Loading..."
                  : `${filteredTasks.length} task${filteredTasks.length !== 1 ? "s" : ""} available`}
              </p>
            </div>
            <Link
              href="/tasks/add"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-emerald-200"
            >
              <span className="text-lg leading-none">+</span> Post a Task
            </Link>
          </div>

          {/* Search & Filter */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-600"
                  }`}
                >
                  {cat === "All"
                    ? "All"
                    : `${cfg(cat).icon} ${cat.replace("Twitter ", "")}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-6" />
                <div className="h-10 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your filters"
                : "Check back soon for new tasks"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => {
              const c = cfg(task.category);
              const isFull = task.completions >= task.requiredCompletions;
              const progress = Math.min(
                (task.completions / task.requiredCompletions) * 100,
                100,
              );
              return (
                <div
                  key={task._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${c.color}`}
                      >
                        {c.icon} {task.category}
                      </span>
                      <span className="text-2xl font-bold text-emerald-600">
                        ${task.reward}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span>{task.completions} completed</span>
                        <span>{task.requiredCompletions} total</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${isFull ? "bg-red-400" : "bg-emerald-500"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${isFull ? "text-red-500" : "text-emerald-600"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isFull ? "bg-red-400" : "bg-emerald-500"}`}
                      />
                      {isFull ? "Task Full" : "Available"}
                    </span>
                  </div>

                  <div className="px-6 pb-6">
                    <Link
                      href={`/tasks/${task._id}`}
                      className={`block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition ${
                        isFull
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100"
                      }`}
                    >
                      {isFull ? "No Slots Left" : "Complete & Earn"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

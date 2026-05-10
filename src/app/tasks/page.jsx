"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ViewDetailsButton from "@/components/ViewDetailsButton";

export default function BrowseTasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        setFilteredTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = tasks;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((task) => task.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredTasks(filtered);
  }, [searchTerm, selectedCategory, tasks]);

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Browse Tasks
          </h1>
          <p className="text-gray-600 text-lg">
            Find and complete tasks to earn rewards
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Tasks
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter by Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="All">All Categories</option>
                <option value="Twitter Follow">Twitter Follow</option>
                <option value="Twitter Retweet">Twitter Retweet</option>
                <option value="Twitter Like">Twitter Like</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="text-xl text-gray-600">Loading tasks...</div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No Tasks Found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your filters"
                : "Check back later for new tasks"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
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

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {task.description}
                </p>

                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <span>
                    {task.completions} / {task.requiredCompletions} completed
                  </span>
                  <span
                    className={`px-2 py-1 rounded ${
                      task.completions >= task.requiredCompletions
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.completions >= task.requiredCompletions
                      ? "Full"
                      : "Available"}
                  </span>
                </div>

                <ViewDetailsButton task={task} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

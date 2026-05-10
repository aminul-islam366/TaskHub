"use client";

import React, { useEffect, useState } from "react";

const LiveStats = () => {
  const [animatedStats, setAnimatedStats] = useState({
    tasks: 0,
    completions: 0,
    users: 0,
  });

  const [stats, setStats] = useState({});
  const [recentTasks, setRecentTasks] = useState([]);

  const animateCounter = (key, target) => {
    let current = 0;
    const increment = target / 50;

    const timer = setInterval(() => {
      current += increment;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      setAnimatedStats((prev) => ({
        ...prev,
        [key]: Math.floor(current),
      }));
    }, 30);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const tasks = await response.json();

        const activeTasks = tasks.filter((t) => t.status === "active");

        const completedCount = tasks.reduce(
          (sum, task) => sum + (task.completions || 0),
          0,
        );

        const totalRewards = tasks.reduce(
          (sum, task) => sum + (task.reward || 0) * (task.completions || 0),
          0,
        );

        const statsData = {
          totalTasks: tasks.length,
          activeTasks: activeTasks.length,
          completedTasks: completedCount,
          totalRewards: totalRewards,
        };

        setStats(statsData);

        // Animate with real data
        animateCounter("tasks", statsData.activeTasks);
        animateCounter("completions", statsData.completedTasks);
        animateCounter("users", 2000);

        // Recent tasks
        const recent = tasks.slice(0, 3);
        setRecentTasks(recent);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="py-16 bg-emerald-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center mb-8">
          Live Platform Statistics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-emerald-700 rounded-xl p-6">
            <div className="text-5xl font-bold mb-2">
              {animatedStats.tasks.toLocaleString()}+
            </div>
            <p className="text-xl">Active Tasks</p>
          </div>

          <div className="bg-emerald-700 rounded-xl p-6">
            <div className="text-5xl font-bold mb-2">
              {animatedStats.completions.toLocaleString()}+
            </div>
            <p className="text-xl">Task Completions</p>
          </div>

          <div className="bg-emerald-700 rounded-xl p-6">
            <div className="text-5xl font-bold mb-2">
              {animatedStats.users.toLocaleString()}+
            </div>
            <p className="text-xl">Active Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStats;

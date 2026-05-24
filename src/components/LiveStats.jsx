"use client";

import { useEffect, useState } from "react";

const useCounter = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = target / (duration / 30);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

const LiveStats = () => {
  const [data, setData] = useState({ active: 0, completions: 0, rewards: 0 });

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((tasks) =>
        setData({
          active: tasks.filter((t) => t.completions < t.requiredCompletions)
            .length,
          completions: tasks.reduce((s, t) => s + (t.completions || 0), 0),
          rewards: tasks.reduce(
            (s, t) => s + (t.reward || 0) * (t.completions || 0),
            0,
          ),
        }),
      )
      .catch(() => {});
  }, []);

  const active = useCounter(data.active);
  const completions = useCounter(data.completions);
  const rewards = useCounter(Math.round(data.rewards));

  const stats = [
    { value: `${active}+`, label: "Active Tasks" },
    { value: `${completions}+`, label: "Tasks Completed" },
    { value: `$${rewards}+`, label: "Rewards Paid" },
    { value: "10K+", label: "Active Users" },
  ];

  return (
    <section className="bg-gray-900 border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`text-center ${i < stats.length - 1 ? "lg:border-r lg:border-gray-800" : ""}`}
            >
              <div className="text-3xl font-bold text-white mb-1">
                {s.value}
              </div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveStats;

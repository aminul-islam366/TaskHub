"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";

const instructionsMap = {
  "Twitter Follow": [
    "Go to the Twitter account linked below.",
    "Click Follow from your Twitter profile.",
    "Make sure your account is public.",
    "Enter your Twitter username as proof.",
  ],
  "Twitter Like": [
    "Open the tweet link provided below.",
    "Click the Like (heart) button.",
    "Ensure the like is visible on your profile.",
    "Enter your Twitter username as proof.",
  ],
  "Twitter Retweet": [
    "Open the tweet link provided below.",
    "Click Retweet and confirm.",
    "Make sure the retweet is public.",
    "Enter your Twitter username as proof.",
  ],
};

const categoryConfig = {
  "Twitter Follow": { icon: "👥", color: "bg-blue-100 text-blue-700" },
  "Twitter Retweet": { icon: "🔄", color: "bg-emerald-100 text-emerald-700" },
  "Twitter Like": { icon: "❤️", color: "bg-rose-100 text-rose-700" },
};

export default function TaskDetails() {
  const router = useRouter();
  const { id } = useParams();
  const { status } = useSession();
  const [task, setTask] = useState(null);
  const [twitterUsername, setTwitterUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTask = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/tasks/${id}`);
      setTask(data);
    } catch {
      Swal.fire("Error", "Task not found", "error").then(() =>
        router.push("/tasks"),
      );
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    else if (status === "authenticated") fetchTask();
  }, [status, fetchTask, router]);

  const handleSubmit = async () => {
    if (!twitterUsername.trim()) {
      Swal.fire("Required", "Please enter your Twitter username", "warning");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`/api/tasks/${task._id}/submission`, {
        twitterUsername,
      });
      Swal.fire({
        title: "Submitted!",
        html: `You earned <strong class="text-emerald-600">$${task.reward}</strong>`,
        icon: "success",
        confirmButtonColor: "#059669",
      }).then(() => router.push("/my-tasks"));
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Submission failed",
        "error",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !task)
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl p-8 animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    );

  const progress = Math.min(
    (task.completions / task.requiredCompletions) * 100,
    100,
  );
  const isTaskFull = task.completions >= task.requiredCompletions;
  const cfg = categoryConfig[task.category] || {
    icon: "📋",
    color: "bg-gray-100 text-gray-700",
  };
  const steps = instructionsMap[task.category] || [
    "Complete the task and submit proof.",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 mb-6 transition"
        >
          ← Back to Tasks
        </Link>

        <div className="space-y-4">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.color} mb-3`}
                >
                  {cfg.icon} {task.category}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {task.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Posted by {task.createdByName || "TaskHub"}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-3xl font-bold text-emerald-600">
                  ${task.reward}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  per completion
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>
                  {task.completions} of {task.requiredCompletions} completed
                </span>
                <span
                  className={
                    isTaskFull
                      ? "text-red-500 font-medium"
                      : "text-emerald-600 font-medium"
                  }
                >
                  {isTaskFull
                    ? "Full"
                    : `${task.requiredCompletions - task.completions} slots left`}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${isTaskFull ? "bg-red-400" : "bg-emerald-500"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs">
                📋
              </span>
              How to complete this task
            </h3>
            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600">
                  <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Target Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Task Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Target Account</span>
                <span className="text-sm font-medium text-gray-800">
                  {task.twitterHandle}
                </span>
              </div>
              {task.tweetUrl && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Tweet Link</span>
                  <a
                    href={task.tweetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 underline"
                  >
                    Open Tweet ↗
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Submit Proof */}
          {!isTaskFull ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Submit Proof</h3>
              <p className="text-sm text-gray-500 mb-4">
                Enter your Twitter username to confirm you completed the task
              </p>
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">
                  @
                </span>
                <input
                  type="text"
                  value={twitterUsername}
                  onChange={(e) => setTwitterUsername(e.target.value)}
                  placeholder="yourusername"
                  className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/tasks")}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-200 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                      Submitting...
                    </>
                  ) : (
                    `Submit & Earn $${task.reward}`
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <p className="font-semibold text-amber-800">This task is full</p>
              <p className="text-sm text-amber-600 mt-1">
                All slots have been taken. Browse other tasks.
              </p>
              <Link
                href="/tasks"
                className="inline-block mt-4 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-xl text-sm font-semibold transition"
              >
                Browse Tasks
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

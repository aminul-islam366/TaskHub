"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import Swal from "sweetalert2";

const instructionsMap = {
  "Twitter Follow": [
    "Open the Twitter account linked in the task details below.",
    "Click the Follow button from your Twitter profile.",
    "Make sure your Twitter account is set to public.",
    "Come back and enter your Twitter username as proof.",
  ],
  "Twitter Like": [
    "Open the tweet link provided in the task details below.",
    "Click the Like (heart ♥) button on the tweet.",
    "Ensure the like is visible on your public profile.",
    "Come back and enter your Twitter username as proof.",
  ],
  "Twitter Retweet": [
    "Open the tweet link provided in the task details below.",
    "Click the Retweet button and confirm the retweet.",
    "Make sure the retweet is visible on your public profile.",
    "Come back and enter your Twitter username as proof.",
  ],
};

const catCfg = {
  "Twitter Follow": {
    icon: "👥",
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  "Twitter Retweet": {
    icon: "🔄",
    pill: "bg-gray-100 text-gray-700 border border-gray-200",
  },
  "Twitter Like": {
    icon: "❤️",
    pill: "bg-red-50 text-red-600 border border-red-200",
  },
};

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="h-4 bg-gray-200 rounded w-24 mb-6 animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
            >
              <div className="h-5 bg-gray-100 rounded w-1/3 mb-3" />
              <div className="h-7 bg-gray-100 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TaskDetails() {
  const router = useRouter();
  const { id } = useParams();
  const { data: session, status } = useSession();
  const [task, setTask] = useState(null);
  const [username, setUsername] = useState("");
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
    if (!username.trim()) {
      Swal.fire({
        title: "Required",
        text: "Please enter your Twitter username",
        icon: "warning",
        confirmButtonColor: "#059669",
      });
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`/api/tasks/${task._id}/submission`, {
        twitterUsername: username.replace("@", ""),
      });
      Swal.fire({
        title: "Submitted!",
        html: `Your submission is pending review.<br/>Reward: <strong>$${task.reward}</strong>`,
        icon: "success",
        confirmButtonColor: "#059669",
        confirmButtonText: "View My Tasks",
      }).then(() => router.push("/my-tasks"));
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.error || "Submission failed",
        icon: "error",
        confirmButtonColor: "#059669",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !task) return <LoadingSkeleton />;

  const progress = Math.min(
    (task.completions / task.requiredCompletions) * 100,
    100,
  );
  const isFull = task.completions >= task.requiredCompletions;
  const slotsLeft = task.requiredCompletions - task.completions;
  const cfg = catCfg[task.category] || {
    icon: "📋",
    pill: "bg-gray-100 text-gray-700 border border-gray-200",
  };
  const steps = instructionsMap[task.category] || [
    "Complete the task and submit your proof.",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/tasks" className="hover:text-emerald-600 transition">
            Browse Tasks
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">
            {task.title}
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-4">
        {/* ── Hero Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Top accent bar */}
          <div
            className={`h-1.5 ${isFull ? "bg-gray-200" : "bg-emerald-500"}`}
          />

          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.pill} mb-3`}
                >
                  {cfg.icon} {task.category}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {task.title}
                </h1>
                {task.description && (
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    {task.description}
                  </p>
                )}
              </div>
              {/* Reward badge */}
              <div className="shrink-0 text-center bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-3">
                <div className="text-3xl font-bold text-emerald-600">
                  ${task.reward}
                </div>
                <div className="text-xs text-emerald-500 mt-0.5">per task</div>
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-5 pt-4 border-t border-gray-50">
              <span>
                Posted by{" "}
                <strong className="text-gray-700">
                  {task.createdByName || "TaskHub"}
                </strong>
              </span>
              <span>
                Target:{" "}
                <strong className="text-gray-700">{task.twitterHandle}</strong>
              </span>
              {task.tweetUrl && (
                <a
                  href={task.tweetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 font-semibold hover:underline flex items-center gap-1"
                >
                  View Tweet ↗
                </a>
              )}
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-500">
                  {task.completions} of {task.requiredCompletions} completed
                </span>
                <span
                  className={`font-semibold ${isFull ? "text-red-500" : "text-emerald-600"}`}
                >
                  {isFull
                    ? "All slots taken"
                    : `${slotsLeft} slot${slotsLeft !== 1 ? "s" : ""} remaining`}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${isFull ? "bg-gray-300" : "bg-emerald-500"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Instructions ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-7 h-7 bg-gray-900 text-white rounded-lg flex items-center justify-center text-xs">
              📋
            </span>
            Step-by-step Instructions
          </h2>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600">
                <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          {/* Important note */}
          <div className="mt-5 bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
            <span className="text-amber-500 text-lg shrink-0">⚠️</span>
            <p className="text-amber-700 text-xs leading-relaxed">
              Make sure your Twitter account is <strong>public</strong> before
              submitting. Private accounts cannot be verified and your
              submission will be rejected.
            </p>
          </div>
        </div>

        {/* ── Task Details ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Task Details</h2>
          <div className="divide-y divide-gray-50">
            {[
              { label: "Category", value: task.category },
              { label: "Target Account", value: task.twitterHandle },
              { label: "Reward", value: `$${task.reward} per completion` },
              { label: "Total Slots", value: task.requiredCompletions },
              { label: "Completed", value: task.completions },
              {
                label: "Status",
                value: isFull ? "Closed" : "Open",
                highlight: !isFull,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-2.5"
              >
                <span className="text-sm text-gray-500">{row.label}</span>
                <span
                  className={`text-sm font-medium ${row.highlight ? "text-emerald-600" : "text-gray-800"}`}
                >
                  {row.value}
                </span>
              </div>
            ))}
            {task.tweetUrl && (
              <div className="flex items-center justify-between py-2.5">
                <span className="text-sm text-gray-500">Tweet Link</span>
                <a
                  href={task.tweetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-emerald-600 hover:underline"
                >
                  Open Tweet ↗
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Submit Proof ── */}
        {!isFull ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-1">Submit Your Proof</h2>
            <p className="text-gray-500 text-sm mb-5">
              After completing the task on Twitter, enter your username below.
              The task creator will verify your submission.
            </p>

            <div className="relative mb-3">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm select-none">
                @
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace("@", ""))}
                placeholder="yourtwitterusername"
                className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition"
              />
            </div>

            <p className="text-xs text-gray-400 mb-5">
              Enter your username without the @ symbol. Example:{" "}
              <code className="bg-gray-100 px-1 rounded">johndoe</code>
            </p>

            <div className="flex gap-3">
              <Link
                href="/tasks"
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition text-center"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={submitting || !username.trim()}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
              🔒
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Task is Closed</h3>
            <p className="text-gray-500 text-sm mb-5">
              All slots have been filled. Browse other available tasks to keep
              earning.
            </p>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
            >
              Browse Other Tasks →
            </Link>
          </div>
        )}

        {/* ── Earnings info ── */}
        {!isFull && (
          <div className="bg-gray-900 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold text-sm">
                Your potential earnings
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                Reward is paid after the task creator approves your submission
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-bold text-emerald-400">
                ${task.reward}
              </div>
              <div className="text-gray-500 text-xs">this task</div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

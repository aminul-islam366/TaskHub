"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import axios from "axios";

const inputClass =
  "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition";

export default function CreateTask() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { register, handleSubmit, watch, reset, setValue } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const category = watch("category");
  const twitterHandle = watch("twitterHandle");
  const reward = watch("reward", 0);
  const requiredCompletions = watch("requiredCompletions", 0);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (!twitterHandle) return;
    const titles = {
      "Twitter Follow": `Follow ${twitterHandle} on Twitter`,
      "Twitter Like": `Like ${twitterHandle}'s tweet`,
      "Twitter Retweet": `Retweet ${twitterHandle}'s tweet`,
    };
    setValue("title", titles[category] || "");
  }, [category, twitterHandle, setValue]);

  const handleTask = async (data) => {
    setIsLoading(true);
    try {
      await axios.post("/api/tasks", { ...data, status: "active" });
      Swal.fire({
        title: "Task Created!",
        text: "Your task is now live.",
        icon: "success",
        confirmButtonText: "View Tasks",
        confirmButtonColor: "#059669",
        showCancelButton: true,
        cancelButtonText: "Create Another",
      }).then((result) => {
        if (result.isConfirmed) router.push("/tasks");
        else reset();
      });
    } catch {
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#059669",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!session) return null;

  const totalBudget = (
    (parseFloat(reward) || 0) * (parseInt(requiredCompletions) || 0)
  ).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create a Task</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details and publish your task
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit(handleTask)} className="space-y-5">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Task Category *
              </label>
              <select {...register("category")} required className={inputClass}>
                <option value="">Select a category</option>
                <option value="Twitter Follow">👥 Twitter Follow</option>
                <option value="Twitter Retweet">🔄 Twitter Retweet</option>
                <option value="Twitter Like">❤️ Twitter Like</option>
              </select>
            </div>

            {/* Twitter Handle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Twitter Handle *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">
                  @
                </span>
                <input
                  type="text"
                  {...register("twitterHandle")}
                  required
                  placeholder="username"
                  className={`${inputClass} pl-8`}
                />
              </div>
            </div>

            {/* Auto Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Task Title
              </label>
              <input
                type="text"
                {...register("title")}
                readOnly
                placeholder="Auto-generated from category & handle"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Generated automatically
              </p>
            </div>

            {/* Tweet URL */}
            {(category === "Twitter Retweet" ||
              category === "Twitter Like") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tweet URL *
                </label>
                <input
                  type="url"
                  {...register("tweetUrl")}
                  required
                  placeholder="https://twitter.com/..."
                  className={inputClass}
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Task Description *
              </label>
              <textarea
                {...register("description")}
                required
                rows={3}
                placeholder="Describe what workers need to do..."
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Reward & Completions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reward per Task ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register("reward")}
                  required
                  placeholder="0.50"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Number of Workers *
                </label>
                <input
                  type="number"
                  min="1"
                  {...register("requiredCompletions")}
                  required
                  placeholder="10"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Budget Summary */}
            {totalBudget > 0 && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-800">
                    Total Budget
                  </p>
                  <p className="text-xs text-emerald-600">
                    {requiredCompletions} workers × ${reward}
                  </p>
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  ${totalBudget}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/tasks")}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-200 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Publishing...
                  </>
                ) : (
                  "Publish Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

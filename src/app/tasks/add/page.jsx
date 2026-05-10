"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function CreateTask() {
  const router = useRouter();
  const { register, handleSubmit, watch, reset, setValue } = useForm();
  const category = watch("category");
  const twitterHandle = watch("twitterHandle");
  const reward = watch("reward", 0);
  const requiredCompletions = watch("requiredCompletions", 0);
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      return router.replace("/login");
    }
  }, [status, router]);

  // Auto-generate title based on category and Twitter handle
  useEffect(() => {
    if (!twitterHandle) return;

    let generatedTitle = "";
    switch (category) {
      case "Twitter Follow":
        generatedTitle = `Follow ${twitterHandle} on Twitter`;
        break;
      case "Twitter Like":
        generatedTitle = `Like ${twitterHandle}'s tweet`;
        break;
      case "Twitter Retweet":
        generatedTitle = `Retweet ${twitterHandle}'s tweet`;
        break;
      default:
        generatedTitle = "";
    }

    setValue("title", generatedTitle);
  }, [category, twitterHandle, setValue]);

  if (status === "loading") {
    return <div className="text-center mt-20">Loading...</div>;
  }
  if (!session) {
    return null;
  }

  const handleTask = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/tasks", {
        ...data,
        status: "active",
        userEmail: session.user.email,
        userName: session.user.name,
        createdAt: new Date(),
      });

      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Task created successfully!",
          icon: "success",
          confirmButtonText: "View Tasks",
          confirmButtonColor: "#059669",
          showCancelButton: true,
          cancelButtonText: "Create Another",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/tasks");
          } else {
            reset();
          }
        });
      }
    } catch (error) {
      console.error("Create task error:", error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Create New Task
          </h2>

          <form onSubmit={handleSubmit(handleTask)} className="space-y-6">
            {/* Auto-generated Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Task Title *
              </label>
              <input
                type="text"
                id="title"
                {...register("title")}
                readOnly
                className="input-style bg-gray-100 cursor-not-allowed"
                placeholder="Automatically generated title"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Task Category *
              </label>
              <select
                id="category"
                {...register("category")}
                required
                className="input-style"
              >
                <option value="">Select a category</option>
                <option value="Twitter Follow">Twitter Follow</option>
                <option value="Twitter Retweet">Twitter Retweet</option>
                <option value="Twitter Like">Twitter Like</option>
              </select>
            </div>

            {/* Twitter Handle */}
            <div>
              <label
                htmlFor="twitterHandle"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Twitter Handle *
              </label>
              <input
                type="text"
                id="twitterHandle"
                {...register("twitterHandle")}
                required
                className="input-style"
                placeholder="@username"
              />
            </div>

            {/* Tweet URL for Like / Retweet */}
            {(category === "Twitter Retweet" ||
              category === "Twitter Like") && (
              <div>
                <label
                  htmlFor="tweetUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tweet URL *
                </label>
                <input
                  type="url"
                  {...register("tweetUrl")}
                  id="tweetUrl"
                  name="tweetUrl"
                  required
                  className="input-style"
                  placeholder="Twitter URL..."
                />
              </div>
            )}

            {/* Task Details */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Task Details *
              </label>
              <textarea
                id="description"
                {...register("description")}
                required
                rows="4"
                className="input-style"
                placeholder="Describe what users need to do..."
              />
            </div>

            {/* Reward and Required Completions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="reward"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Reward per Task ($) *
                </label>
                <input
                  type="number"
                  id="reward"
                  {...register("reward")}
                  required
                  className="input-style"
                  placeholder="0.10"
                />
              </div>

              <div>
                <label
                  htmlFor="requiredCompletions"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Total Tasks *
                </label>
                <input
                  type="number"
                  id="requiredCompletions"
                  {...register("requiredCompletions")}
                  min="1"
                  required
                  className="input-style"
                  placeholder="10"
                />
              </div>
            </div>

            {/* Total Budget */}
            <div className="bg-emerald-50 p-4 rounded-lg">
              <p className="text-sm text-emerald-800">
                <strong>Total Budget:</strong> $
                {((reward || 0) * (requiredCompletions || 0)).toFixed(2)}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold cursor-pointer hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create Task"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/tasks")}
                className="flex-1 bg-gray-200 text-gray-700 cursor-pointer py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

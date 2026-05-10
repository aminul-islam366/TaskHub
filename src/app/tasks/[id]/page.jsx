"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";
import { IoIosArrowBack } from "react-icons/io";

const TaskDetails = () => {
  const router = useRouter();
  const params = useParams();
  const { status } = useSession();

  const [task, setTask] = useState(null);
  const [twitterUsername, setTwitterUsername] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch task
  const fetchTask = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/tasks/${params.id}`);
      setTask(data);
    } catch (error) {
      Swal.fire("Error", "Task not found", "error").then(() =>
        router.push("/tasks"),
      );
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated") {
      fetchTask();
    }
  }, [status, fetchTask, router]);

  // Instructions map
  const instructionsMap = {
    "Twitter Follow": [
      "Open the target Twitter account.",
      "Follow the account from your Twitter profile.",
      "Make sure your follow is public.",
      "Submit your Twitter username as proof.",
    ],
    "Twitter Like": [
      "Open the tweet link.",
      "Like the tweet from your Twitter account.",
      "Ensure the like is visible.",
      "Submit your Twitter username as proof.",
    ],
    "Twitter Retweet": [
      "Open the tweet link.",
      "Retweet the tweet from your Twitter account.",
      "Ensure the retweet is public.",
      "Submit your Twitter username as proof.",
    ],
  };

  const getInstructions = (category) =>
    instructionsMap[category] || ["Complete the task and submit the proof."];

  // Submit proof
  const handleSubmit = async () => {
    if (!twitterUsername.trim()) {
      Swal.fire("Username required", "Enter your Twitter username", "warning");
      return;
    }

    try {
      const { data } = await axios.post(
        `/api/tasks/${task._id.toString()}/submission`,
        { twitterUsername },
        { headers: { "Content-Type": "application/json" } },
      );

      Swal.fire("Submitted!", `You earned $${task.reward}`, "success").then(
        () => router.push("/tasks"),
      );
    } catch (error) {
      console.log("Submission error:", error.response?.data || error.message);
      Swal.fire("Error", error.response?.data?.error || error.message, "error");
    }
  };

  if (loading || !task) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading...
      </div>
    );
  }

  const progress = (task.completions / task.requiredCompletions) * 100;
  const isTaskFull = task.completions >= task.requiredCompletions;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Link href="/tasks" className="flex items-center text-emerald-600 mb-6">
          <IoIosArrowBack size={20} /> Back to Tasks
        </Link>

        <div className="bg-white rounded-xl shadow-xl p-8 space-y-8">
          <div className="flex justify-between border-b pb-6">
            <div>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                {task.category}
              </span>
              <h1 className="text-3xl font-bold mt-3">{task.title}</h1>
              <p className="text-sm text-gray-500">Posted by MicroBuyer</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-emerald-600">
                ${task.reward}
              </p>
              <p className="text-sm text-gray-500">per completion</p>
            </div>
          </div>

          {/* Task progress */}
          <div>
            <p className="text-sm text-gray-500 mb-1">Task Progress</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-3">
              What is expected from freelancers?
            </h3>
            <ol className="list-decimal ml-5 space-y-2">
              {getInstructions(task.category).map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Target */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <p>
              <strong>Target Account:</strong> {task.twitterHandle}
            </p>
            {task.tweetUrl && (
              <p className="mt-2">
                <strong>Tweet Link:</strong>{" "}
                <a
                  href={task.tweetUrl}
                  target="_blank"
                  className="text-emerald-600 underline"
                >
                  Open Tweet
                </a>
              </p>
            )}
          </div>

          {/* Submit Proof */}
          {!isTaskFull && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold">Submit Proof</h3>
              <input
                type="text"
                value={twitterUsername}
                onChange={(e) => setTwitterUsername(e.target.value)}
                placeholder="@username"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => router.push("/tasks")}
                  className="px-6 py-2 bg-gray-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Submit Completion
                </button>
              </div>
            </div>
          )}

          {isTaskFull && (
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center">
              Task completion limit reached
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;

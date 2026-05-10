"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Swal from "sweetalert2";

export default function MyTasks() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [myCreatedTasks, setMyCreatedTasks] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState("created");
  const [earnings, setEarnings] = useState({
    totalEarned: 0,
    pendingEarnings: 0,
    approvedCount: 0,
    pendingCount: 0,
    rejectedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      Swal.fire({
        title: "Authentication Required",
        text: "Please login to view your tasks.",
        icon: "warning",
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#059669",
      }).then(() => {
        router.push("/login");
      });
      return;
    }

    fetchMyTasks();
  }, [session, status, router]);

  const fetchMyTasks = async () => {
    try {
      const response = await fetch("/api/tasks/my-tasks");
      if (response.ok) {
        const tasks = await response.json();
        setMyCreatedTasks(tasks);

        // Calculate submissions and earnings
        const allSubmissions = [];
        let totalEarned = 0;
        let pendingEarnings = 0;
        let approvedCount = 0;
        let pendingCount = 0;
        let rejectedCount = 0;

        tasks.forEach((task) => {
          if (task.submissions) {
            task.submissions.forEach((submission) => {
              allSubmissions.push({
                ...submission,
                taskTitle: task.title,
                taskId: task._id,
                taskCategory: task.category,
                taskReward: task.reward,
              });

              if (submission.status === "approved") {
                totalEarned += task.reward;
                approvedCount++;
              } else if (submission.status === "pending") {
                pendingEarnings += task.reward;
                pendingCount++;
              } else if (submission.status === "rejected") {
                rejectedCount++;
              }
            });
          }
        });

        setMySubmissions(allSubmissions);
        setEarnings({
          totalEarned,
          pendingEarnings,
          approvedCount,
          pendingCount,
          rejectedCount,
        });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmission = async (taskId, submissionId, approve) => {
    Swal.fire({
      title: approve ? "Approve Submission?" : "Reject Submission?",
      text: approve
        ? "This will mark the submission as verified and pay the user."
        : "This will reject the submission.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: approve ? "Approve" : "Reject",
      confirmButtonColor: approve ? "#10B981" : "#EF4444",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `/api/tasks/${taskId}/submissions/${submissionId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ action: approve ? "approve" : "reject" }),
            },
          );

          if (response.ok) {
            Swal.fire({
              title: approve ? "Approved!" : "Rejected!",
              text: `Submission has been ${approve ? "approved" : "rejected"}.`,
              icon: approve ? "success" : "info",
              confirmButtonColor: "#059669",
            });
            fetchMyTasks(); // Refresh data
          } else {
            const error = await response.json();
            Swal.fire({
              title: "Error",
              text: error.error || "Failed to update submission",
              icon: "error",
              confirmButtonColor: "#059669",
            });
          }
        } catch (error) {
          console.error("Error updating submission:", error);
          Swal.fire({
            title: "Error",
            text: "Something went wrong",
            icon: "error",
            confirmButtonColor: "#059669",
          });
        }
      }
    });
  };

  const handleDeleteTask = async (taskId) => {
    Swal.fire({
      title: "Delete Task?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            Swal.fire({
              title: "Deleted!",
              text: "Task has been deleted.",
              icon: "success",
              confirmButtonColor: "#059669",
            });
            fetchMyTasks(); // Refresh data
          } else {
            const error = await response.json();
            Swal.fire({
              title: "Error",
              text: error.error || "Failed to delete task",
              icon: "error",
              confirmButtonColor: "#059669",
            });
          }
        } catch (error) {
          console.error("Error deleting task:", error);
          Swal.fire({
            title: "Error",
            text: "Something went wrong",
            icon: "error",
            confirmButtonColor: "#059669",
          });
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Tasks</h1>
          <p className="text-gray-600 text-lg">
            Manage your created tasks and track your submissions
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("created")}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === "created"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Created Tasks ({myCreatedTasks.length})
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === "submissions"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              My Submissions ({mySubmissions.length})
            </button>
          </div>
        </div>

        {/* Created Tasks Tab */}
        {activeTab === "created" && (
          <div>
            {myCreatedTasks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  No Tasks Created Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first task to get started!
                </p>
                <Link
                  href="/tasks/add"
                  className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  Create Task
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {myCreatedTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {task.title}
                        </h3>
                        <p className="text-gray-600">{task.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">
                          ${task.reward}
                        </div>
                        <p className="text-sm text-gray-600">per completion</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold text-gray-800">
                          {task.category}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Completions</p>
                        <p className="font-semibold text-gray-800">
                          {task.completions} / {task.requiredCompletions}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Pending Reviews</p>
                        <p className="font-semibold text-gray-800">
                          {task.submissions?.filter(
                            (s) => s.status === "pending",
                          ).length || 0}
                        </p>
                      </div>
                    </div>

                    {task.submissions && task.submissions.length > 0 && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="font-semibold text-gray-800 mb-3">
                          Submissions
                        </h4>
                        <div className="space-y-2">
                          {task.submissions.map((submission) => (
                            <div
                              key={submission._id}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                            >
                              <div>
                                <p className="font-semibold text-gray-800">
                                  @{submission.twitterUsername}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(
                                    submission.submittedAt,
                                  ).toLocaleString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}
                                >
                                  {submission.status}
                                </span>
                                {submission.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleVerifySubmission(
                                          task._id,
                                          submission._id,
                                          true,
                                        )
                                      }
                                      className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleVerifySubmission(
                                          task._id,
                                          submission._id,
                                          false,
                                        )
                                      }
                                      className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Link
                        href={`/tasks/${task._id}`}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
                      >
                        View Task
                      </Link>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                      >
                        Delete Task
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Submissions Tab */}
        {activeTab === "submissions" && (
          <div>
            {/* Earnings Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Earnings Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${earnings.totalEarned.toFixed(2)}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    ${earnings.pendingEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Approved</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {earnings.approvedCount}
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {earnings.rejectedCount}
                  </p>
                </div>
              </div>
            </div>

            {mySubmissions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  No Submissions Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Complete some tasks to see your submissions here!
                </p>
                <Link
                  href="/tasks"
                  className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  Browse Tasks
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {mySubmissions.map((submission) => (
                  <div
                    key={`${submission.taskId}-${submission._id}`}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {submission.taskTitle}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {submission.taskCategory}
                        </p>
                        <p className="text-sm text-gray-500">
                          Submitted:{" "}
                          {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-emerald-600 mb-1">
                          ${submission.taskReward}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(submission.status)}`}
                        >
                          {submission.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

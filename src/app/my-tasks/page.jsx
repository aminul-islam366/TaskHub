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
  const [taskSubmissions, setTaskSubmissions] = useState({});
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
      }).then(() => router.push("/login"));
      return;
    }
    fetchMyTasks();
  }, [session, status, router]);

  const fetchMyTasks = async () => {
    try {
      const [tasksRes, submissionsRes] = await Promise.all([
        fetch("/api/tasks/my-tasks"),
        fetch("/api/submissions"),
      ]);

      if (tasksRes.ok) {
        const tasks = await tasksRes.json();
        setMyCreatedTasks(tasks);

        // Fetch submissions for each created task
        const subMap = {};
        await Promise.all(
          tasks.map(async (task) => {
            const res = await fetch(`/api/tasks/${task._id}/submissions`);
            subMap[task._id] = res.ok ? await res.json() : [];
          }),
        );
        setTaskSubmissions(subMap);
      }

      if (submissionsRes.ok) {
        const submissions = await submissionsRes.json();
        setMySubmissions(submissions);

        let totalEarned = 0,
          pendingEarnings = 0,
          approvedCount = 0,
          pendingCount = 0,
          rejectedCount = 0;
        submissions.forEach((sub) => {
          const reward = parseFloat(sub.taskReward || 0);
          if (sub.status === "approved") {
            totalEarned += reward;
            approvedCount++;
          } else if (sub.status === "pending") {
            pendingEarnings += reward;
            pendingCount++;
          } else if (sub.status === "rejected") {
            rejectedCount++;
          }
        });
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
    const result = await Swal.fire({
      title: approve ? "Approve Submission?" : "Reject Submission?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: approve ? "Approve" : "Reject",
      confirmButtonColor: approve ? "#10B981" : "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(
        `/api/tasks/${taskId}/submissions/${submissionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: approve ? "approve" : "reject" }),
        },
      );

      if (res.ok) {
        Swal.fire({
          title: approve ? "Approved!" : "Rejected!",
          icon: approve ? "success" : "info",
          confirmButtonColor: "#059669",
        });
        fetchMyTasks();
      } else {
        const err = await res.json();
        Swal.fire("Error", err.error || "Failed to update", "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: "Delete Task?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        Swal.fire("Deleted!", "Task has been deleted.", "success");
        fetchMyTasks();
      } else {
        const err = await res.json();
        Swal.fire("Error", err.error || "Failed to delete", "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const getStatusColor = (status) => {
    if (status === "approved") return "bg-green-100 text-green-800";
    if (status === "rejected") return "bg-red-100 text-red-800";
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
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

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Tasks</h1>
          <p className="text-gray-600">
            Manage your created tasks and track your submissions
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("created")}
              className={`flex-1 py-4 px-6 font-semibold transition ${activeTab === "created" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-600 hover:text-gray-800"}`}
            >
              Created Tasks ({myCreatedTasks.length})
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className={`flex-1 py-4 px-6 font-semibold transition ${activeTab === "submissions" ? "text-emerald-600 border-b-2 border-emerald-600" : "text-gray-600 hover:text-gray-800"}`}
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
                {myCreatedTasks.map((task) => {
                  const subs = taskSubmissions[task._id] || [];
                  return (
                    <div
                      key={task._id}
                      className="bg-white rounded-xl shadow-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-1">
                            {task.title}
                          </h3>
                          <p className="text-gray-600">{task.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">
                            ${task.reward}
                          </div>
                          <p className="text-sm text-gray-600">
                            per completion
                          </p>
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
                          <p className="text-sm text-gray-600">
                            Pending Reviews
                          </p>
                          <p className="font-semibold text-gray-800">
                            {subs.filter((s) => s.status === "pending").length}
                          </p>
                        </div>
                      </div>

                      {subs.length > 0 && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Submissions
                          </h4>
                          <div className="space-y-2">
                            {subs.map((sub) => (
                              <div
                                key={sub._id}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                              >
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    @{sub.username}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    by {sub.submittedBy} &middot;{" "}
                                    {new Date(sub.submittedAt).toLocaleString()}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sub.status)}`}
                                  >
                                    {sub.status}
                                  </span>
                                  {sub.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleVerifySubmission(
                                            task._id,
                                            sub._id,
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
                                            sub._id,
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
                  );
                })}
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
                {mySubmissions.map((sub) => (
                  <div
                    key={sub._id}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {sub.taskTitle}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">
                          {sub.taskCategory}
                        </p>
                        <p className="text-sm text-gray-500">
                          Submitted:{" "}
                          {new Date(sub.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-emerald-600 mb-1">
                          ${sub.taskReward}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sub.status)}`}
                        >
                          {sub.status}
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

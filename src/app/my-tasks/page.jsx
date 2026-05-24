"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Swal from "sweetalert2";

const statusCfg = {
  approved:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
};

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
        title: "Login Required",
        text: "Please login to view your tasks.",
        icon: "warning",
        confirmButtonColor: "#059669",
      }).then(() => router.push("/login"));
      return;
    }
    fetchMyTasks();
  }, [session, status, router]);

  const fetchMyTasks = async () => {
    try {
      const [tasksRes, subsRes] = await Promise.all([
        fetch("/api/tasks/my-tasks"),
        fetch("/api/submissions"),
      ]);
      if (tasksRes.ok) {
        const tasks = await tasksRes.json();
        setMyCreatedTasks(tasks);
        const subMap = {};
        await Promise.all(
          tasks.map(async (t) => {
            const r = await fetch(`/api/tasks/${t._id}/submissions`);
            subMap[t._id] = r.ok ? await r.json() : [];
          }),
        );
        setTaskSubmissions(subMap);
      }
      if (subsRes.ok) {
        const subs = await subsRes.json();
        setMySubmissions(subs);
        let totalEarned = 0,
          pendingEarnings = 0,
          approvedCount = 0,
          pendingCount = 0,
          rejectedCount = 0;
        subs.forEach((s) => {
          const r = parseFloat(s.taskReward || 0);
          if (s.status === "approved") {
            totalEarned += r;
            approvedCount++;
          } else if (s.status === "pending") {
            pendingEarnings += r;
            pendingCount++;
          } else if (s.status === "rejected") rejectedCount++;
        });
        setEarnings({
          totalEarned,
          pendingEarnings,
          approvedCount,
          pendingCount,
          rejectedCount,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (taskId, subId, approve) => {
    const r = await Swal.fire({
      title: approve ? "Approve?" : "Reject?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: approve ? "Approve" : "Reject",
      confirmButtonColor: approve ? "#059669" : "#EF4444",
      cancelButtonColor: "#6B7280",
    });
    if (!r.isConfirmed) return;
    const res = await fetch(`/api/tasks/${taskId}/submissions/${subId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: approve ? "approve" : "reject" }),
    });
    if (res.ok) {
      Swal.fire({
        title: approve ? "Approved!" : "Rejected!",
        icon: approve ? "success" : "info",
        confirmButtonColor: "#059669",
      });
      fetchMyTasks();
    } else {
      const e = await res.json();
      Swal.fire("Error", e.error || "Failed", "error");
    }
  };

  const handleDelete = async (taskId) => {
    const r = await Swal.fire({
      title: "Delete Task?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });
    if (!r.isConfirmed) return;
    const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    if (res.ok) {
      Swal.fire("Deleted!", "", "success");
      fetchMyTasks();
    } else {
      const e = await res.json();
      Swal.fire("Error", e.error || "Failed", "error");
    }
  };

  if (status === "loading" || loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gray-900 dark:bg-gray-950 border-b border-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold">My Tasks</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Manage your tasks and track submissions
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 mb-6 overflow-hidden">
          <div className="flex">
            {[
              {
                key: "created",
                label: "Created Tasks",
                count: myCreatedTasks.length,
              },
              {
                key: "submissions",
                label: "My Submissions",
                count: mySubmissions.length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 px-4 sm:px-6 text-sm font-semibold transition border-b-2 ${
                  activeTab === tab.key
                    ? "text-emerald-600 border-emerald-600 dark:text-emerald-400 dark:border-emerald-400"
                    : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.key ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Created Tasks */}
        {activeTab === "created" && (
          <div>
            {myCreatedTasks.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  📋
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Tasks Created Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Create your first task to get started
                </p>
                <Link
                  href="/tasks/add"
                  className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition"
                >
                  Create Task
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {myCreatedTasks.map((task) => {
                  const subs = taskSubmissions[task._id] || [];
                  const pendingCount = subs.filter(
                    (s) => s.status === "pending",
                  ).length;
                  return (
                    <div
                      key={task._id}
                      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1 truncate">
                              {task.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1">
                              {task.description}
                            </p>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                              ${task.reward}
                            </div>
                            <p className="text-xs text-gray-400">
                              per completion
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {[
                            {
                              label: "Category",
                              value: task.category?.replace("Twitter ", ""),
                            },
                            {
                              label: "Progress",
                              value: `${task.completions}/${task.requiredCompletions}`,
                            },
                            {
                              label: "Pending",
                              value: pendingCount,
                              highlight: pendingCount > 0,
                            },
                          ].map((s) => (
                            <div
                              key={s.label}
                              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center"
                            >
                              <p className="text-xs text-gray-400 mb-1">
                                {s.label}
                              </p>
                              <p
                                className={`font-semibold text-sm ${s.highlight ? "text-yellow-600 dark:text-yellow-400" : "text-gray-900 dark:text-white"}`}
                              >
                                {s.value}
                              </p>
                            </div>
                          ))}
                        </div>

                        {subs.length > 0 && (
                          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
                              Submissions ({subs.length})
                            </h4>
                            <div className="space-y-2">
                              {subs.map((sub) => (
                                <div
                                  key={sub._id}
                                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl"
                                >
                                  <div className="min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                      @{sub.username}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {sub.submittedBy} ·{" "}
                                      {new Date(
                                        sub.submittedAt,
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg[sub.status] || statusCfg.pending}`}
                                    >
                                      {sub.status}
                                    </span>
                                    {sub.status === "pending" && (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleVerify(
                                              task._id,
                                              sub._id,
                                              true,
                                            )
                                          }
                                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleVerify(
                                              task._id,
                                              sub._id,
                                              false,
                                            )
                                          }
                                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition"
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

                        <div className="flex flex-wrap gap-2 mt-4">
                          <Link
                            href={`/tasks/${task._id}`}
                            className="px-4 py-2 bg-gray-900 dark:bg-gray-700 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition"
                          >
                            View Task
                          </Link>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div>
            {/* Earnings */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "Total Earned",
                  value: `$${earnings.totalEarned.toFixed(2)}`,
                  color: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  label: "Pending",
                  value: `$${earnings.pendingEarnings.toFixed(2)}`,
                  color: "text-yellow-600 dark:text-yellow-400",
                },
                {
                  label: "Approved",
                  value: earnings.approvedCount,
                  color: "text-gray-900 dark:text-white",
                },
                {
                  label: "Rejected",
                  value: earnings.rejectedCount,
                  color: "text-red-600 dark:text-red-400",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 text-center"
                >
                  <p className="text-xs text-gray-400 mb-2">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {mySubmissions.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  📝
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Submissions Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Complete some tasks to see your submissions here
                </p>
                <Link
                  href="/tasks"
                  className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition"
                >
                  Browse Tasks
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {mySubmissions.map((sub) => (
                  <div
                    key={sub._id}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {sub.taskTitle}
                        </h3>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {sub.taskCategory} ·{" "}
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          ${sub.taskReward}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg[sub.status] || statusCfg.pending}`}
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
      <Footer />
    </div>
  );
}

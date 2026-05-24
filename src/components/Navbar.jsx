"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import { useTheme } from "./ThemeProvider";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { dark, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeAll = () => {
    setProfileOpen(false);
    setMenuOpen(false);
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Browse Tasks", href: "/tasks" },
    ...(session
      ? [
          { name: "Create Task", href: "/tasks/add" },
          { name: "My Tasks", href: "/my-tasks" },
        ]
      : []),
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = () => {
    closeAll();
    Swal.fire({
      title: "Sign out?",
      text: "You will be logged out of your account.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sign out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#059669",
      cancelButtonColor: "#6B7280",
    }).then((r) => {
      if (r.isConfirmed)
        signOut({ redirect: false }).then(() => router.push("/"));
    });
  };

  const isActive = (href) => pathname === href;
  const avatarLetter = session?.user?.name?.[0]?.toUpperCase() || "?";
  const avatarColors = [
    "bg-violet-500",
    "bg-blue-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-teal-500",
  ];
  const avatarColor =
    avatarColors[avatarLetter.charCodeAt(0) % avatarColors.length];

  return (
    <nav className="bg-gray-900 dark:bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <span className="text-lg font-bold text-white">TaskHub</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition"
            >
              {dark ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Auth — desktop */}
            <div className="hidden lg:flex items-center gap-2">
              {session ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-xl transition border border-gray-700"
                  >
                    <div
                      className={`w-7 h-7 ${avatarColor} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}
                    >
                      {avatarLetter}
                    </div>
                    <span className="text-white text-sm font-medium max-w-[100px] truncate">
                      {session.user.name}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
                      <div className="px-4 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold`}
                          >
                            {avatarLetter}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                              {session.user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {session.user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        {[
                          {
                            href: "/my-tasks",
                            icon: "📋",
                            bg: "bg-emerald-100 dark:bg-emerald-900",
                            label: "My Tasks",
                            sub: "View created & submitted",
                          },
                          {
                            href: "/tasks/add",
                            icon: "➕",
                            bg: "bg-gray-100 dark:bg-gray-800",
                            label: "Create Task",
                            sub: "Post a new task",
                          },
                          {
                            href: "/tasks",
                            icon: "🔍",
                            bg: "bg-gray-100 dark:bg-gray-800",
                            label: "Browse Tasks",
                            sub: "Find tasks to complete",
                          },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeAll}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                          >
                            <span
                              className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center text-base shrink-0`}
                            >
                              {item.icon}
                            </span>
                            <div>
                              <p className="font-medium">{item.label}</p>
                              <p className="text-xs text-gray-400">
                                {item.sub}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 dark:border-gray-800 py-2">
                        <Link
                          href="/contact"
                          onClick={closeAll}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          <span className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-base shrink-0">
                            💬
                          </span>
                          <p className="font-medium">Support</p>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                          <span className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-base shrink-0">
                            🚪
                          </span>
                          <p className="font-medium">Sign out</p>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-400 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center text-white rounded-lg hover:bg-gray-800 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-800 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeAll}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-800 mt-2">
              {session ? (
                <div className="px-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 ${avatarColor} rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}
                    >
                      {avatarLetter}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {session.user.name}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 px-4">
                  <Link
                    href="/login"
                    onClick={closeAll}
                    className="flex-1 text-center py-2.5 text-gray-400 text-sm font-medium hover:text-white transition"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeAll}
                    className="flex-1 text-center py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

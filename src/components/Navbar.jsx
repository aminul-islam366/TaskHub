"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import NavLink from "./NavLink";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  console.log(session);

  const links = [
    { name: "Home", href: "/" },
    { name: "Browse Tasks", href: "/tasks" },
  ];
  if (session) {
    links.push(
      { name: "Create Task", href: "/tasks/add" },
      { name: "My Tasks", href: "/my-tasks" },
    );
  }
  links.push(
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  );

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#059669",
      cancelButtonColor: "#6B7280",
    }).then((result) => {
      if (result.isConfirmed) {
        signOut({ redirect: false }).then(() => {
          Swal.fire({
            title: "Logged Out",
            text: "You have been successfully logged out.",
            icon: "success",
            confirmButtonColor: "#059669",
            timer: 1500,
            showConfirmButton: false,
          });
          router.push("/");
          router.refresh();
        });
      }
    });
  };
  return (
    <div className="shadow-lg mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-green-700 text-white">
      <header className="">
        <div className="navbar">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content rounded-box z-10 mt-3 w-52 p-2 shadow"
              >
                {links.map((link, index) => (
                  <NavLink key={index} link={link} />
                ))}
              </ul>
            </div>
            <Link href="/">
              <h1 className="text-3xl font-bold cursor-pointer hover:text-green-300 transition">
                TaskHub
              </h1>
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              {links.map((link, index) => (
                <NavLink key={index} link={link} />
              ))}
            </ul>
          </div>

          <div className="navbar-end">
            {session ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-green-400">
                <span className="text-sm">Hi, {session.user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3 ml-4 pl-4 border-l border-green-400">
                <Link
                  href="/login"
                  className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

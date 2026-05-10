"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (formData.password !== formData.confirmPassword) {
  //     Swal.fire({
  //       title: "Error",
  //       text: "Passwords do not match!",
  //       icon: "error",
  //       confirmButtonColor: "#059669",
  //     });
  //     return;
  //   }

  //   if (formData.password.length < 6) {
  //     Swal.fire({
  //       title: "Error",
  //       text: "Password must be at least 6 characters long!",
  //       icon: "error",
  //       confirmButtonColor: "#059669",
  //     });
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     const response = await fetch("/api/auth/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: formData.name,
  //         email: formData.email,
  //         password: formData.password,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       Swal.fire({
  //         title: "Success!",
  //         text: "Account created successfully! Please login.",
  //         icon: "success",
  //         confirmButtonColor: "#059669",
  //       }).then(() => {
  //         router.push("/login");
  //       });
  //     } else {
  //       Swal.fire({
  //         title: "Registration Failed",
  //         text: data.error || "User already exists or invalid data",
  //         icon: "error",
  //         confirmButtonColor: "#059669",
  //       });
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Error",
  //       text: "Something went wrong. Please try again.",
  //       icon: "error",
  //       confirmButtonColor: "#059669",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleRegister = async (data) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match!",
        icon: "error",
        confirmButtonColor: "#059669",
      });
      return;
    }

    if (data.password.length < 6) {
      Swal.fire({
        title: "Error",
        text: "Password must be at least 6 characters long!",
        icon: "error",
        confirmButtonColor: "#059669",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Account created successfully! Please login.",
          icon: "success",
          confirmButtonColor: "#059669",
        }).then(() => {
          router.push("/login");
        });
      } else {
        Swal.fire({
          title: "Registration Failed",
          text: result.error || "User already exists or invalid data",
          icon: "error",
          confirmButtonColor: "#059669",
        });
      }
    } catch (error) {
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

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">Join TaskHub and start earning</p>
          </div>

          <form onSubmit={handleSubmit(handleRegister)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", {
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-emerald-600 font-semibold hover:text-emerald-700"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

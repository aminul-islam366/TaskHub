"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleLogin = async (data) => {
    setIsLoading(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      Swal.fire("Login Failed", "Invalid email or password", "error");
    } else if (result?.ok) {
      Swal.fire({
        title: "Welcome Back!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      setTimeout(() => router.push("/"), 1500);
    }

    setIsLoading(false);
  };

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              required
              className="w-full p-3 border rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              required
              className="w-full p-3 border rounded-lg"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white p-3 rounded-lg"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-emerald-600 font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

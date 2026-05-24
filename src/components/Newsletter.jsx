"use client";

import { useState } from "react";
import Swal from "sweetalert2";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Subscribed!",
      text: "You'll receive the latest tasks and updates.",
      icon: "success",
      confirmButtonColor: "#059669",
    });
    setEmail("");
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Stay in the loop</h2>
        <p className="text-gray-400 text-sm mb-6">
          Get notified about new tasks, tips, and platform updates.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
        <p className="text-gray-600 text-xs mt-3">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;

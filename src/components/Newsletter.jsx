import React, { useState } from "react";
import Swal from "sweetalert2";

const Newsletter = () => {
  const items = [
    {
      icon: " 🎯",
      subheadeing: " New Tasks",
      text: "  Get notified about fresh tasks",
    },
    {
      icon: " 💰",
      subheadeing: " Earning Tips",
      text: "Learn how to maximize earnings",
    },
    {
      icon: " 📊",
      subheadeing: " Platform Updates",
      text: "Stay informed about new features",
    },
  ];
  const [email, setEmail] = useState("");
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();

    const subscribers = JSON.parse(localStorage.getItem("subscribers") || "[]");
    subscribers.push({
      email,
      date: new Date().toISOString(),
    });
    localStorage.setItem("subscribers", JSON.stringify(subscribers));

    Swal.fire({
      title: "Thank You!",
      text: "You have successfully subscribed to our newsletter!",
      icon: "success",
      confirmButtonText: "Great!",
      confirmButtonColor: "#059669",
    });

    setEmail("");
  };
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className="text-4xl font-bold mb-4">Stay Updated with TaskHub</h3>
          <p className="text-xl text-gray-300">
            Subscribe to get the latest tasks, tips, and platform updates!
          </p>
        </div>

        <form onSubmit={handleNewsletterSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-lg border border-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4 text-center">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates.
          </p>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {items.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h4 className="font-semibold mb-2">{item.subheadeing}</h4>
              <p className="text-gray-400 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

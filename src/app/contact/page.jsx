"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Swal from "sweetalert2";

const contactInfo = [
  {
    icon: "📧",
    label: "Email",
    value: "support@taskhub.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: "🐦",
    label: "Twitter",
    value: "@TaskHubOfficial",
    sub: "DM us anytime",
  },
  {
    icon: "💬",
    label: "Live Chat",
    value: "Available 24/7",
    sub: "Instant support",
  },
  {
    icon: "🕐",
    label: "Response Time",
    value: "Under 24 hours",
    sub: "Business days",
  },
];

const inp =
  "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 focus:bg-white transition";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      Swal.fire({
        title: "Message Sent!",
        text: "We will get back to you within 24 hours.",
        icon: "success",
        confirmButtonColor: "#059669",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="bg-gray-900 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-gray-800 border border-gray-700 text-emerald-400 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
            Support
          </span>
          <h1 className="text-4xl font-bold mb-3">Get in Touch</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Have a question, issue, or feedback? Our team is ready to help you.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Send a Message
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Fill in the form and we will respond promptly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className={inp}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className={inp}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describe your issue or question in detail..."
                  className={inp + " resize-none"}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Sending...
                  </>
                ) : (
                  "Send Message →"
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((c) => (
              <div
                key={c.label}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-lg shrink-0">
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                    {c.label}
                  </p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">
                    {c.value}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{c.sub}</p>
                </div>
              </div>
            ))}

            <div className="bg-gray-900 rounded-2xl p-6 text-white">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-lg mb-3">
                ⚡
              </div>
              <h3 className="font-bold mb-2">Need urgent help?</h3>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                For urgent task or payment issues, reach us on Twitter for the
                fastest response.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
              >
                @TaskHubOfficial ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const stats = [
  { value: "50K+", label: "Tasks Completed" },
  { value: "10K+", label: "Active Users" },
  { value: "5K+", label: "Daily Tasks" },
  { value: "98%", label: "Satisfaction Rate" },
];

const values = [
  {
    icon: "🎯",
    title: "Our Mission",
    desc: "Connect people who want to grow their Twitter presence with users who earn rewards by completing simple tasks.",
  },
  {
    icon: "💡",
    title: "Innovation",
    desc: "We constantly improve our verification system and user experience to ensure quality and fairness for everyone.",
  },
  {
    icon: "🤝",
    title: "Trust",
    desc: "Building trust through transparent processes, secure verification, and reliable reward systems.",
  },
];

const steps = [
  {
    title: "Create or Browse Tasks",
    desc: "Task creators post Twitter tasks with rewards. Users browse and pick what suits them.",
  },
  {
    title: "Complete the Action",
    desc: "Users complete the required action on Twitter and submit their username as proof.",
  },
  {
    title: "Verification",
    desc: "Task creators review submissions to ensure tasks were completed correctly.",
  },
  {
    title: "Earn Rewards",
    desc: "Once verified, users receive their rewards and can continue completing more tasks.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-gray-800 border border-gray-700 text-emerald-400 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4">
            About Us
          </span>
          <h1 className="text-4xl font-bold mb-4">The Story Behind TaskHub</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            We built TaskHub to make Twitter growth accessible and to give
            everyone a way to earn from simple social tasks.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Mission */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            At TaskHub, we connect people who want to grow their Twitter
            presence with users who want to earn rewards by completing simple
            tasks. Our platform makes it easy to increase followers, boost
            engagement, and build a stronger social media presence.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We believe in creating a fair and transparent marketplace where
            everyone benefits — task creators get real engagement, and task
            completers earn rewards for their time.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl mb-4">
                {v.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gray-900 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            TaskHub by the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-emerald-400 mb-1">
                  {s.value}
                </div>
                <p className="text-gray-400 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How TaskHub Works
          </h2>
          <div className="space-y-5">
            {steps.map((s, i) => (
              <div key={s.title} className="flex gap-4">
                <div className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {s.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-900 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to get started?
          </h2>
          <p className="text-gray-400 mb-6 text-sm">
            Join thousands of users on TaskHub today.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/register"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition"
            >
              Create Account
            </Link>
            <Link
              href="/tasks"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition"
            >
              Browse Tasks
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

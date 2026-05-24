const features = [
  {
    icon: "⚡",
    title: "Instant Task Access",
    desc: "Browse and start completing tasks immediately after signing up. No waiting period.",
  },
  {
    icon: "🔒",
    title: "Secure & Verified",
    desc: "Every submission is reviewed by task creators ensuring quality and fair rewards.",
  },
  {
    icon: "📈",
    title: "Grow Your Audience",
    desc: "Post tasks to get real Twitter followers, likes, and retweets from active users.",
  },
  {
    icon: "💸",
    title: "Flexible Rewards",
    desc: "Set your own reward per task. Pay only for verified completions.",
  },
  {
    icon: "📊",
    title: "Track Everything",
    desc: "Monitor your tasks, submissions, earnings, and approval status in real time.",
  },
  {
    icon: "🌍",
    title: "Global Community",
    desc: "Connect with thousands of users from around the world completing tasks daily.",
  },
];

const FeaturesSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <span className="text-emerald-600 font-semibold text-xs uppercase tracking-widest">
          Why TaskHub
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          Everything you need to succeed
        </h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
          Built for both task creators and earners with powerful tools and a
          simple interface
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all group"
          >
            <div className="w-11 h-11 bg-gray-100 group-hover:bg-emerald-50 rounded-xl flex items-center justify-center text-xl mb-4 transition-colors">
              {f.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;

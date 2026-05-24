const steps = [
  {
    num: "01",
    title: "Browse Tasks",
    desc: "Explore available Twitter tasks filtered by category and reward amount.",
    icon: "🔍",
  },
  {
    num: "02",
    title: "Complete Action",
    desc: "Follow, Retweet, or Like the target account or tweet on Twitter.",
    icon: "⚡",
  },
  {
    num: "03",
    title: "Submit Proof",
    desc: "Enter your Twitter username to confirm you completed the task.",
    icon: "📝",
  },
  {
    num: "04",
    title: "Earn Rewards",
    desc: "Get approved and receive your reward directly to your account.",
    icon: "💰",
  },
];

const Works = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <span className="text-emerald-600 font-semibold text-xs uppercase tracking-widest">
          Simple Process
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          How TaskHub Works
        </h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
          Start earning in minutes with our simple 4-step process
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <div key={step.num} className="relative text-center">
            {i < steps.length - 1 && (
              <div
                className="hidden lg:block absolute top-8 h-px bg-gray-200 z-0"
                style={{ left: "calc(50% + 2rem)", right: "calc(-50% + 2rem)" }}
              />
            )}
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                {step.icon}
              </div>
              <div className="text-xs font-bold text-emerald-600 mb-1 tracking-widest">
                {step.num}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Works;

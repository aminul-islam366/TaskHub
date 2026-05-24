const stats = [
  { icon: "📋", value: "320+", label: "Tasks Created" },
  { icon: "✅", value: "210+", label: "Active Tasks" },
  { icon: "🎯", value: "3,320+", label: "Completions" },
  { icon: "💰", value: "$340+", label: "Rewards Paid" },
];

const DashboardOverview = () => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <span className="text-emerald-600 font-semibold text-xs uppercase tracking-widest">
          Platform Stats
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          Growing every day
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center hover:border-emerald-200 transition"
          >
            <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-xl mx-auto mb-3">
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {s.value}
            </div>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DashboardOverview;

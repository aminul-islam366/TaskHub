const DashboardOverview = () => {
  const statsOverViews = [
    { icon: " �", tasks: "320", text: "Total Tasks Created" },
    { icon: " ✅", tasks: " 210", text: "Active Tasks" },
    { icon: " 🎯", tasks: " 3320", text: "Completed Tasks" },
    { icon: " 💰", tasks: " $340", text: "Total Rewards Paid" },
  ];
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Your Dashboard Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statsOverViews.map((statViews, index) => (
            <div
              key={index}
              className="bg-liner-to-br from-emerald-500 to-emerald-600 border text-center rounded-xl p-6 shadow-lg"
            >
              <div className="text-3xl mb-2">{statViews.icon}</div>
              <div className="text-3xl font-bold mb-1">{statViews.tasks}</div>
              <p className="">{statViews.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

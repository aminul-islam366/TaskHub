import React from "react";

const FeaturesSection = () => {
  const features = [
    {
      icon: "⚡",
      title: "  Quick & Easy",
      desc: "Complete tasks in seconds. Simple verification process for instant rewards.",
    },
    {
      icon: "🔒",
      title: "Secure Platform",
      desc: "Safe and reliable task management with verification system.",
    },
    {
      icon: "📈",
      title: "Grow Your Reach",
      desc: "Create tasks to boost your Twitter presence and engagement.",
    },
  ];
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose TaskHub?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((featur) => (
            <div
              key={featur.title}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="text-5xl mb-4"> {featur.icon}</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                {featur.title}
              </h4>
              <p className="text-gray-600">{featur.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

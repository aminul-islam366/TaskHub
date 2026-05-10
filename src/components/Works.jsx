import React from "react";

const Works = () => {
  const works = [
    {
      num: "1",
      title: "Browse Tasks",
      text: " Choose from available Twitter tasks",
    },
    {
      num: "2",
      title: "Complete Task",
      text: " Follow, Retweet, or Like as required",
    },
    {
      num: "3",
      title: "Submit Proof",
      text: " Provide your Twitter username",
    },
    {
      num: "4",
      title: "Get Verified",
      text: "Task creator verifies completion",
    },
  ];
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          How It Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {works.map((work) => (
            <div key={work.num} className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">
                  {work.num}
                </span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{work.title}</h4>
              <p className="text-gray-600 text-sm">{work.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Works;

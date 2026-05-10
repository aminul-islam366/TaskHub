import React from "react";

const Testimonials = () => {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          What Our Users Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Alex Martinez</h4>
                <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              TaskHub helped me grow my Twitter following from 500 to 5000 in
              just 2 months!
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Sarah Kim</h4>
                <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              Easy to use and reliable. I complete tasks daily and the
              verification is quick!
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">James Wilson</h4>
                <div className="text-yellow-500">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              Best micro-task platform for Twitter growth. Highly recommend to
              everyone!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

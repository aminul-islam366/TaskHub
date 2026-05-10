import Link from "next/link";
import React from "react";

const ViewDetailsButton = ({ task }) => {
  return (
    <div>
      <Link
        href={`/tasks/${task._id}`}
        className="block w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition text-center"
      >
        View Details
      </Link>
    </div>
  );
};

export default ViewDetailsButton;

const reviews = [
  {
    name: "Alex Martinez",
    role: "Content Creator",
    avatar: "A",
    text: "TaskHub helped me grow my Twitter following from 500 to 5,000 in just 2 months. The tasks are simple and the results are real.",
    stars: 5,
  },
  {
    name: "Sarah Kim",
    role: "Freelancer",
    avatar: "S",
    text: "I complete tasks every morning before work. It's easy, reliable, and the verification is fast. Best side income I've found.",
    stars: 5,
  },
  {
    name: "James Wilson",
    role: "Digital Marketer",
    avatar: "J",
    text: "As a marketer I use TaskHub to boost engagement on client campaigns. The quality of completions is consistently high.",
    stars: 5,
  },
];

const Testimonials = () => (
  <section className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <span className="text-emerald-600 font-semibold text-xs uppercase tracking-widest">
          Testimonials
        </span>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">
          Loved by our community
        </h2>
        <p className="text-gray-500 mt-3 text-sm">
          Join thousands of satisfied users on TaskHub
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div
            key={r.name}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex gap-0.5 mb-4">
              {[...Array(r.stars)].map((_, i) => (
                <span key={i} className="text-emerald-500 text-sm">
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              &ldquo;{r.text}&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
              <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {r.avatar}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                <p className="text-gray-400 text-xs">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;

import Link from "next/link";

const Footer = () => (
  <footer className="bg-gray-950 dark:bg-black text-gray-400 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <span className="text-white font-bold text-lg">TaskHub</span>
          </div>
          <p className="text-sm leading-relaxed mb-5 text-gray-500">
            The leading platform for Twitter micro-tasks. Earn rewards or grow
            your audience.
          </p>
          <div className="flex gap-3">
            {["𝕏", "f", "in"].map((s) => (
              <a
                key={s}
                href="#"
                className="w-8 h-8 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center text-xs transition"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              ["Browse Tasks", "/tasks"],
              ["Create Task", "/tasks/add"],
              ["My Tasks", "/my-tasks"],
            ].map(([name, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              ["About Us", "/about"],
              ["Contact", "/contact"],
              ["FAQ", "#"],
              ["Blog", "#"],
            ].map(([name, href]) => (
              <li key={name}>
                <Link href={href} className="hover:text-white transition">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Cookie Policy",
              "Guidelines",
            ].map((name) => (
              <li key={name}>
                <a href="#" className="hover:text-white transition">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} TaskHub. All rights reserved.</p>
        <div className="flex gap-5">
          {["Privacy", "Terms", "Cookies"].map((t) => (
            <a key={t} href="#" className="hover:text-white transition">
              {t}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

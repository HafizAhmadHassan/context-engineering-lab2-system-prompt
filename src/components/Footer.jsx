import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="border-t border-white/5 bg-dark-950/50 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                CE
              </div>
              <span className="text-lg font-bold text-white">
                Context<span className="text-primary-400">Lab</span>
              </span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed">
              Interactive Context Engineering Lab for learning how structured
              context affects LLM outputs.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/practice", label: "Practice" },
                { to: "/api", label: "API" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-dark-400 hover:text-primary-400 text-sm transition-colors duration-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Technology</h4>
            <div className="flex flex-wrap gap-2">
              {["React", "Vite", "Tailwind CSS", "Framer Motion"].map((tech) => (
                <span key={tech} className="tag">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            © {new Date().getFullYear()} Context Engineering Lab. All rights reserved.
          </p>
          <p className="text-dark-500 text-sm">
            Static site · GitHub Pages
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="tag mb-4 inline-block">About</span>
        <h1 className="section-title text-white">About Context Engineering Lab</h1>
        <p className="section-subtitle mb-12">
          An interactive platform for understanding how structured context influences
          Large Language Model behavior and outputs.
        </p>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="card"
          >
            <h2 className="text-2xl font-semibold text-white mb-3">What is Context Engineering?</h2>
            <p className="text-dark-400 leading-relaxed">
              Context engineering is the practice of structuring and providing relevant
              context to LLMs to improve their outputs. This includes system prompts,
              CLAUDE.md files, structured instructions, and domain-specific knowledge
              that guides the model toward better, more consistent responses.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="card"
          >
            <h2 className="text-2xl font-semibold text-white mb-3">How It Works</h2>
            <div className="space-y-4 mt-4">
              {[
                { step: "01", title: "Write a Prompt", desc: "Enter your task or question in the practice editor" },
                { step: "02", title: "Add Context", desc: "Toggle CLAUDE.md context to see the difference" },
                { step: "03", title: "Compare Results", desc: "View side-by-side outputs with and without context" },
                { step: "04", title: "Learn & Iterate", desc: "Understand what structured context changes in outputs" },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center font-mono font-bold text-sm flex-shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="text-white font-medium">{s.title}</h3>
                    <p className="text-dark-400 text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="card"
          >
            <h2 className="text-2xl font-semibold text-white mb-3">Technology Stack</h2>
            <div className="flex flex-wrap gap-3 mt-4">
              {["React", "Vite", "Tailwind CSS", "Framer Motion", "GitHub Pages"].map((tech) => (
                <span key={tech} className="tag">{tech}</span>
              ))}
            </div>
            <p className="text-dark-400 text-sm mt-4 leading-relaxed">
              This is a fully static site — no backend server required. AI provider calls
              are made directly from your browser using keys you configure on the API page
              (stored only in your browser's local storage).
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
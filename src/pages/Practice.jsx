import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const practiceModules = [
  {
    to: "/practice/system-prompt",
    title: "System Prompt",
    desc: "Build CLAUDE.md files and compare LLM outputs with and without structured context",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5" />
      </svg>
    ),
    tag: "Core",
    tagColor: "green",
  },
  {
    to: "/practice/retrieval",
    title: "Retrieval",
    desc: "Learn context engineering fundamentals, then practice writing system prompts across 10 customer support scenarios",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    tag: "New",
    tagColor: "blue",
  },
  {
    to: "/practice/quiz",
    title: "Quiz",
    desc: "Test your knowledge of prompt engineering, context engineering, and RAG across 24 instructor-reviewed questions",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5" />
      </svg>
    ),
    tag: "New",
    tagColor: "green",
  },
];

const tagColors = {
  green: "bg-green-500/10 text-green-400 border-green-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function Practice() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="tag mb-4 inline-block">Practice</span>
        <h1 className="section-title text-white">Practice Sessions</h1>
        <p className="section-subtitle mb-10">
          Choose a module below to start exploring context engineering techniques.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {practiceModules.map((session, i) => (
            <motion.div
              key={session.to}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card-hover group"
            >
              <Link to={session.to}>
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 text-primary-400 flex items-center justify-center mb-5 group-hover:bg-primary-500/20 group-hover:scale-110 transition-all duration-300">
                  {session.icon}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-semibold text-white">{session.title}</h3>
                  <span className={`tag ${tagColors[session.tagColor]}`}>{session.tag}</span>
                </div>
                <p className="text-dark-400 leading-relaxed">{session.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
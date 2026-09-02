import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiConfig } from "../../utils/api";
import { evaluateBenchmark } from "../../utils/practiceService";

const intro = {
  title: "Introduction",
  body: "Context Engineering is the practice of designing the information and instructions an LLM needs to produce reliable outputs. It goes far beyond writing a single prompt — it covers identity, decision rules, workflows, tone, edge cases, and the evaluation process that verifies behavior. This session teaches the core concepts using a customer support chatbot as the running example.",
};

const lessons = [
  {
    num: 1,
    title: "Context Engineering Is More Than Prompt Engineering",
    body: "A prompt is only the final input. Context engineering designs the whole operating environment around the model, covering five layers:",
    points: [
      "Identity — Who the AI is and what company it represents.",
      "Responsibilities — The scope of problems the AI handles.",
      "Decision Rules — The rules that govern how it makes decisions.",
      "Tone — How the AI communicates.",
      "Edge Cases — How the AI handles unusual situations.",
    ],
  },
  {
    num: 2,
    title: "Specify the Process, Not Just the Answer",
    body: "Instead of immediately approving a customer request, tell the model how to think. For a return request, the correct workflow is:",
    points: [
      "Check the order",
      "Read the return policy",
      "Determine eligibility",
      "Respond",
    ],
    note: "Workflows are better than simple instructions. They are reusable, verifiable, and produce consistent decisions across many similar requests.",
  },
  {
    num: 3,
    title: "Ground Responses in Available Data",
    body: "Models should retrieve information instead of hallucinating it. If a customer asks for the price of a MacBook Pro and the model has no product data, it must not invent a price. Retrieval-Augmented Generation (RAG) retrieves relevant information from a knowledge base before the model answers, grounding the response in facts.",
    points: [
      "Never guess prices, order status, or policies.",
      "Use available data sources before responding.",
      "Say when information is unavailable.",
    ],
  },
  {
    num: 4,
    title: "Include Behavioral Rules",
    body: "Critical Rules constrain how the model behaves even when the instructions are not explicit. They prevent unsafe and unreliable decisions:",
    points: [
      "Never fabricate information",
      "Verify before answering",
      "Escalate when necessary",
      "Follow company policy",
    ],
  },
  {
    num: 5,
    title: "Tone Should Be Explicit",
    body: "Tone should be part of the context, not left to chance. Stating the expected communication style keeps responses professional across normal requests, complaints, and technical problems.",
    points: [
      "Professional — respectful and clear.",
      "Friendly — approachable and helpful.",
      "Empathetic — acknowledge the customer's situation before solving.",
    ],
  },
  {
    num: 6,
    title: "Handle Edge Cases",
    body: "Exceptional situations need explicit handling. When a customer threatens legal action, the model must know what to do:",
    points: [
      "Stay calm",
      "De-escalate the situation",
      "Escalate to the appropriate team when appropriate",
    ],
  },
  {
    num: 7,
    title: "Evaluate Using Representative Scenarios",
    body: "Prompt quality should be measured against multiple test cases, not a single example. A benchmark of diverse customer scenarios reveals whether the prompt generalizes or only solves the one example it was designed around.",
  },
  {
    num: 8,
    title: "Build Prompts Iteratively",
    body: "Effective context is built in rounds, adding one layer at a time so each improvement can be measured:",
    points: [
      "Round 1 — Identity",
      "Round 2 — Critical Rules",
      "Round 3 — Additional Guidance (tone, workflows)",
      "Round 4 — Identity + Rules + Tone + Edge Cases",
    ],
  },
  {
    num: 9,
    title: "Prompt Improvements Are Not Always Linear",
    body: "Adding more context does not guarantee better results. Randomness, model variability, and token limits mean a newer, longer prompt can sometimes perform worse than a leaner previous version.",
  },
  {
    num: 10,
    title: "Context Window",
    body: "Every model has a fixed context window:",
    points: ["Input Tokens + Output Tokens = Context Window"],
    note: "Every instruction you add consumes input tokens and leaves fewer tokens for the response. Context engineering balances instructions against available response space.",
  },
  {
    num: 11,
    title: "Token Limits Affect Evaluation",
    body: "Low output token limits can make responses appear worse than they actually are. When evaluating a system, the output budget must be large enough for the model to demonstrate the behavior the prompt asks for.",
  },
  {
    num: 12,
    title: "Structure Matters",
    body: "Prompts should be organized into clear sections rather than one long paragraph. A structured prompt is easier to maintain and produces more reliable behavior.",
    points: ["Identity", "Rules", "Workflow", "Tone", "Edge Cases"],
  },
  {
    num: 13,
    title: "Evaluation Methodology — Benchmark Against 10 Scenarios",
    body: "Instead of asking 'does the chatbot seem good?', every session prompt is tested against a fixed benchmark of 10 customer support scenarios: return request, product price, angry customer, missing package, cancel order, warranty claim, refund status, technical support, account access, and product recommendation. The same queries run in every round so that prompt improvements can be measured consistently.",
    points: [
      "Fixed set of 10 customer queries",
      "Same scenarios every round → comparable scores",
      "Evaluates prompt design AND chatbot behavior, not just writing",
    ],
    note: "This is much closer to software testing than casual prompting — each prompt revision is measured on exactly the same tasks.",
  },
  {
    num: 14,
    title: "Prompt Quality Scoring — 40% of Final Score",
    body: "The system prompt itself is scored across six criteria. Higher point values mean a bigger impact on reliability.",
    points: [
      "Prompt Altitude (10) — general rules that work across many situations, not instructions for one example",
      "Identity (5) — role, responsibility, and business context",
      "Critical Rules (10) — verification, grounding, decision rules, and workflow",
      "Tone (5) — professional style, empathy, and communication quality",
      "Edge Cases (5) — escalation and special handling",
      "Structure & Efficiency (5) — organization, maintainability, and no unnecessary instructions",
    ],
  },
  {
    num: 15,
    title: "Chatbot Response Quality — 60% of Final Score",
    body: "The chatbot's actual response to each of the 10 queries is scored out of 10. This is the larger share of the final score because a good prompt must produce good behavior, not just read well.",
    points: [
      "Intent Understanding (2) — did the chatbot understand the request?",
      "Workflow Compliance (3) — did it follow the correct process?",
      "Accuracy / Grounding (2) — did it avoid unsupported claims?",
      "Tone (2) — was it professional and empathetic?",
      "Escalation / Safety (1) — did it handle sensitive situations correctly?",
    ],
  },
  {
    num: 16,
    title: "Final Score & Key Principle",
    body: "Final Score = Prompt Quality × 40% + Chatbot Performance × 60%. Remember that the context window is a limited resource — Input Tokens + Output Tokens = Context Window — so every instruction you add consumes input tokens and leaves fewer for the response.",
    points: [
      "Final Score = Prompt Quality (40%) + Chatbot Performance (60%)",
      "Do not reward longer prompts",
      "Reward prompts that produce reliable decisions, accurate responses, consistent behavior, and a good customer experience",
    ],
    note: "The goal is not the longest prompt — it is the smallest amount of context that produces dependable behavior.",
  },
];

const overallLesson = {
  title: "Overall Lesson",
  body: "Context Engineering is the systematic design of the information, instructions, workflows, behavioral rules, and evaluation process that help LLMs produce reliable outputs. The goal is not the longest prompt — it is the smallest amount of context that produces dependable behavior.",
};

const sectionItems = [
  { id: "introduction", label: "Introduction" },
  ...lessons.map((l) => ({ id: `lesson-${l.num}`, label: `${l.num}. ${l.title}` })),
  { id: "overall-lesson", label: "Overall Lesson" },
];

const exercises = [
  {
    num: 1,
    title: "Return Request",
    query: "I want to return my laptop. Here is my order ID: ORD-12345.",
    tests: ["Following a workflow instead of guessing", "Checking the order", "Consulting the return policy", "Determining eligibility before responding"],
    task: "Write a system prompt that instructs the chatbot to verify the order and return policy before making a decision.",
  },
  {
    num: 2,
    title: "Product Price",
    query: "What's the price of the new MacBook Pro?",
    tests: ["Preventing hallucinations", "Looking up product information before answering", "Using available product data instead of inventing facts"],
    task: "Write instructions that prevent the chatbot from inventing a price or product fact.",
  },
  {
    num: 3,
    title: "Angry Customer",
    query: "I'm going to sue your company if you don't fix this right now.",
    tests: ["Professional communication", "De-escalation", "Remaining calm under pressure", "Appropriate escalation when necessary"],
    task: "Write instructions that properly handle this edge case with empathy and escalation.",
  },
  {
    num: 4,
    title: "Missing Package",
    query: "My package says delivered, but I never received it.",
    tests: ["Gathering additional information", "Verifying delivery details", "Avoiding assumptions", "Following investigation procedures"],
    task: "Write a system prompt that instructs the chatbot to investigate before drawing conclusions.",
  },
  {
    num: 5,
    title: "Cancel an Order",
    query: "I placed an order five minutes ago. Can you cancel it?",
    tests: ["Checking order status", "Determining whether cancellation is still possible", "Following company policy before confirming"],
    task: "Write a system prompt that instructs the chatbot to check eligibility and policy before confirming.",
  },
  {
    num: 6,
    title: "Warranty Claim",
    query: "My headphones stopped working after eight months. Can I get a replacement?",
    tests: ["Verifying warranty eligibility", "Checking purchase history", "Applying warranty rules before making promises"],
    task: "Write instructions that prevent the chatbot from promising a replacement without verification.",
  },
  {
    num: 7,
    title: "Refund Status",
    query: "I returned my product last week. Where is my refund?",
    tests: ["Checking return status", "Verifying refund progress", "Providing accurate updates instead of estimates"],
    task: "Write a system prompt that instructs the chatbot to check the system before giving an update.",
  },
  {
    num: 8,
    title: "Technical Support",
    query: "My laptop won't turn on.",
    tests: ["Asking clarifying questions", "Following troubleshooting steps", "Avoiding unsupported conclusions", "Escalating when appropriate"],
    task: "Write a system prompt that instructs the chatbot to troubleshoot step by step and escalate when needed.",
  },
  {
    num: 9,
    title: "Account Access",
    query: "I forgot my password and can't access my account.",
    tests: ["Identity verification", "Secure account recovery", "Protecting customer privacy", "Following authentication procedures"],
    task: "Write instructions that protect customer security while guiding account recovery.",
  },
  {
    num: 10,
    title: "Product Recommendation",
    query: "I'm a college student. Which laptop should I buy?",
    tests: ["Asking clarifying questions before recommending", "Understanding customer needs", "Tailored recommendations without unsupported assumptions"],
    task: "Write a system prompt that instructs the chatbot to understand needs before recommending.",
  },
];

const promptExamples = [
  {
    level: "Round 1",
    title: "Identity Only",
    prompt: "You are a customer support agent for Cloud Store.\nHelp customers with orders, returns, and product questions.\nBe friendly and professional.",
  },
  {
    level: "Round 2",
    title: "Identity + Rules",
    prompt: "You are a customer support agent for Cloud Store.\nHelp customers with orders, returns, and product questions.\nBe friendly and professional.\n\nRules:\n- Verify information before responding.\n- Never invent prices, policies, or order information.\n- Check available data before making decisions.\n- Follow this workflow: understand the request, verify, apply policy, respond.",
  },
  {
    level: "Round 3",
    title: "Identity + Rules + Tone",
    prompt: "You are a customer support agent for Cloud Store.\nHelp customers with orders, returns, and product questions.\n\nRules:\n- Verify information before responding.\n- Never invent prices, policies, or order information.\n- Check available data before making decisions.\n- Follow this workflow: understand the request, verify, apply policy, respond.\n\nTone:\n- Communicate professionally and clearly.\n- Acknowledge the customer's situation with empathy.\n- Stay calm and respectful, even with frustrated customers.",
  },
  {
    level: "Round 4",
    title: "Identity + Rules + Tone + Edge Cases",
    prompt: "You are a customer support agent for Cloud Store.\nHelp customers with orders, returns, and product questions.\n\nRules:\n- Verify information before responding.\n- Never invent prices, policies, or order information.\n- Check available data before making decisions.\n- Follow this workflow: understand the request, verify, apply policy, respond.\n\nTone:\n- Communicate professionally and clearly.\n- Acknowledge the customer's situation with empathy.\n- Stay calm and respectful, even with frustrated customers.\n\nEdge Cases:\n- If a customer threatens legal action, stay calm and escalate to a supervisor.\n- If information is missing, ask the customer for the details you need.\n- If the customer is frustrated or upset, acknowledge their feelings before solving.\n- Never promise refunds, replacements, or prices without verifying them first.",
  },
];

export default function Retrieval() {
  const [activeTab, setActiveTab] = useState("learn");
  const [completed, setCompleted] = useState({});
  const [activeSection, setActiveSection] = useState("introduction");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const contentRef = useRef(null);

  const apiConfig = getApiConfig();
  const hasApiKey = Boolean(apiConfig.apiKey);

  const totalSections = sectionItems.length;
  const completedCount = sectionItems.filter((s) => completed[s.id]).length;
  const progressPct = Math.round((completedCount / totalSections) * 100);

  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sectionItems.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [activeTab]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleComplete = (id) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRun = async () => {
    if (!systemPrompt.trim()) return;
    setEvaluating(true);
    setResult(null);
    try {
      const data = await evaluateBenchmark({
        prompt: systemPrompt,
        exercises: exercises.map((ex) => ({ num: ex.num, title: ex.title, query: ex.query, tests: ex.tests })),
        ...apiConfig,
      });
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    }
    setEvaluating(false);
  };

  const handleClear = () => {
    setSystemPrompt("");
    setResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" ref={contentRef}>
      <div className="fixed top-0 left-0 right-0 h-1 bg-dark-800 z-50">
        <div className="h-full bg-primary-500 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="tag mb-4 inline-block">Practice</span>
        <h1 className="section-title text-white">Retrieval & Context Engineering</h1>
        <p className="section-subtitle mb-8">Learn the principles of context engineering, then practice building system prompts across 10 customer support scenarios.</p>

        <div className="flex gap-2 mb-10">
          <button onClick={() => setActiveTab("learn")} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === "learn" ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25" : "bg-dark-800 text-dark-400 hover:text-white border border-white/5"}`}>
            Session Learning
          </button>
          <button onClick={() => setActiveTab("practice")} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === "practice" ? "bg-primary-600 text-white shadow-lg shadow-primary-500/25" : "bg-dark-800 text-dark-400 hover:text-white border border-white/5"}`}>
            Session Practice
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "learn" ? (
            <motion.div key="learn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                  <div className="lg:sticky lg:top-24 card">
                    <h3 className="text-white font-semibold mb-1">Table of Contents</h3>
                    <p className="text-dark-500 text-xs mb-4">{completedCount} of {totalSections} completed</p>
                    <div className="w-full h-1.5 bg-dark-800 rounded-full mb-5 overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                    </div>
                    <nav className="space-y-1 max-h-96 overflow-y-auto pr-1">
                      {sectionItems.map((item) => (
                        <button key={item.id} onClick={() => scrollTo(item.id)} className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 ${activeSection === item.id ? "bg-primary-500/10 text-primary-400" : "text-dark-400 hover:text-white hover:bg-dark-800"}`}>
                          <span className="inline-flex items-center gap-2">
                            {completed[item.id] && <span className="text-green-400">✓</span>}
                            {item.label}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </aside>

                <div className="lg:col-span-3 space-y-8">
                  <motion.div id="introduction" className="card scroll-mt-24" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="text-2xl font-bold text-white">{intro.title}</h2>
                      <button onClick={() => toggleComplete("introduction")} className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-300 ${completed["introduction"] ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-dark-800 text-dark-400 border-white/5 hover:text-white"}`}>
                        {completed["introduction"] ? "✓ Completed" : "Mark as Completed"}
                      </button>
                    </div>
                    <p className="text-dark-300 leading-relaxed">{intro.body}</p>
                  </motion.div>

                  {lessons.map((lesson, i) => (
                    <motion.div key={lesson.num} id={`lesson-${lesson.num}`} className="card scroll-mt-24" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: (i % 4) * 0.05 }} viewport={{ once: true }}>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center text-sm font-bold shrink-0">{lesson.num}</span>
                          <h3 className="text-xl font-semibold text-white">{lesson.title}</h3>
                        </div>
                        <button onClick={() => toggleComplete(`lesson-${lesson.num}`)} className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-300 shrink-0 ${completed[`lesson-${lesson.num}`] ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-dark-800 text-dark-400 border-white/5 hover:text-white"}`}>
                          {completed[`lesson-${lesson.num}`] ? "✓ Completed" : "Mark as Completed"}
                        </button>
                      </div>
                      <p className="text-dark-300 leading-relaxed mb-4">{lesson.body}</p>
                      {lesson.points && (
                        <ul className="space-y-2">
                          {lesson.points.map((point, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-dark-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                      {lesson.note && <p className="mt-4 text-sm text-primary-300/90 bg-primary-500/5 border border-primary-500/10 rounded-xl p-3">{lesson.note}</p>}
                    </motion.div>
                  ))}

                  <motion.div id="overall-lesson" className="card scroll-mt-24 border-primary-500/30 bg-primary-500/5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="text-2xl font-bold text-white">{overallLesson.title}</h2>
                      <button onClick={() => toggleComplete("overall-lesson")} className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-300 shrink-0 ${completed["overall-lesson"] ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-dark-800 text-dark-400 border-white/5 hover:text-white"}`}>
                        {completed["overall-lesson"] ? "✓ Completed" : "Mark as Completed"}
                      </button>
                    </div>
                    <p className="text-dark-300 leading-relaxed">{overallLesson.body}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="practice" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Session Practice</h2>
                <p className="text-dark-400 text-sm leading-relaxed">
                  Write one system prompt and run it against all 10 customer support scenarios. The LLM generates a response for every query, and your prompt is graded using the context engineering methodology (Prompt Quality 40% + Chatbot Responses 60%).
                </p>
              </div>

              <div className="card mb-8">
                <h3 className="text-lg font-semibold text-white mb-1">Prompt Examples by Maturity Level</h3>
                <p className="text-dark-400 text-sm mb-4">Start with identity, then build up rules, tone, and edge cases. Click an example to load it into the editor.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {promptExamples.map((example) => (
                    <button
                      key={example.level}
                      onClick={() => { setSystemPrompt(example.prompt); setResult(null); }}
                      className={`text-left p-4 rounded-xl border transition-all duration-300 ${
                        systemPrompt === example.prompt
                          ? "bg-primary-500/10 border-primary-500/40"
                          : "bg-dark-900 border-white/5 hover:border-primary-500/30"
                      }`}
                    >
                      <span className="tag mb-2">{example.level}</span>
                      <p className="text-white font-medium text-sm mb-1">{example.title}</p>
                      <p className="text-dark-500 text-xs leading-relaxed">{example.prompt.split("\n").filter(Boolean).slice(0, 2).join(" ")}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card mb-8">
                <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-3">Your System Prompt</p>
                <textarea
                  className="input-field font-mono text-sm min-h-48"
                  rows={12}
                  value={systemPrompt}
                  onChange={(e) => { setSystemPrompt(e.target.value); setResult(null); }}
                  placeholder="You are a customer support agent for Cloud Store..."
                />
                <div className="flex gap-3 mt-4">
                  <button onClick={handleRun} disabled={!systemPrompt.trim() || evaluating} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                    {evaluating ? "Evaluating..." : "Run All 10 Scenarios"}
                  </button>
                  <button onClick={handleClear} className="btn-secondary">Clear</button>
                </div>
                <p className="text-xs text-dark-500 mt-3">
                  {hasApiKey
                    ? "Your configured API will generate a real chatbot response for each of the 10 queries and AI-grade them."
                    : "No API key configured — showing demo responses and heuristic prompt scoring. Add a key on the API page for real AI-generated responses."}
                </p>
              </div>

              {evaluating && (
                <div className="card text-center py-12 mb-8">
                  <svg className="animate-spin w-8 h-8 text-primary-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-dark-400">{hasApiKey ? "Generating and grading chatbot responses for all 10 scenarios..." : "Evaluating your prompt..."}</p>
                </div>
              )}

              {result && !result.error && (
                <>
                  <div className="card mb-8 border-primary-500/30 bg-primary-500/5">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-semibold text-white">Benchmark Results</h3>
                      <span className={`tag ${result.demo ? "" : "tag-success"}`}>{result.demo ? "Heuristic" : "AI Graded"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
                      <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center shrink-0 ${
                        result.finalScore >= 7
                          ? "bg-green-500/10 border border-green-500/30"
                          : result.finalScore >= 5
                          ? "bg-yellow-500/10 border border-yellow-500/30"
                          : "bg-red-500/10 border border-red-500/30"
                      }`}>
                        <span className="text-4xl font-bold text-white">{result.finalScore}</span>
                        <span className="text-xs text-dark-400">/ 10</span>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-white mb-1">{result.level}</p>
                        <p className="text-dark-400 text-sm">{result.notice}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="rounded-xl bg-dark-950 border border-white/5 p-4">
                        <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Prompt Quality (40%)</p>
                        <p className="text-2xl font-bold text-white">{result.promptScore}<span className="text-sm text-dark-500"> /10</span></p>
                      </div>
                      <div className="rounded-xl bg-dark-950 border border-white/5 p-4">
                        <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Chatbot Responses (60%)</p>
                        <p className="text-2xl font-bold text-white">{result.overallResponseScore != null ? result.overallResponseScore : "—"}<span className="text-sm text-dark-500"> /10</span></p>
                      </div>
                      <div className="rounded-xl bg-dark-950 border border-white/5 p-4">
                        <p className="text-xs text-dark-500 uppercase tracking-wider mb-1">Graded Scenarios</p>
                        <p className="text-2xl font-bold text-white">{result.results.filter((r) => r.responseScore != null).length}<span className="text-sm text-dark-500"> / {result.results.length}</span></p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Strengths</p>
                        <ul className="space-y-1.5">
                          {result.strengths.length ? result.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-green-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 shrink-0" />
                              {s}
                            </li>
                          )) : <li className="text-sm text-dark-500">None detected yet.</li>}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Suggestions</p>
                        <ul className="space-y-1.5">
                          {result.suggestions.length ? result.suggestions.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                              {s}
                            </li>
                          )) : <li className="text-sm text-dark-500">Nothing to suggest.</li>}
                        </ul>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Prompt Quality Criteria</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {result.promptEval.criteria.map((c) => (
                          <div key={c.label} className={`rounded-lg px-3 py-2 text-xs border ${
                            c.met
                              ? "bg-green-500/5 border-green-500/20 text-green-400"
                              : "bg-dark-900 border-white/5 text-dark-500"
                          }`}>
                            <span className="mr-1">{c.met ? "✓" : "✗"}</span>
                            {c.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white">Responses by Scenario</h3>
                    {result.results.map((r, i) => (
                      <motion.div key={r.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: (i % 5) * 0.05 }} viewport={{ once: true }} className="card">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-400 flex items-center justify-center text-sm font-bold shrink-0">{r.num}</span>
                            <h4 className="text-lg font-semibold text-white">{r.title}</h4>
                          </div>
                          {r.responseScore != null && (
                            <span className={`tag ${r.responseScore >= 7 ? "tag-success" : r.responseScore >= 5 ? "tag-warning" : "tag-error"}`}>
                              Response {r.responseScore}/10
                            </span>
                          )}
                        </div>
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Customer Query</p>
                          <div className="bg-dark-950 rounded-xl p-3 border border-white/5">
                            <p className="text-white italic text-sm">"{r.query}"</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Expected Behavior</p>
                          <ul className="space-y-1">
                            {r.tests.map((t, j) => (
                              <li key={j} className="flex items-start gap-2 text-xs text-dark-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">
                            LLM Response
                            {r.demo && <span className="ml-2 normal-case text-yellow-400">demo</span>}
                          </p>
                          <pre className="whitespace-pre-wrap text-sm text-dark-300 bg-dark-950 rounded-xl p-4 font-mono max-h-56 overflow-y-auto border border-white/5">{r.response || "No response generated."}</pre>
                          {r.suggestions.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">Response Notes</p>
                              <ul className="space-y-1">
                                {r.suggestions.map((s, j) => (
                                  <li key={j} className="flex items-start gap-2 text-xs text-dark-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 shrink-0" />
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {result && result.error && (
                <div className="card">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{result.error}</div>
                </div>
              )}

              {!evaluating && !result && (
                <div className="card text-center py-12">
                  <p className="text-dark-400 text-sm">Enter a system prompt (or load an example above) and click <span className="text-white font-medium">Run All 10 Scenarios</span> to see the LLM response for every customer query.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
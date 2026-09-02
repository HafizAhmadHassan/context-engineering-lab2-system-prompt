import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizData, quizIntro } from "../../data/quizData";

const optionLetters = ["A", "B", "C", "D"];

export default function Quiz() {
  const [screen, setScreen] = useState("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState({});

  const total = quizData.length;
  const question = quizData[currentIndex];
  const isLast = currentIndex === total - 1;

  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round((answeredCount / total) * 100);

  const score = useMemo(
    () => quizData.filter((q) => answers[q.id] === q.correctAnswer).length,
    [answers]
  );

  const handleSelect = (optId) => {
    if (revealed) return;
    setSelected(optId);
  };

  const handleReveal = () => {
    if (!selected) return;
    setAnswers((prev) => ({ ...prev, [question.id]: selected }));
    setRevealed(true);
  };

  const handleNext = () => {
    if (isLast) {
      setScreen("results");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const handleJump = (i) => {
    setCurrentIndex(i);
    setSelected(null);
    setRevealed(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setRevealed(false);
    setAnswers({});
    setScreen("quiz");
  };

  const scorePct = Math.round((score / total) * 100);
  const resultLabel =
    scorePct >= 90 ? "Outstanding — you know this material cold."
    : scorePct >= 75 ? "Great job — a few edges to polish."
    : scorePct >= 60 ? "Good effort — review the explanations below."
    : "Worth another pass — the explanations will help a lot.";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="tag mb-4 inline-block">Practice</span>
        <h1 className="section-title text-white">Context Engineering Quiz</h1>
        <p className="section-subtitle mb-10">Test your understanding of prompt and context engineering with instructor explanations.</p>

        <AnimatePresence mode="wait">
          {screen === "start" && (
            <motion.div key="start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="card">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Quiz Overview</h2>
                    <p className="text-dark-400 text-sm">{total} questions · one attempt per question · immediate feedback</p>
                  </div>
                </div>
                <p className="text-dark-300 leading-relaxed mb-6">{quizIntro.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quizIntro.concepts.map((c) => (
                    <div key={c.title} className="bg-dark-950 rounded-xl p-4 border border-white/5">
                      <p className="text-sm text-dark-400">{c.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{c.count} <span className="text-sm text-dark-500 font-medium">questions</span></p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => setScreen("quiz")} className="btn-primary flex items-center justify-center gap-2">
                  Start Quiz
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button onClick={() => setScreen("results")} className="btn-secondary">Skip to Results</button>
              </div>
            </motion.div>
          )}

          {screen === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="tag">Question {currentIndex + 1} of {total}</span>
                    <span className="text-dark-500 text-sm">{question.concept}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-dark-500 text-sm">{answeredCount}/{total} answered</span>
                    <button onClick={() => setScreen("results")} className="text-sm text-dark-400 hover:text-white transition-colors">View Results</button>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-dark-800 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={question.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6 leading-snug">{question.question}</h2>
                    <div className="space-y-3 mb-6">
                      {question.options.map((opt) => {
                        const isSelected = selected === opt.id;
                        const isCorrect = opt.id === question.correctAnswer;
                        const showState = revealed && (isSelected || isCorrect);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelect(opt.id)}
                            disabled={revealed}
                            className={`w-full flex items-start gap-3 text-left p-4 rounded-xl border transition-all duration-300 ${
                              showState
                                ? isCorrect
                                  ? "bg-green-500/10 border-green-500/40 text-green-300"
                                  : "bg-red-500/10 border-red-500/40 text-red-300"
                                : isSelected
                                ? "bg-primary-500/10 border-primary-500/40 text-white"
                                : "bg-dark-900 border-white/5 text-dark-300 hover:border-primary-500/30 hover:text-white"
                            } ${revealed && !showState ? "opacity-60" : ""}`}
                          >
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                              showState
                                ? isCorrect
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                                : isSelected
                                ? "bg-primary-600 text-white"
                                : "bg-dark-800 text-dark-400"
                            }`}>
                              {showState ? (isCorrect ? "✓" : "✗") : opt.id}
                            </span>
                            <span className="text-sm sm:text-base leading-relaxed pt-1">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {revealed ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className={`rounded-xl p-5 border mb-6 ${
                        selected === question.correctAnswer
                          ? "bg-green-500/5 border-green-500/20"
                          : "bg-red-500/5 border-red-500/20"
                      }`}>
                        <p className={`text-sm font-semibold mb-2 ${selected === question.correctAnswer ? "text-green-400" : "text-red-400"}`}>
                          {selected === question.correctAnswer ? "Correct! Nice reasoning." : `Incorrect — the correct answer is ${question.correctAnswer}.`}
                        </p>
                        <p className="text-dark-300 text-sm leading-relaxed">{question.explanation}</p>
                      </motion.div>
                    ) : (
                      <button
                        onClick={handleReveal}
                        disabled={!selected}
                        className="btn-primary w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {selected ? "Submit Answer" : "Select an answer to submit"}
                      </button>
                    )}

                    {revealed && (
                      <div className="flex items-center justify-between gap-3">
                        <button onClick={() => handleJump(currentIndex)} className="text-sm text-dark-400 hover:text-white transition-colors">↺ Retry</button>
                        <button onClick={handleNext} className="btn-primary">
                          {isLast ? "View Results" : "Next Question"}
                          <svg className="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {quizData.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => handleJump(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-200 ${
                      i === currentIndex
                        ? "bg-primary-600 text-white"
                        : answers[q.id]
                        ? answers[q.id] === q.correctAnswer
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                        : "bg-dark-800 text-dark-400 hover:text-white"
                    }`}
                  >
                    {q.number}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {screen === "results" && (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6">
              <div className="card text-center py-10">
                <p className="tag inline-block mb-4">Results</p>
                <div className="text-6xl font-extrabold mb-2">
                  <span className={scorePct >= 60 ? "gradient-text" : "text-red-400"}>{scorePct}%</span>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{score} / {total} correct</p>
                <p className="text-dark-400 mb-8">{resultLabel}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button onClick={handleRestart} className="btn-primary">Retake Quiz</button>
                  <button onClick={() => setScreen("start")} className="btn-secondary">Back to Overview</button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Answer Review</h3>
                <div className="space-y-3">
                  {quizData.map((q) => {
                    const userAnswer = answers[q.id];
                    const isCorrect = userAnswer === q.correctAnswer;
                    const answered = userAnswer !== undefined;
                    return (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        viewport={{ once: true }}
                        className={`rounded-xl p-4 border ${
                          !answered
                            ? "bg-dark-900 border-white/5"
                            : isCorrect
                            ? "bg-green-500/5 border-green-500/20"
                            : "bg-red-500/5 border-red-500/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <p className="text-sm font-medium text-white leading-snug">
                            <span className={`mr-2 ${!answered ? "text-dark-500" : isCorrect ? "text-green-400" : "text-red-400"}`}>
                              {answered ? (isCorrect ? "✓" : "✗") : "–"}
                            </span>
                            Q{q.number}. {q.question}
                          </p>
                          <span className="tag shrink-0">{q.concept}</span>
                        </div>
                        <p className="text-xs text-dark-500 mb-2">
                          {answered
                            ? `Your answer: ${userAnswer} · Correct: ${q.correctAnswer}`
                            : `Correct answer: ${q.correctAnswer}`}
                        </p>
                        <p className="text-sm text-dark-400 leading-relaxed">{q.explanation}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

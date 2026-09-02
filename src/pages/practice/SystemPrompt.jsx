import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiConfig } from "../../utils/api";
import { runSystemPrompt, compareSystemPrompts } from "../../utils/practiceService";
import { claudeMdSections as defaultSections, buildClaudeMd } from "../../utils/evaluation";

export default function SystemPrompt() {
  const [userPrompt, setUserPrompt] = useState("Write a Python function calculate_final_grade().");
  const [useClaudeMd, setUseClaudeMd] = useState(false);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("output");
  const [activeMode, setActiveMode] = useState("single");
  const [claudeMdSections, setClaudeMdSections] = useState({ ...defaultSections });
  const [compareOutput, setCompareOutput] = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);

  const handleRun = async () => {
    if (!userPrompt.trim()) return;
    setLoading(true);
    setOutput(null);
    try {
      const data = await runSystemPrompt({
        userPrompt,
        useClaudeMd,
        sections: useClaudeMd ? claudeMdSections : undefined,
        ...getApiConfig(),
      });
      setOutput(data);
    } catch (err) {
      setOutput({ error: err.message });
    }
    setLoading(false);
  };

  const handleCompare = async () => {
    if (!userPrompt.trim()) return;
    setCompareLoading(true);
    setCompareOutput(null);
    try {
      const data = await compareSystemPrompts({
        userPrompt,
        sections: claudeMdSections,
        ...getApiConfig(),
      });
      setCompareOutput(data);
    } catch (err) {
      setCompareOutput({ error: err.message });
    }
    setCompareLoading(false);
  };

  const handleSectionChange = (section, value) => {
    setClaudeMdSections((prev) => ({ ...prev, [section]: value }));
  };

  const claudeMdContent = buildClaudeMd(claudeMdSections);
  const finalPrompt = useClaudeMd
    ? `---------------------\nCLAUDE.md\n---------------------\n\n${claudeMdContent}\n\n---------------------\nUSER PROMPT\n---------------------\n\n${userPrompt}`
    : `---------------------\nUSER PROMPT\n---------------------\n\n${userPrompt}`;

  const tokenEstimate = Math.max(1, Math.round(finalPrompt.split(/\s+/).length * 1.3));

  const downloadOutput = (text, filename) => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const conventionsMet = (data) => {
    if (!data || !data.evaluation) return [];
    return data.evaluation.met;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="tag mb-4 inline-block">Practice</span>
        <h1 className="section-title text-white">System Prompt Exercise</h1>
        <p className="section-subtitle mb-8">Build a CLAUDE.md file, write a prompt, and compare LLM outputs with and without structured context. API calls run directly from your browser.</p>

        <div className="flex gap-2 mb-8">
          <button onClick={() => setActiveMode("single")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeMode === "single" ? "bg-primary-600 text-white" : "bg-dark-800 text-dark-400 hover:text-white border border-white/5"}`}>Single Mode</button>
          <button onClick={() => { setActiveMode("compare"); handleCompare(); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeMode === "compare" ? "bg-primary-600 text-white" : "bg-dark-800 text-dark-400 hover:text-white border border-white/5"}`}>Compare Mode</button>
        </div>

        {activeMode === "single" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="card">
                <label className="block text-sm font-medium text-dark-300 mb-3">Your Prompt</label>
                <textarea className="input-field font-mono text-sm" rows={4} value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} placeholder="e.g., Write a Python function calculate_final_grade()." />
              </div>
              <div className="card">
                <label className="flex items-center gap-4 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" checked={useClaudeMd} onChange={(e) => setUseClaudeMd(e.target.checked)} className="sr-only peer" />
                    <div className="w-12 h-6 bg-dark-700 rounded-full peer-checked:bg-primary-600 transition-colors duration-300" />
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6" />
                  </div>
                  <div>
                    <span className="text-white font-medium">Use CLAUDE.md Context</span>
                    <p className="text-dark-400 text-sm">Append structured context to the prompt</p>
                  </div>
                </label>
              </div>
              <button onClick={handleRun} disabled={loading || !userPrompt.trim()} className="btn-primary w-full sm:w-auto">
                {loading ? <span className="flex items-center gap-2 justify-center"><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Running...</span> : <span className="flex items-center gap-2 justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Run Prompt</span>}
              </button>
            </div>
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider">Final Context Preview</h3>
                  <span className="tag">~{tokenEstimate} tokens</span>
                </div>
                <pre className="whitespace-pre-wrap text-xs font-mono text-dark-300 bg-dark-950 rounded-xl p-4 max-h-48 overflow-y-auto">{finalPrompt}</pre>
              </div>
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setActiveTab("output")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "output" ? "bg-primary-500/10 text-primary-400" : "text-dark-400 hover:text-white"}`}>Output</button>
                    <button onClick={() => setActiveTab("evaluation")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "evaluation" ? "bg-primary-500/10 text-primary-400" : "text-dark-400 hover:text-white"}`}>Evaluation</button>
                  </div>
                  {output && output.output && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigator.clipboard.writeText(output.output)} className="px-3 py-1.5 text-xs bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors">Copy</button>
                      <button onClick={() => downloadOutput(output.output, "model-output.md")} className="px-3 py-1.5 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">Download</button>
                      <button onClick={() => setOutput(null)} className="px-3 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">Clear</button>
                    </div>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {activeTab === "output" && (
                    <motion.div key="output" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                      {output ? (output.error ? <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{output.error}</div> : <pre className="whitespace-pre-wrap text-sm text-dark-300 bg-dark-950 rounded-xl p-4 font-mono max-h-80 overflow-y-auto">{output.output || "No output generated"}</pre>) : <div className="text-center py-8 text-dark-500 text-sm">Run a prompt to see the output here</div>}
                    </motion.div>
                  )}
                  {activeTab === "evaluation" && output && (
                    <motion.div key="evaluation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-3">
                      <div className="mb-4"><span className="text-3xl font-bold text-white">{conventionsMet(output).filter((c) => c.met).length}<span className="text-dark-400"> / {conventionsMet(output).length}</span></span><span className="text-dark-400 text-sm ml-2">Conventions Followed</span></div>
                      {conventionsMet(output).map((item, i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${item.met ? "bg-green-500/5 border border-green-500/20" : "bg-red-500/5 border border-red-500/20"}`}>
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${item.met ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{item.met ? "✓" : "✗"}</span>
                          <span className={`text-sm ${item.met ? "text-green-400" : "text-red-400"}`}>{item.label}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {compareLoading ? (
              <div className="card text-center py-12"><svg className="animate-spin w-8 h-8 text-primary-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg><p className="text-dark-400">Comparing outputs...</p></div>
            ) : compareOutput ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <div className="flex items-center gap-2 mb-4"><span className="tag tag-error">Without CLAUDE.md</span></div>
                  <pre className="whitespace-pre-wrap text-sm text-dark-300 bg-dark-950 rounded-xl p-4 font-mono max-h-64 overflow-y-auto mb-4">{compareOutput.without?.output || "No output"}</pre>
                  <div className="mt-4"><h4 className="text-sm font-semibold text-dark-400 mb-2">Evaluation</h4><div className="text-2xl font-bold text-white mb-2">{conventionsMet(compareOutput.without).filter((c) => c.met).length}<span className="text-dark-400 text-lg ml-1">/ {conventionsMet(compareOutput.without).length}</span></div><div className="space-y-2">{conventionsMet(compareOutput.without).map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 text-sm ${item.met ? "text-green-400" : "text-red-400"}`}>{item.met ? "✓" : "✗"} {item.label}</div>
                  ))}</div></div>
                </div>
                <div className="card">
                  <div className="flex items-center gap-2 mb-4"><span className="tag tag-success">With CLAUDE.md</span></div>
                  <pre className="whitespace-pre-wrap text-sm text-dark-300 bg-dark-950 rounded-xl p-4 font-mono max-h-64 overflow-y-auto mb-4">{compareOutput.with?.output || "No output"}</pre>
                  <div className="mt-4"><h4 className="text-sm font-semibold text-dark-400 mb-2">Evaluation</h4><div className="text-2xl font-bold text-white mb-2">{conventionsMet(compareOutput.with).filter((c) => c.met).length}<span className="text-dark-400 text-lg ml-1">/ {conventionsMet(compareOutput.with).length}</span></div><div className="space-y-2">{conventionsMet(compareOutput.with).map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 text-sm ${item.met ? "text-green-400" : "text-red-400"}`}>{item.met ? "✓" : "✗"} {item.label}</div>
                  ))}</div></div>
                </div>
              </div>
            ) : (
              <div className="card text-center py-12"><p className="text-dark-400">Click Compare Mode to see side-by-side results</p></div>
            )}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">CLAUDE.md Builder</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{ key: "overview", label: "Project Overview", desc: "What the project does and expected outcomes" }, { key: "structure", label: "Project Structure", desc: "Folders, files, modules, and packages" }, { key: "conventions", label: "Code Conventions", desc: "Rules and requirements for implementation" }, { key: "testing", label: "Testing Requirements", desc: "Rules, knowledge, expected behavior" }, { key: "patterns", label: "Important Patterns", desc: "Reusable rules, tools, and knowledge" }, { key: "mistakes", label: "Common Mistakes to Avoid", desc: "Guard rails — what not to do" }].map((section, i) => (
              <motion.div key={section.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} viewport={{ once: true }} className="card">
                <h3 className="text-white font-semibold mb-1">{section.label}</h3>
                <p className="text-dark-500 text-xs mb-3">{section.desc}</p>
                <textarea className="input-field text-xs" rows={4} value={claudeMdSections[section.key]} onChange={(e) => handleSectionChange(section.key, e.target.value)} />
              </motion.div>
            ))}
          </div>
          <div className="mt-6 card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Generated CLAUDE.md</h3>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(claudeMdContent)} className="px-3 py-1.5 text-xs bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors">Copy</button>
                <button onClick={() => { const blob = new Blob([claudeMdContent], { type: "text/markdown" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "CLAUDE.md"; a.click(); URL.revokeObjectURL(url); }} className="px-3 py-1.5 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">Download</button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-xs font-mono text-dark-300 bg-dark-950 rounded-xl p-4 max-h-48 overflow-y-auto">{claudeMdContent}</pre>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
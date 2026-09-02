import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { validateProviderKey } from "../utils/api";

const providers = [
  {
    id: "openai",
    name: "OpenAI",
    icon: "🤖",
    browser: false,
    note: "No permanent free API tier. New accounts get a one-time $15 trial credit. ⚠️ Blocks browser calls — needs a local dev server or backend proxy.",
    free: [{ id: "gpt-4o-mini", label: "GPT-4o Mini", price: "$0.15/$0.60" }],
    pro: [
      { id: "gpt-5-nano", label: "GPT-5 Nano", price: "$0.05/$0.40" },
      { id: "gpt-5-mini", label: "GPT-5 Mini", price: "$0.25/$2.00" },
      { id: "gpt-5", label: "GPT-5", price: "$1.25/$10.00" },
    ],
    recommendation: "GPT-4o Mini (Free) — the only free-tier model; GPT-5 Mini is the best paid value.",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: "🧠",
    browser: false,
    note: "No permanent free API model — new accounts get a ~$5 trial credit. ⚠️ Blocks browser calls — needs a local dev server or backend proxy.",
    free: [],
    pro: [
      { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", price: "$1/$5" },
      { id: "claude-sonnet-5", label: "Claude Sonnet 5", price: "$2/$10" },
      { id: "claude-sonnet-4-5", label: "Claude Sonnet 4.5", price: "$3/$15" },
      { id: "claude-opus-4-8", label: "Claude Opus 4.8", price: "$5/$25" },
    ],
    recommendation: "Claude Haiku 4.5 — cheapest model, best match for a free trial credit.",
  },
  {
    id: "google",
    name: "Google Gemini",
    icon: "💎",
    note: "Real free tier, no credit card required (rate-limited quota).",
    free: [
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", price: "Free" },
      { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite", price: "Free" },
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", price: "Free (limited)" },
    ],
    pro: [
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", price: "$1.25/$10" },
      { id: "gemini-3-flash", label: "Gemini 3 Flash", price: "Paid" },
      { id: "gemini-3-pro", label: "Gemini 3 Pro", price: "Paid" },
    ],
    recommendation: "Gemini 2.5 Flash (Free) — free forever, great quality and speed for this app.",
  },
  {
    id: "groq",
    name: "Groq",
    icon: "⚡",
    note: "Entire catalog is free with rate limits — no credit card required.",
    free: [
      { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant", price: "Free" },
      { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile", price: "Free" },
      { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B", price: "Free" },
      { id: "openai/gpt-oss-20b", label: "GPT-OSS 20B", price: "Free" },
      { id: "qwen/qwen3-32b", label: "Qwen3 32B", price: "Free" },
    ],
    pro: [],
    recommendation: "Llama 3.3 70B Versatile — best quality in Groq's free catalog.",
  },
];

export default function Api() {
  const [apiKeys, setApiKeys] = useState({});
  const [models, setModels] = useState({});
  const [visibleKeys, setVisibleKeys] = useState({});
  const [statuses, setStatuses] = useState({});
  const [newProvider, setNewProvider] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cel_api_keys") || "{}");
      const storedModels = JSON.parse(localStorage.getItem("cel_models") || "{}");
      setApiKeys(stored);
      setModels(storedModels);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("cel_api_keys", JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem("cel_models", JSON.stringify(models));
  }, [models]);

  const toggleKeyVisibility = (id) => {
    setVisibleKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleValidate = async (id) => {
    const key = apiKeys[id];
    if (!key || key.length < 10) {
      setStatuses((prev) => ({ ...prev, [id]: { connected: false, error: "API key too short" } }));
      return;
    }
    setStatuses((prev) => ({ ...prev, [id]: { connected: false, loading: true } }));
    try {
      const data = await validateProviderKey(id, key, models[id]);
      setStatuses((prev) => ({ ...prev, [id]: data }));
    } catch (err) {
      setStatuses((prev) => ({ ...prev, [id]: { connected: false, error: err.message } }));
    }
  };

  const handleKeyChange = (id, value) => {
    setApiKeys((prev) => ({ ...prev, [id]: value.replace(/\s+/g, "") }));
    setStatuses((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleModelChange = (id, value) => {
    setModels((prev) => ({ ...prev, [id]: value }));
  };

  const handleDelete = (id) => {
    setApiKeys((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setModels((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setStatuses((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleAddProvider = () => {
    if (newProvider && !apiKeys[newProvider]) {
      setApiKeys((prev) => ({ ...prev, [newProvider]: "" }));
      setModels((prev) => ({ ...prev, [newProvider]: "default" }));
      setNewProvider("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="tag mb-4 inline-block">API</span>
        <h1 className="section-title text-white">API Configuration</h1>
        <p className="section-subtitle mb-10">
          Manage your AI provider API keys. Keys remain in your browser's local storage.{" "}
          <span className="text-green-400">Groq</span> and{" "}
          <span className="text-green-400">Google Gemini</span> (both free) can be called directly
          from the browser with no backend. OpenAI and Anthropic require a local dev server (or a
          backend proxy) because they block browser calls.
        </p>

        <div className="space-y-4 mb-10">
          {providers.map((provider, i) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-2xl flex-shrink-0">{provider.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{provider.name}</h3>
                    <p className="text-dark-400 text-sm">{provider.note}</p>
                    {provider.free.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {provider.free.map((m) => (
                          <span key={`${m.id}-free`} className="tag tag-success">
                            FREE · {m.label} · {m.price}
                          </span>
                        ))}
                      </div>
                    )}
                    {provider.pro.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {provider.pro.map((m) => (
                          <span key={`${m.id}-pro`} className="tag">
                            PRO · {m.label} · {m.price}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-primary-400 mt-2">★ {provider.recommendation}</p>
                  </div>
                  {statuses[provider.id] && (
                    <span
                      className={`text-sm font-medium flex-shrink-0 ${
                        statuses[provider.id].loading
                          ? "text-yellow-400"
                          : statuses[provider.id].connected
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {statuses[provider.id].loading
                        ? "Connecting..."
                        : statuses[provider.id].connected
                        ? "✓ Connected"
                        : statuses[provider.id].error || "✗ Failed"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type={visibleKeys[provider.id] ? "text" : "password"}
                      value={apiKeys[provider.id] || ""}
                      onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                      placeholder="Enter API key..."
                      className="input-field flex-1"
                    />
                    <button
                      onClick={() => toggleKeyVisibility(provider.id)}
                      title="Show/Hide key"
                      className="w-10 h-10 rounded-lg bg-dark-800 hover:bg-dark-700 flex items-center justify-center text-dark-400 hover:text-white transition-colors flex-shrink-0"
                    >
                      {visibleKeys[provider.id] ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65c7.22 7.22 11.244 10.38 15.065 7.498a10.523 10.523 0 004.293-5.774m-4.293-5.773L21 3" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <select
                    value={models[provider.id] || provider.free[0]?.id || provider.pro[0]?.id || ""}
                    onChange={(e) => handleModelChange(provider.id, e.target.value)}
                    className="input-field sm:w-60 flex-shrink-0"
                  >
                    {provider.free.length > 0 && (
                      <optgroup label="Free">
                        {provider.free.map((m) => (
                          <option key={`${m.id}-free`} value={m.id} className="bg-dark-900">
                            {m.label} ({m.price})
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {provider.pro.length > 0 && (
                      <optgroup label="Pro">
                        {provider.pro.map((m) => (
                          <option key={`${m.id}-pro`} value={m.id} className="bg-dark-900">
                            {m.label} ({m.price})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleValidate(provider.id)}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      Validate
                    </button>
                    <button
                      onClick={() => handleDelete(provider.id)}
                      title="Delete key"
                      className="w-10 h-10 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="card">
          <h3 className="text-white font-semibold mb-4">Add Custom Provider</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newProvider}
              onChange={(e) => setNewProvider(e.target.value)}
              placeholder="Provider name"
              className="input-field flex-1"
            />
            <button onClick={handleAddProvider} className="btn-primary px-4">
              Add
            </button>
          </div>
          <p className="text-xs text-dark-500 mt-3">
            Note: custom providers call the OpenAI-compatible chat completions endpoint. Verify CORS support before use.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
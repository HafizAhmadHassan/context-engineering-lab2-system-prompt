const isDev = typeof window !== "undefined" && window.location.hostname === "localhost";

// Providers that support CORS and can be called directly from the browser (no backend needed).
// Verified: Groq returns `access-control-allow-origin: *`; Google Gemini's `generateContent`
// returns `access-control-allow-origin`. Both are free tiers.
const CORS_DIRECT = new Set(["groq", "google"]);

// Providers that DO NOT support CORS from a browser. They only work:
//  - in development, through the Vite dev-server proxy (see vite.config.js), or
//  - in production, through a backend proxy such as WORKER_URL.
const NEEDS_PROXY = new Set(["openai", "anthropic"]);

// Optional Cloudflare Worker proxy for OpenAI/Anthropic in production.
// Leave blank to use only Groq/Gemini (no setup required).
const WORKER_URL = ""; // e.g. "https://context-engineering-api-proxy.<subdomain>.workers.dev"

// Dev-only Vite proxy paths (see vite.config.js).
const DEV_PROXY = {
  openai: "/api/openai/chat/completions",
  anthropic: "/api/anthropic/messages",
  google: "/api/google/models",
  groq: "/api/groq/chat/completions",
};

// Production direct endpoints for CORS-enabled providers.
const DIRECT_ENDPOINTS = {
  google: (model) =>
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
  groq: "https://api.groq.com/openai/v1/chat/completions",
};

function sanitizeKey(key) {
  return (key || "").replace(/\s+/g, "");
}

const DEFAULT_MODELS = {
  openai: "gpt-4o-mini",
  anthropic: "claude-haiku-4-5",
  google: "gemini-2.5-flash",
  groq: "llama-3.3-70b-versatile",
};

export function getApiConfig() {
  try {
    const keys = JSON.parse(localStorage.getItem("cel_api_keys") || "{}");
    const models = JSON.parse(localStorage.getItem("cel_models") || "{}");
    for (const k in keys) keys[k] = sanitizeKey(keys[k]);
    const provider =
      keys && (keys.openai || keys.anthropic || keys.google || keys.groq)
        ? keys.openai
          ? "openai"
          : keys.anthropic
          ? "anthropic"
          : keys.google
          ? "google"
          : "groq"
        : null;
    return {
      apiKey: provider ? keys[provider] : "",
      provider: provider || "openai",
      model: models[provider] || DEFAULT_MODELS[provider || "openai"],
    };
  } catch {
    return { apiKey: "", provider: "openai", model: DEFAULT_MODELS.openai };
  }
}

async function callProviderRaw({ provider, apiKey, model, messages, system, maxTokens = 1000 }) {
  // CORS-friendly providers: call the provider directly (works in browser, dev and prod).
  if (CORS_DIRECT.has(provider)) {
    return callDirectProvider({ provider, apiKey, model, messages, system, maxTokens });
  }

  // OpenAI/Anthropic need a proxy. In dev the Vite proxy is available.
  if (isDev) {
    return callDirectProvider({ provider, apiKey, model, messages, system, maxTokens });
  }

  // Production + no Worker URL configured → clear explanation instead of a cryptic CORS error.
  if (!WORKER_URL.startsWith("http")) {
    throw new Error(
      `${provider === "openai" ? "OpenAI" : "Anthropic"} does not allow browser calls (CORS). ` +
        "Use a CORS-friendly provider (Groq or Google Gemini) which need no setup, " +
        "or set WORKER_URL in src/utils/api.js to a backend proxy."
    );
  }

  const res = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider,
      apiKey: sanitizeKey(apiKey),
      model: model || DEFAULT_MODELS[provider] || DEFAULT_MODELS.openai,
      max_tokens: maxTokens,
      system: system || "",
      messages,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `API error (${res.status})`);
  }
  if (data.error) {
    throw new Error(data.error);
  }

  if (provider === "anthropic") {
    return data.content?.[0]?.text || "";
  }
  return data.choices?.[0]?.message?.content || "";
}

async function callDirectProvider({ provider, apiKey, model, messages, system, maxTokens = 1000 }) {
  const key = sanitizeKey(apiKey);

  // ---- Google Gemini (CORS-enabled) ----
  if (provider === "google") {
    const selectedModel = model || DEFAULT_MODELS.google;
    const url = `${DIRECT_ENDPOINTS.google(selectedModel)}?key=${key}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: messages.map((m) => m.content).join("\n\n") }] }],
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Google API error (${res.status}): ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    if (data.error) throw new Error(`Google API error: ${data.error?.message || JSON.stringify(data.error)}`);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  // ---- Groq (CORS-enabled) ----
  if (provider === "groq") {
    const res = await fetch(DIRECT_ENDPOINTS.groq, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODELS.groq,
        max_tokens: maxTokens,
        messages,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Groq API error (${res.status}): ${text.slice(0, 200)}`);
    }
    const data = await res.json();
    if (data.error) throw new Error(`Groq API error: ${data.error?.message || JSON.stringify(data.error)}`);
    return data.choices?.[0]?.message?.content || "";
  }

  // ---- OpenAI / Anthropic (dev proxy path only) ----
  if (provider === "anthropic") {
    const res = await fetch(DEV_PROXY.anthropic, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || DEFAULT_MODELS.anthropic,
        max_tokens: maxTokens,
        system,
        messages,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Anthropic API error (${res.status}): ${text.slice(0, 200)}`);
    }
    return (await res.json()).content?.[0]?.text || "";
  }

  const res = await fetch(DEV_PROXY.openai, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODELS.openai,
      max_tokens: maxTokens,
      messages,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${text.slice(0, 200)}`);
  }
  return (await res.json()).choices?.[0]?.message?.content || "";
}

export async function callLLM({ systemPrompt, userMessage, apiKey, provider, model, maxTokens = 400 }) {
  return callProviderRaw({
    provider,
    apiKey,
    model,
    maxTokens,
    system: systemPrompt || "",
    messages: [{ role: "user", content: userMessage }],
  });
}

export async function validateProviderKey(provider, apiKey, model) {
  try {
    const content = await callProviderRaw({
      provider,
      apiKey,
      model: model || DEFAULT_MODELS[provider],
      maxTokens: 10,
      messages: [{ role: "user", content: "Reply with the single word: ok" }],
    });
    return { connected: true, hasContent: Boolean(content), error: null };
  } catch (err) {
    return { connected: false, hasContent: false, error: err.message };
  }
}

export async function generateChatbotResponse({ systemPrompt, userMessage, apiKey, provider, model }) {
  return callLLM({ systemPrompt, userMessage, apiKey, provider, model, maxTokens: 350 });
}
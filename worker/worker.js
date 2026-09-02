const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key, anthropic-version",
  "Access-Control-Max-Age": "86400",
};

const UPSTREAMS = {
  openai: {
    url: (path) => `https://api.openai.com/v1${path}`,
    auth: (key) => ({ Authorization: `Bearer ${key}` }),
  },
  groq: {
    url: (path) => `https://api.groq.com/openai/v1${path}`,
    auth: (key) => ({ Authorization: `Bearer ${key}` }),
  },
  anthropic: {
    url: (path) => `https://api.anthropic.com/v1${path}`,
    auth: (key) => ({ "x-api-key": key, "anthropic-version": "2023-06-01" }),
  },
  google: {
    url: (path, model, key) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    auth: () => ({}),
  },
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    try {
      const body = await request.json();

      const provider = body.provider || "openai";
      const apiKey = (body.apiKey || "").replace(/\s+/g, "");
      let model = body.model;

      const upstream = UPSTREAMS[provider];
      if (!upstream) {
        return json({ error: `Unsupported provider: ${provider}` }, 400, CORS_HEADERS);
      }

      let target;
      let headers = { "Content-Type": "application/json", ...upstream.auth(apiKey) };
      let payload;

      if (provider === "google") {
        model = model || "gemini-2.5-flash";
        target = upstream.url("/", model, apiKey);
        payload = {
          contents: [{ role: "user", parts: [{ text: (body.messages || []).map((m) => m.content).join("\n\n") }] }],
          generationConfig: { maxOutputTokens: body.max_tokens || 1000 },
        };
      } else {
        if (provider === "anthropic") {
          target = upstream.url("/messages");
          payload = {
            model: model || "claude-haiku-4-5",
            max_tokens: body.max_tokens || 1000,
            system: body.system || "",
            messages: body.messages || [],
          };
        } else {
          target = upstream.url("/chat/completions");
          payload = {
            model: model || (provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini"),
            max_tokens: body.max_tokens || 1000,
            messages: body.messages || [],
          };
        }
      }

      const upstreamRes = await fetch(target, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const contentType = upstreamRes.headers.get("content-type") || "application/json";
      const text = await upstreamRes.text();

      if (!upstreamRes.ok) {
        return json({ error: `API error (${upstreamRes.status}): ${text.slice(0, 400)}` }, upstreamRes.status, CORS_HEADERS);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      return json(data, 200, CORS_HEADERS);
    } catch (err) {
      return json({ error: `Proxy error: ${err.message}` }, 500, CORS_HEADERS);
    }
  },
};

function json(obj, status, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

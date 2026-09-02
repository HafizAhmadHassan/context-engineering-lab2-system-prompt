import { callLLM, generateChatbotResponse } from "./api";
import {
  buildClaudeMd,
  demoOutput,
  evaluateCode,
  evaluatePromptHeuristic,
  gradeResponseHeuristic,
  DEMO_RESPONSES,
  dedupe,
  extractJson,
} from "./evaluation";

export async function runSystemPrompt({ userPrompt, useClaudeMd, sections, apiKey, provider, model }) {
  const claudeMd = useClaudeMd ? buildClaudeMd(sections) : "";

  if (!apiKey || apiKey.length < 10) {
    return {
      output: demoOutput(useClaudeMd),
      prompt: userPrompt,
      markdown: claudeMd,
      demo: true,
      evaluation: { met: evaluateCode(demoOutput(useClaudeMd)) },
      notice: "No API key configured — showing demo output.",
    };
  }

  const fullPrompt = useClaudeMd
    ? `---------------------\nCLAUDE.md\n---------------------\n\n${claudeMd}\n\n---------------------\nUSER PROMPT\n---------------------\n\n${userPrompt}`
    : `---------------------\nUSER PROMPT\n---------------------\n\n${userPrompt}`;

  let content = "";
  try {
    content = await callLLM({
      systemPrompt: "",
      userMessage: fullPrompt,
      apiKey,
      provider,
      model,
      maxTokens: 1000,
    });
  } catch (err) {
    return {
      output: demoOutput(useClaudeMd),
      prompt: userPrompt,
      markdown: claudeMd,
      demo: true,
      evaluation: { met: evaluateCode(demoOutput(useClaudeMd)) },
      notice: `Provider request failed (${err.message}). Showing demo output.`,
    };
  }

  if (!content) {
    return {
      output: demoOutput(useClaudeMd),
      prompt: userPrompt,
      markdown: claudeMd,
      demo: true,
      evaluation: { met: evaluateCode(demoOutput(useClaudeMd)) },
      notice: "Provider returned no content. Showing demo output.",
    };
  }

  return {
    output: content,
    prompt: userPrompt,
    markdown: claudeMd,
    evaluation: { met: evaluateCode(content) },
  };
}

export async function compareSystemPrompts({ userPrompt, sections, apiKey, provider, model }) {
  const without = await runSystemPrompt({
    userPrompt,
    useClaudeMd: false,
    sections,
    apiKey,
    provider,
    model,
  });
  const withContext = await runSystemPrompt({
    userPrompt: `Write a Python function calculate_final_grade().\n\n${buildClaudeMd(sections)}\n\nFollow all conventions above.`,
    useClaudeMd: true,
    sections,
    apiKey,
    provider,
    model,
  });
  return { without, with: withContext };
}

export async function gradeResponseWithLLM({ prompt, query, tests, response, apiKey, provider, model }) {
  const expected = (tests || []).map((t) => `- ${t}`).join("\n");
  const instruction = `You are an expert evaluator of customer-support system prompts and chatbot responses.

SYSTEM PROMPT TO EVALUATE:
"""${prompt}"""

CUSTOMER QUERY:
"${query}"

CHATBOT RESPONSE PRODUCED BY THIS SYSTEM PROMPT:
"""${response}"""

EXPECTED BEHAVIORS FOR THIS SCENARIO:
${expected}

Score the response from 0 to 10 (one decimal allowed) for how well it satisfied the expected behaviors. Then list up to 3 strengths and up to 3 suggestions about the response.

Return ONLY valid JSON (no markdown, no commentary) in this exact shape:
{"score": 8.5, "strengths": ["..."], "suggestions": ["..."]}`;
  let content = "";
  try {
    content = await callLLM({
      systemPrompt: "",
      userMessage: instruction,
      apiKey,
      provider,
      model,
      maxTokens: 500,
    });
  } catch {
    return null;
  }
  const parsed = extractJson(content);
  if (parsed && typeof parsed.score === "number" && Array.isArray(parsed.strengths) && Array.isArray(parsed.suggestions)) {
    return {
      score: Math.max(0, Math.min(10, parsed.score)),
      strengths: parsed.strengths.slice(0, 3),
      suggestions: parsed.suggestions.slice(0, 3),
    };
  }
  return null;
}

export async function evaluateBenchmark({ prompt, exercises, apiKey, provider, model }) {
  if (!prompt || !prompt.trim()) throw new Error("prompt is required");
  if (!exercises || !exercises.length) throw new Error("exercises are required");

  const promptEval = evaluatePromptHeuristic(prompt);
  const results = exercises.map((ex) => ({
    num: ex.num,
    title: ex.title,
    query: ex.query,
    tests: ex.tests || [],
    response: null,
    responseScore: null,
    strengths: [],
    suggestions: [],
    demo: true,
  }));

  let demo = true;
  let notice = "Heuristic evaluation — demo responses graded locally. Add an API key on the API page to generate and AI-grade real chatbot responses.";
  let respStrengths = [];
  let respSuggestions = [];

  const hasKey = Boolean(apiKey && apiKey.length >= 10);
  let generatedCount = 0;

  if (hasKey) {
    const generated = await Promise.all(
      exercises.map((ex) =>
        generateChatbotResponse({ systemPrompt: prompt, userMessage: ex.query, apiKey, provider, model })
      ).map((p) => p.catch(() => ""))
    );
    const grades = await Promise.all(
      exercises.map((ex, i) =>
        generated[i]
          ? gradeResponseWithLLM({ prompt, query: ex.query, tests: ex.tests || [], response: generated[i], apiKey, provider, model })
          : Promise.resolve(null)
      )
    );

    exercises.forEach((ex, i) => {
      results[i].response = generated[i] || DEMO_RESPONSES[ex.num] || null;
      results[i].demo = !generated[i];
      if (generated[i]) generatedCount += 1;

      const llm = grades[i];
      if (llm) {
        results[i].responseScore = Number(llm.score.toFixed(1));
        results[i].strengths = llm.strengths;
        results[i].suggestions = llm.suggestions;
        respStrengths.push(...llm.strengths);
        respSuggestions.push(...llm.suggestions);
      } else {
        const heuristic = gradeResponseHeuristic(results[i].response);
        results[i].responseScore = heuristic.score;
        results[i].strengths = heuristic.strengths;
        results[i].suggestions = heuristic.suggestions;
        respStrengths.push(...heuristic.strengths);
        respSuggestions.push(...heuristic.suggestions);
      }
    });

    if (generatedCount === exercises.length) {
      demo = false;
      notice = "AI evaluation — real chatbot responses were generated and graded for each of the 10 scenarios.";
    } else if (generatedCount > 0) {
      notice = `AI evaluation — real responses generated for ${generatedCount} of ${exercises.length} scenarios; the rest use demo responses graded locally.`;
    } else {
      notice = "Provider returned no responses. Showing demo responses graded with the heuristic engine.";
    }
  } else {
    exercises.forEach((ex, i) => {
      results[i].response = DEMO_RESPONSES[ex.num] || null;
      const heuristic = gradeResponseHeuristic(results[i].response);
      results[i].responseScore = heuristic.score;
      results[i].strengths = heuristic.strengths;
      results[i].suggestions = heuristic.suggestions;
      respStrengths.push(...heuristic.strengths);
      respSuggestions.push(...heuristic.suggestions);
    });
  }

  const overallResponseScore = Number(
    (results.reduce((sum, r) => sum + (r.responseScore ?? 0), 0) / results.length).toFixed(1)
  );
  const finalScore = Math.round(0.4 * promptEval.score + 0.6 * overallResponseScore);

  let level;
  if (finalScore >= 9) level = "Expert Context Engineer";
  else if (finalScore >= 7.5) level = "Proficient Context Engineer";
  else if (finalScore >= 6) level = "Developing Context Engineer";
  else if (finalScore >= 4) level = "Foundation";
  else level = "Getting Started";

  return {
    promptScore: promptEval.score,
    promptEval,
    results,
    overallResponseScore,
    gradedCount: results.length,
    finalScore,
    level,
    strengths: dedupe([...promptEval.strengths, ...respStrengths]).slice(0, 8),
    suggestions: dedupe([...promptEval.suggestions, ...respSuggestions]).slice(0, 8),
    demo,
    notice,
  };
}
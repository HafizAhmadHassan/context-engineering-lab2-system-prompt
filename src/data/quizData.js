export const quizData = [
  {
    id: "q1",
    number: 1,
    concept: "Prompt Altitude",
    source: "ideas3/Quiz1.md",
    question:
      "Which system prompt instruction is at the right altitude for handling customer pricing questions?",
    options: [
      { id: "A", text: "Respond politely and helpfully to every customer." },
      { id: "B", text: "Only ever answer questions about the March 2024 price sheet for the Ultra Pro laptop." },
      { id: "C", text: "Answer customer pricing questions by checking the current price list and explaining price changes clearly." },
      { id: "D", text: "Just do your best in every conversation." },
    ],
    correctAnswer: "C",
    explanation:
      "Option C provides the appropriate level of abstraction — the correct altitude. It is not overly general (options A and D give almost no useful guidance) and not overly specific (option B focuses on a very narrow situation). A good system prompt should be reusable across many customer pricing questions.",
  },
  {
    id: "q2",
    number: 2,
    concept: "Five Components of a System Prompt",
    source: "ideas3/Quiz1.md",
    question:
      "Suppose your system prompt has become too large and you need to remove something to reduce token usage. Which of the five components (Identity, Rules, Format, Knowledge, Tools) should be removed last?",
    options: [
      { id: "A", text: "Identity" },
      { id: "B", text: "Rules" },
      { id: "C", text: "Format" },
      { id: "D", text: "Knowledge" },
    ],
    correctAnswer: "B",
    explanation:
      "Rules act as guardrails, safety constraints, and behavioral guidance. Removing rules first would make the model much less reliable, so rules should be preserved for as long as possible. If you must choose between Identity, Format, Knowledge, and Rules — always keep the rules.",
  },
  {
    id: "q3",
    number: 3,
    concept: "Highest Value Per Token in CLAUDE.md",
    source: "ideas3/Quiz1.md",
    question: "Which section of a CLAUDE.md file provides the highest value per token?",
    options: [
      { id: "A", text: "Project Overview" },
      { id: "B", text: "Project Structure" },
      { id: "C", text: "Code Conventions" },
      { id: "D", text: "Common Mistakes" },
    ],
    correctAnswer: "D",
    explanation:
      "Common Mistakes provides extremely high value. When using Claude Code (or any coding agent), one of the biggest problems is the model repeatedly making the same mistakes. If those mistakes are documented beforehand, the model avoids them immediately — preventing loops, incorrect implementations, and repeated feedback. This saves both time and tokens.",
  },
  {
    id: "q4",
    number: 4,
    concept: "Five-Layer Context Stack",
    source: "ideas3/Quiz1.md",
    question: "Which layer of the five-layer context stack is loaded into every LLM call?",
    options: [
      { id: "A", text: "Layer 1" },
      { id: "B", text: "Layer 2" },
      { id: "C", text: "Layer 3" },
      { id: "D", text: "Layer 4" },
    ],
    correctAnswer: "A",
    explanation:
      "Layer 1 is loaded into every LLM call. Note that this does not mean the entire CLAUDE.md is loaded — instead, only the relevant portions of CLAUDE.md (or agents.md) are retrieved. This distinction is important.",
  },
  {
    id: "q5",
    number: 5,
    concept: "Few-Shot Examples",
    source: "ideas3/Quiz1.md",
    question:
      "Suppose you have room for five examples and increase from three examples to five. How does accuracy change?",
    options: [
      { id: "A", text: "It always improves, because more examples mean more context." },
      { id: "B", text: "It always decreases, because the model becomes confused by more examples." },
      { id: "C", text: "It may improve slightly, stay the same, or even decrease depending on the examples added." },
      { id: "D", text: "It has no effect at all on classification accuracy." },
    ],
    correctAnswer: "C",
    explanation:
      "There is no universal consensus — different research papers give different conclusions. Adding more examples does not always improve performance. If you start with three balanced examples (positive, neutral, negative) and add two more positive ones, the distribution becomes positive ×3, neutral ×1, negative ×1. Diversity decreases and the model may overemphasize positive classifications. Diversity matters more than simply increasing the number of examples.",
  },
  {
    id: "q6",
    number: 6,
    concept: "Dynamic vs Static Example Selection",
    source: "ideas3/Quiz1.md",
    question:
      "You have a bank of 15 customer support examples. A customer asks about a damaged product. Why is dynamic example selection better than static selection?",
    options: [
      { id: "A", text: "It provides better variety and prevents overfitting." },
      { id: "B", text: "It is faster to build and easier to maintain." },
      { id: "C", text: "It wastes fewer tokens by retrieving only the most relevant examples for the current query." },
      { id: "D", text: "It guarantees higher accuracy on every query." },
    ],
    correctAnswer: "C",
    explanation:
      "Static selection wastes tokens. Every API call loads the exact same examples, and many of them are irrelevant — e.g., refund, billing, or password reset examples loaded for a shipping question. Dynamic retrieval selects the examples specifically about the current query (e.g., shipping), giving lower token usage, more relevant context, and better efficiency. Variety and overfitting may be partially true, but they are not the main reason.",
  },
  {
    id: "q7",
    number: 7,
    concept: "Starting Small",
    source: "ideas3/Quiz1.md",
    question:
      "Why does Anthropic recommend starting with a minimal prompt and gradually adding rules, rather than writing the entire CLAUDE.md immediately?",
    options: [
      { id: "A", text: "A large prompt always makes the model respond more slowly." },
      { id: "B", text: "At the start you don't yet know which rules are necessary, which mistakes the model will make, or which edge cases will appear — a large prompt is largely speculation." },
      { id: "C", text: "Claude Code has a hard file-size limit on CLAUDE.md." },
      { id: "D", text: "Smaller prompts are always more accurate regardless of the situation." },
    ],
    correctAnswer: "B",
    explanation:
      "At the beginning of development you don't yet know what rules are necessary, which mistakes the model will make, or which edge cases will appear, so a large prompt written immediately is largely based on speculation. The better approach is to start very small, observe failures, then add rules based on actual experience. Caveat: if you already know your project extremely well, you can write a complete CLAUDE.md in one shot — the recommendation is general, not absolute.",
  },
  {
    id: "q8",
    number: 8,
    concept: "Nested agents.md",
    source: "ideas3/Quiz1.md",
    question:
      "In a hierarchy with a root agents.md and another agents.md inside src/api/, how does the hierarchy work?",
    options: [
      { id: "A", text: "Only the deepest agents.md is loaded; the parent file is ignored." },
      { id: "B", text: "Only the root agents.md is loaded; nested files are ignored." },
      { id: "C", text: "Every agents.md file is considered; the deeper file overrides conflicting parent rules, and nothing is discarded." },
      { id: "D", text: "The files are merged alphabetically regardless of directory depth." },
    ],
    correctAnswer: "C",
    explanation:
      "Every agents.md file is considered — only the deepest file being loaded cannot be correct, because you would lose all the useful parent rules. The hierarchy is cumulative: if a root rule and an API-folder rule conflict, the deeper rule overrides. Nothing is discarded; everything else from the parent remains available.",
  },
  {
    id: "q9",
    number: 9,
    concept: "Multi-Step Policies",
    source: "ideas3/Quiz1.md",
    question:
      "For a multi-step policy like determining refund eligibility (based on order date, product type, and product condition), which few-shot example pattern should you use?",
    options: [
      { id: "A", text: "Simple input–output pairs." },
      { id: "B", text: "Chain-of-thought examples that demonstrate problem → reasoning → final decision." },
      { id: "C", text: "Prefix–suffix examples showing only the final JSON output." },
      { id: "D", text: "A single static example repeated several times." },
    ],
    correctAnswer: "B",
    explanation:
      "Refund eligibility is not a simple classification problem. Chain-of-thought examples should demonstrate the full path — problem, reasoning, and final decision. These reasoning examples teach the model how to handle complex, multi-step policies.",
  },
  {
    id: "q10",
    number: 10,
    concept: "Few-Shot Example Patterns",
    source: "ideas3/Quiz1.md",
    question:
      "Which few-shot example pattern is best for teaching structured output formats such as JSON, code, or company documentation style?",
    options: [
      { id: "A", text: "Input–Output Pairs" },
      { id: "B", text: "Prefix–Suffix" },
      { id: "C", text: "Chain-of-Thought" },
      { id: "D", text: "None of the above — examples cannot teach output formats." },
    ],
    correctAnswer: "B",
    explanation:
      "Input–output pairs are used for simple tasks like classification (e.g., email → spam). Prefix–suffix examples teach structured output formats by providing a complete example showing exactly how the JSON, source code, or company documentation should look — instead of simply saying 'Return JSON.' Chain-of-thought is used when the model must reason through multiple steps before reaching a decision.",
  },
  {
    id: "q11",
    number: 11,
    concept: "Prompt Size & RAG",
    source: "ideas3/Quiz2.md",
    question: "Your system prompt has grown to approximately 5,200 tokens. According to prompt engineering best practices, what should you do?",
    options: [
      { id: "A", text: "Compress the prompt so it stays short." },
      { id: "B", text: "Keep everything — more context is better." },
      { id: "C", text: "Split the prompt across multiple static files." },
      { id: "D", text: "Use RAG-based retrieval: keep persistent information in CLAUDE.md and retrieve only the sections needed for the current task." },
    ],
    correctAnswer: "D",
    explanation:
      "Instead of placing every piece of information into one enormous system prompt, keep persistent information (identity, important rules, coding standards) in CLAUDE.md and dynamically retrieve task-specific information (relevant project sections, related examples, API docs) only when needed. Not everything should be persistent and not everything should be dynamic — the ideal design combines both.",
  },
  {
    id: "q12",
    number: 12,
    concept: "Selecting Few-Shot Examples",
    source: "ideas3/Quiz2.md",
    question: "You have 20 examples and need to select 3. Which selection principle matters most?",
    options: [
      { id: "A", text: "Similarity to the training data" },
      { id: "B", text: "Diversity" },
      { id: "C", text: "The order in which they were created" },
      { id: "D", text: "The length of each example" },
    ],
    correctAnswer: "B",
    explanation:
      "Diversity matters most. A good example set should cover different situations. Positive/Positive/Positive is a poor set, while Positive/Neutral/Negative exposes the model to more variation, which generally improves generalization.",
  },
  {
    id: "q13",
    number: 13,
    concept: "Accuracy After Deployment",
    source: "ideas3/Quiz2.md",
    question:
      "A chatbot scored 9/10 at build time but only 5/10 after a month in production, with nothing in the prompt changed. What is the best explanation?",
    options: [
      { id: "A", text: "The model was silently changed by the provider." },
      { id: "B", text: "Production users ask different questions than the fixed test set, and long conversations accumulate context that degrades quality (context rot)." },
      { id: "C", text: "Production latency makes the model answer incorrectly." },
      { id: "D", text: "The prompt must have been wrong all along." },
    ],
    correctAnswer: "B",
    explanation:
      "The model silently changing is not the main explanation, and latency affects speed rather than correctness. Developers usually test with a fixed set of examples, but real customers ask completely different questions. The instructor also introduces context rot: long conversations gradually accumulate more irrelevant context, degrading performance. A drop in production accuracy does not necessarily mean the prompt is wrong.",
  },
  {
    id: "q14",
    number: 14,
    concept: "Grounding & Tools",
    source: "ideas3/Quiz2.md",
    question:
      "In Round 1 the chatbot hallucinated order information. How should Round 2 improve the prompt?",
    options: [
      { id: "A", text: "Add the rule: 'Never hallucinate.'" },
      { id: "B", text: "Provide a few more examples of correct order details." },
      { id: "C", text: "Give the chatbot access to an order lookup function and instruct it to call it for order requests." },
      { id: "D", text: "Ask the customer to confirm their order ID twice before answering." },
    ],
    correctAnswer: "C",
    explanation:
      "Simply saying 'Never hallucinate' is too vague. Instead, instruct the model: if the request concerns an order, call the order retrieval function. This gives the model a concrete mechanism for getting correct information instead of an abstract instruction.",
  },
  {
    id: "q15",
    number: 15,
    concept: "Lost-in-the-Middle",
    source: "ideas3/Quiz2.md",
    question:
      "Your CLAUDE.md has grown to 1,200 lines. Should you simply keep sending the whole file on every request?",
    options: [
      { id: "A", text: "Yes — more context is always better." },
      { id: "B", text: "Yes — as long as you can afford the API cost." },
      { id: "C", text: "No — the API cost alone makes it impossible." },
      { id: "D", text: "No — even ignoring cost, important information becomes buried inside the massive prompt (the lost-in-the-middle problem) and the model may overlook it." },
    ],
    correctAnswer: "D",
    explanation:
      "There are two risks: higher API costs from carrying a huge amount of repeated context, and the lost-in-the-middle problem — the bigger issue. Important information becomes buried inside a massive prompt and the model may overlook it. Even if API cost is not a concern, the quality degradation caused by 'lost in the middle' is a major problem.",
  },
  {
    id: "q16",
    number: 16,
    concept: "Vague Instructions",
    source: "ideas3/Quiz2.md",
    question:
      "The chatbot hallucinates order information. You add the rule 'Never hallucinate' and nothing improves. Why?",
    options: [
      { id: "A", text: "The model ignores all system rules." },
      { id: "B", text: "The instruction is far too vague — it doesn't say what the model should do instead, how to obtain correct information, or which tool to use." },
      { id: "C", text: "The model cannot understand the instruction in English." },
      { id: "D", text: "Hallucinations can never be prevented." },
    ],
    correctAnswer: "B",
    explanation:
      "The phrase 'Never hallucinate' does not specify what the model should do instead, how it should obtain correct information, or which tool it should use. Even a human would find this instruction incomplete. Provide concrete behavior instead — e.g., use an order lookup API, verify information before answering, or ask the customer for missing details.",
  },
  {
    id: "q17",
    number: 17,
    concept: "Example Diversity",
    source: "ideas3/Quiz2.md",
    question:
      "You start with balanced examples (positive, neutral, negative) and add two more positive examples. What happens?",
    options: [
      { id: "A", text: "Accuracy always improves because there are more examples." },
      { id: "B", text: "Performance may actually become worse because the model overemphasizes positive classification." },
      { id: "C", text: "Nothing changes — additional examples have no effect." },
      { id: "D", text: "The model becomes better at classifying negative cases." },
    ],
    correctAnswer: "B",
    explanation:
      "The distribution becomes positive ×3, neutral ×1, negative ×1. The model may begin overemphasizing positive classification, which reduces diversity. Whether performance improves or declines depends on context, but adding repetitive examples is generally not a good strategy.",
  },
  {
    id: "q18",
    number: 18,
    concept: "Five-Layer Context Stack",
    source: "ideas3/Quiz2.md",
    question:
      "Which context layer is frequently underinvested despite having a large impact?",
    options: [
      { id: "A", text: "Layer 1 — CLAUDE.md / agents.md, always loaded" },
      { id: "B", text: "Layer 4 — few-shot examples" },
      { id: "C", text: "Layer 5 — retrieval / RAG infrastructure" },
      { id: "D", text: "Layer 2 — tool definitions" },
    ],
    correctAnswer: "B",
    explanation:
      "From the instructor's experience working with companies, many teams invest heavily in RAG, retrieval, and vector databases but neglect creating high-quality few-shot examples. Layer 4 is frequently underinvested despite having a large impact — e.g., teams building an email response agent often skip collecting real human-to-human email conversations that would teach tone, style, and response quality. Although Layer 1 is always important, Layer 4 is the most neglected.",
  },
  {
    id: "q19",
    number: 19,
    concept: "Few-Shot vs System Prompt",
    source: "ideas3/Quiz3.md",
    question:
      "The system prompt says 'Be formal and professional,' but the few-shot examples demonstrate a casual, friendly tone. Which style will the model most likely follow?",
    options: [
      { id: "A", text: "Always the system prompt — instructions beat examples." },
      { id: "B", text: "Always the few-shot examples — demonstrations beat instructions." },
      { id: "C", text: "Most likely the few-shot examples, because they demonstrate concrete behavior — but this is a general tendency, not an absolute rule." },
      { id: "D", text: "Neither — the model selects a style at random." },
    ],
    correctAnswer: "C",
    explanation:
      "The system prompt instruction ('Be formal and professional') is relatively abstract — it tells the model what to do but not how. Few-shot examples actually demonstrate the desired behavior, showing the model 'this is exactly how I want you to respond,' which often has a stronger influence. However, this is not physics: LLMs are probabilistic, and different models may prioritize system prompts or examples differently. Treat it as a statistical tendency, not a law.",
  },
  {
    id: "q20",
    number: 20,
    concept: "Dynamic Retrieval",
    source: "ideas3/Quiz3.md",
    question:
      "Static few-shot selection wastes approximately 30% of the available tokens on irrelevant examples. How does dynamic example selection solve this?",
    options: [
      { id: "A", text: "It deletes the irrelevant examples permanently." },
      { id: "B", text: "It uses RAG to retrieve only the examples most relevant to the current query." },
      { id: "C", text: "It caches past responses to avoid repeated API calls." },
      { id: "D", text: "It compresses all examples into fewer tokens." },
    ],
    correctAnswer: "B",
    explanation:
      "Instead of loading the same three examples every time, the retrieval system selects the examples most relevant to the current query — exactly the same principle discussed for retrieving relevant sections from CLAUDE.md. Dynamic retrieval reduces wasted tokens, improves relevance, and uses the context window more efficiently.",
  },
  {
    id: "q21",
    number: 21,
    concept: "Iterative Prompting",
    source: "ideas3/Quiz3.md",
    question:
      "Developer A writes an 800-token system prompt immediately and scores 6/10. Developer B starts with only three lines, iterates, and ends at 400 tokens with a 9/10. Why did the shorter prompt perform better?",
    options: [
      { id: "A", text: "Longer prompts are always worse than shorter ones." },
      { id: "B", text: "Writing everything at once requires predicting future edge cases and failures — many of those assumptions are wrong. Experience-based rules are superior to speculative rules." },
      { id: "C", text: "400 tokens is the maximum usable context window." },
      { id: "D", text: "Developer B must have been using a better model." },
    ],
    correctAnswer: "B",
    explanation:
      "Writing everything at once requires making many assumptions — you are essentially predicting future edge cases, rules, and failures, and many of those predictions will be wrong. The better strategy is to start small, observe failures, and add rules based on actual experience. Experience-based rules are generally superior to speculative rules.",
  },
  {
    id: "q22",
    number: 22,
    concept: "Prompt Components",
    source: "ideas3/Quiz3.md",
    question: "Suppose your prompt must become shorter. Which component is safest to remove first?",
    options: [
      { id: "A", text: "Identity" },
      { id: "B", text: "Rules" },
      { id: "C", text: "Format" },
      { id: "D", text: "Knowledge" },
    ],
    correctAnswer: "A",
    explanation:
      "The model can often infer its role from rules, examples, and conversation context, so removing the identity paragraph usually has the smallest impact. Caveat: the identity section is usually already very short, so if the objective is to remove the largest number of tokens, removing it alone doesn't help much — in real projects CLAUDE.md is rarely the bottleneck compared to tool descriptions and other contextual information.",
  },
  {
    id: "q23",
    number: 23,
    concept: "Context Rot",
    source: "ideas3/Quiz3.md",
    question:
      "You confirm that your chatbot suffers from context rot and its performance gradually degrades. Which fix addresses this problem?",
    options: [
      { id: "A", text: "Reduce the system prompt to under 100 tokens." },
      { id: "B", text: "Increase the model's maximum context window." },
      { id: "C", text: "Reinject key system prompts and add explicit rules that address observed failures." },
      { id: "D", text: "Add few-shot examples for every possible scenario." },
    ],
    correctAnswer: "C",
    explanation:
      "Reducing the prompt below 100 tokens is too little information — about a short paragraph. Developers usually cannot control the model's maximum context window. Reinjecting key system prompts is one possible solution. In practice, making rules explicit significantly improves behavior — e.g., in the instructor's email chatbot, adding explicit rules ('Never refer to links before November 2025; always use newer links') helped. Multiple approaches can work; there is no single universally correct answer.",
  },
  {
    id: "q24",
    number: 24,
    concept: "Common Mistakes / Tribal Knowledge",
    source: "ideas3/Quiz3.md",
    question: "Why does documenting common mistakes in a CLAUDE.md file help so much?",
    options: [
      { id: "A", text: "Models have a built-in negativity bias that makes them learn from warnings." },
      { id: "B", text: "Common mistakes encode developer experience — knowledge that exists only inside developers' heads and cannot be learned by simply reading the code." },
      { id: "C", text: "It makes the prompt longer, and longer prompts always produce better results." },
      { id: "D", text: "Models learn best from explicit negative feedback." },
    ],
    correctAnswer: "B",
    explanation:
      "The model can learn many things automatically by reading code — naming conventions, project structure, coding patterns. But it cannot discover rules that only exist in developers' experience, code review comments, and team conventions, such as 'never use raw SQL; always use the query builder' or 'avoid floating-point arithmetic for financial values.' Knowing what not to do also reduces the search space, which is a reasonable additional explanation.",
  },
];

export const quizIntro = {
  totalQuestions: quizData.length,
  description:
    "A 24-question quiz based on the context engineering lecture: prompt altitude, the five components of a system prompt, CLAUDE.md best practices, few-shot examples, RAG, context rot, and more. Each question comes with an instructor explanation, so take your time and reason through every answer.",
  concepts: [
    { title: "Prompt Altitude & Components", count: quizData.filter((q) => q.concept === "Prompt Altitude" || q.concept === "Five Components of a System Prompt" || q.concept === "Prompt Components").length },
    { title: "CLAUDE.md & Context Stack", count: quizData.filter((q) => ["Highest Value Per Token in CLAUDE.md", "Five-Layer Context Stack", "Nested agents.md", "Lost-in-the-Middle", "Common Mistakes / Tribal Knowledge"].includes(q.concept)).length },
    { title: "Few-Shot Examples & Diversity", count: quizData.filter((q) => ["Few-Shot Examples", "Dynamic vs Static Example Selection", "Multi-Step Policies", "Few-Shot Example Patterns", "Selecting Few-Shot Examples", "Example Diversity", "Few-Shot vs System Prompt", "Dynamic Retrieval"].includes(q.concept)).length },
    { title: "Prompts, RAG & Reliability", count: quizData.filter((q) => ["Prompt Size & RAG", "Accuracy After Deployment", "Grounding & Tools", "Vague Instructions", "Iterative Prompting", "Context Rot", "Starting Small", "Prompt Components"].includes(q.concept)).length },
  ],
};

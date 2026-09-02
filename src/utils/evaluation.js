export const CONVENTIONS = [
  { key: "decimal", label: "Uses Decimal (not float)" },
  { key: "lookup", label: "Grade lookup table (not if/elif)" },
  { key: "dataclass", label: "Returns GradeReport dataclass" },
  { key: "csv", label: "Uses csv.writer (not string concat)" },
  { key: "config", label: "Weights from config dict (not hardcoded)" },
];

export const claudeMdSections = {
  overview: "Student grade calculator that computes weighted final grades, assigns letter grades, and exports CSV reports.",
  structure: "• /src\n• main.py\n• grade.py\n• csv_export.py\n• config.py",
  conventions: "• Use Decimal\n• Use lookup tables\n• Return GradeReport dataclass\n• Use csv.writer\n• Avoid hardcoded weights",
  testing: "• validate with unit tests\n• edge cases: empty inputs\n• 100% coverage expected",
  patterns: "• csv.writer for exports\n• config-driven architecture\n• dataclasses\n• lookup tables",
  mistakes: "• Don't use float\n• Don't concatenate CSV strings\n• Don't hardcode grade cutoffs\n• Don't return dictionaries",
};

export function buildClaudeMd(sections = claudeMdSections) {
  return [
    "# Project Overview",
    "",
    sections.overview,
    "",
    "# Project Structure",
    "",
    sections.structure,
    "",
    "# Code Conventions",
    "",
    sections.conventions,
    "",
    "# Testing Requirements",
    "",
    sections.testing,
    "",
    "# Important Patterns",
    "",
    sections.patterns,
    "",
    "# Common Mistakes to Avoid",
    "",
    sections.mistakes,
  ].join("\n");
}

export function demoOutput(withContext) {
  if (withContext) {
    return `from decimal import Decimal
from dataclasses import dataclass
import csv
from config import WEIGHTS

@dataclass
class GradeReport:
    total: Decimal
    letter: str

GRADES = [
    (Decimal("90"), "A"),
    (Decimal("80"), "B"),
    (Decimal("70"), "C"),
    (Decimal("60"), "D"),
]

def calculate_final_grade(grades):
    weighted = sum(
        (Decimal(str(score)) * WEIGHTS[category] for category, score in grades.items()),
        Decimal("0"),
    )
    letter = next(
        (grade for cutoff, grade in GRADES if weighted >= cutoff),
        "F",
    )
    return GradeReport(total=weighted, letter=letter)`;
  }
  return `def calculate_final_grade(grades):
    total = 0
    for category, score in grades.items():
        if category == "assignments":
            total += score * 0.4
        elif category == "exams":
            total += score * 0.5
        elif category == "participation":
            total += score * 0.1

    if total >= 90:
        letter = "A"
    elif total >= 80:
        letter = "B"
    elif total >= 70:
        letter = "C"
    elif total >= 60:
        letter = "D"
    else:
        letter = "F"

    return {"total": total, "letter": letter}`;
}

export function evaluateCode(code) {
  const src = code || "";
  const has = (needle) => src.includes(needle);
  return [
    { ...CONVENTIONS[0], met: (has("Decimal") || has("from decimal")) && !has("float") },
    {
      ...CONVENTIONS[1],
      met: (has("GRADES") || has("lookup") || has("next(")) && !has("elif"),
    },
    { ...CONVENTIONS[2], met: has("@dataclass") || has("GradeReport") },
    { ...CONVENTIONS[3], met: has("csv.writer") || has("import csv") },
    { ...CONVENTIONS[4], met: has("WEIGHTS") || has("from config") || has("config.") },
  ];
}

export const PROMPT_CRITERIA = [
  {
    key: "identity",
    label: "Identity & Role",
    weight: 1,
    hint: "Define who the chatbot is and the business it represents (e.g., 'You are a customer support agent for Cloud Store').",
    keywords: ["you are", "act as", "role", "customer support", "agent", "assistant", "represent"],
  },
  {
    key: "verification",
    label: "Verification & Grounding",
    weight: 1.5,
    hint: "Require the model to verify, check, or look up information before answering.",
    keywords: ["verify", "verif", "check", "confirm", "look up", "retriev", "query", "ensure", "review", "validate"],
  },
  {
    key: "antiHallucination",
    label: "Anti-Hallucination",
    weight: 1.5,
    hint: "Explicitly forbid inventing prices, policies, order details, or other facts.",
    keywords: ["never", "don't", "do not", "must not", "invent", "fabricat", "guess", "assum", "make up", "hallucin"],
  },
  {
    key: "workflow",
    label: "Workflow / Process",
    weight: 1.5,
    hint: "Describe a step-by-step process (check the order, read the policy, determine eligibility, then respond).",
    keywords: ["first", "then", "next", "step", "before", "after", "workflow", "process", "when a customer", "if a customer", "1.", "2.", "3."],
  },
  {
    key: "tone",
    label: "Tone & Empathy",
    weight: 1,
    hint: "Define the communication style: professional, empathetic, friendly, calm.",
    keywords: ["professional", "empath", "friendly", "calm", "respectful", "polite", "apolog", "acknowledge", "tone", "clear", "patient", "compassion"],
  },
  {
    key: "edgeCases",
    label: "Edge Cases & Escalation",
    weight: 1,
    hint: "Handle unusual or sensitive situations and define when and how to escalate.",
    keywords: ["escalat", "edge case", "special", "unusual", "exception", "sensitive", "if the customer", "when the customer", "threat", "legal", "sue", "manager"],
  },
  {
    key: "clarify",
    label: "Clarifying Questions",
    weight: 1,
    hint: "Instruct the model to ask for missing details instead of assuming.",
    keywords: ["ask", "clarif", "question", "gather", "more information", "details", "missing", "follow up"],
  },
  {
    key: "concrete",
    label: "Concrete Mechanisms",
    weight: 1,
    hint: "Point the model to a concrete way to obtain facts (order lookup, tool, API, database).",
    keywords: ["lookup", "look up", "tool", "function", "api", "database", "retriev", "fetch", "query", "record", "order", "system"],
  },
  {
    key: "structure",
    label: "Structure & Organization",
    weight: 0.5,
    hint: "Organize the prompt into clear sections or steps rather than one long paragraph.",
    keywords: ["identity", "rules", "tone", "workflow", "process", "section", "responsibilities", "##", "#", "- ", "•", "1.", "2."],
  },
];

export function evaluatePromptHeuristic(promptText) {
  const src = promptText || "";
  const lower = src.toLowerCase();
  const lines = src.split("\n").filter((l) => l.trim().length > 0);
  const has = (keywords) => keywords.some((k) => lower.includes(k.toLowerCase()));

  const criteria = PROMPT_CRITERIA.map((c) => {
    let met;
    if (c.key === "structure") {
      met = lines.length >= 3 && has(c.keywords);
    } else {
      met = has(c.keywords);
    }
    return { label: c.label, met, weight: c.weight, hint: c.hint };
  });

  const score = Number(criteria.reduce((sum, r) => sum + (r.met ? r.weight : 0), 0).toFixed(1));
  const strengths = criteria.filter((r) => r.met).map((r) => r.label);
  const suggestions = criteria
    .filter((r) => !r.met)
    .map((r) => `${r.label} — ${r.hint}`);

  let feedback;
  if (score >= 9) {
    feedback = "Excellent system prompt. It defines the role, grounds answers in data, and gives the model a concrete process to follow. Small refinements around edge cases or tone will push it to expert level.";
  } else if (score >= 7.5) {
    feedback = "Strong prompt that covers most context engineering basics. Close the remaining gaps below to make behavior more reliable across scenarios.";
  } else if (score >= 6) {
    feedback = "Good foundation, but the model will still guess or improvise on important details. Add the missing rules below so decisions are grounded and repeatable.";
  } else if (score >= 4) {
    feedback = "The prompt gives the model a role, but it lacks the guardrails needed for reliable customer support. Without rules and a process, responses will be inconsistent.";
  } else {
    feedback = "The prompt is too thin to control behavior reliably. Start with an identity, then add verification rules, a workflow, tone, and edge-case handling.";
  }

  let level;
  if (score >= 9) level = "Expert Context Engineer";
  else if (score >= 7.5) level = "Proficient Context Engineer";
  else if (score >= 6) level = "Developing Context Engineer";
  else if (score >= 4) level = "Foundation";
  else level = "Getting Started";

  return { score, level, strengths, suggestions, feedback, criteria };
}

export function extractJson(content) {
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch {}
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {}
  return null;
}

export const DEMO_RESPONSES = {
  1: "I'd be happy to help you return your laptop. Let me verify the details of order ORD-12345 and check our return policy first. I'll confirm your eligibility and explain the next steps right after.",
  2: "Let me look up the current price of the MacBook Pro from our product catalog so I can give you accurate information. One moment please.",
  3: "I completely understand how frustrating this is, and I'm sorry for the trouble you've experienced. I want to resolve this for you. Let me look into your situation right away, and if I can't fix it, I'll connect you with a supervisor who can.",
  4: "I'm sorry your package hasn't arrived. Let me investigate the delivery and tracking details to find out what happened. Could you confirm your order number and delivery address so I can start checking?",
  5: "Let me check the status of your order to see whether it can still be cancelled. I'll verify the details and let you know the next steps right away.",
  6: "I'm sorry your headphones stopped working. Let me verify your purchase details and review our warranty policy to check whether you're eligible for a replacement. I'll confirm before I make any promises.",
  7: "Let me check the status of your return and refund in our system so I can give you an accurate update on where it stands and when to expect it.",
  8: "I'm sorry your laptop won't turn on. Let's work through this step by step. First, could you confirm that it's charged and plugged into a working outlet? If the issue continues, I'll escalate it to our technical team.",
  9: "I can help you regain access to your account. For your security, I'll first need to verify your identity. Could you confirm the email address or phone number associated with your account?",
  10: "I'd be glad to help you choose a laptop! To recommend the right one, could you tell me a little about your budget, what you'll use it for, and any preferences like screen size or battery life?",
};

export const dedupe = (arr) => [...new Set(arr)];

export const RESPONSE_CHECKS = [
  { key: "acknowledgment", label: "Acknowledges the customer", weight: 2, hint: "acknowledge the customer's situation before solving", keywords: ["sorry", "understand", "appreciate", "glad", "frustrating", "happy to help", "i can help", "i'd be happy"] },
  { key: "grounding", label: "Verifies / grounds information", weight: 2, hint: "verify or look up information instead of guessing", keywords: ["let me check", "let me verify", "let me look", "investigate", "confirm", "look up", "check the", "verify", "review", "status"] },
  { key: "clarify", label: "Asks clarifying questions", weight: 1.5, hint: "ask for missing details when information is incomplete", keywords: ["could you", "can you", "tell me", "confirm", "need to verify", "which", "what's"] },
  { key: "action", label: "States a clear next step", weight: 1.5, hint: "state a concrete next step or timeline", keywords: ["i'll", "let me", "next steps", "right away", "first", "then", "soon", "one moment"] },
  { key: "tone", label: "Professional, empathetic tone", weight: 1.5, hint: "keep the reply professional and empathetic", keywords: ["sorry", "understand", "please", "glad", "happy", "appreciate", "help", "resolve"] },
  { key: "escalation", label: "Escalation / safety handling", weight: 1.5, hint: "define an escalation or safety path for sensitive situations", keywords: ["escalate", "supervisor", "technical team", "security", "appropriate", "manager", "verify"] },
];

export function gradeResponseHeuristic(response) {
  const src = (response || "").toLowerCase();
  const has = (keywords) => keywords.some((k) => src.includes(k));
  const criteria = RESPONSE_CHECKS.map((c) => ({
    label: c.label,
    met: has(c.keywords),
    weight: c.weight,
    hint: c.hint,
  }));
  const score = Number(criteria.reduce((s, c) => s + (c.met ? c.weight : 0), 0).toFixed(1));
  return {
    score,
    strengths: criteria.filter((c) => c.met).map((c) => c.label),
    suggestions: criteria.filter((c) => !c.met).map((c) => `Response: ${c.label} — ${c.hint}`),
  };
}
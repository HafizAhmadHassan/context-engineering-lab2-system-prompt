# Context Engineering Lab

An interactive learning platform for mastering context engineering and prompt design. Practice writing system prompts, compare LLM outputs with and without structured context, and test your knowledge through quizzes — all from your browser.

**Live Site:** [https://hafizahmadhassan.github.io/context-engineering-lab2-system-prompt/](https://hafizahmadhassan.github.io/context-engineering-lab2-system-prompt/)

---

## Table of Contents

- [Features](#features)
- [Practice Modules](#practice-modules)
- [Getting Started](#getting-started)
- [API Configuration](#api-configuration)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Interactive Practice Labs** — Hands-on exercises comparing LLM responses with and without context
- **Real-time Evaluation** — Instant feedback and scoring on your prompts and outputs
- **CLAUDE.md Builder** — Generate structured context files for your projects
- **Benchmark Testing** — Run your prompts against 10 standardized customer support scenarios
- **Quiz System** — 24 instructor-reviewed questions on prompt and context engineering
- **Multi-Provider Support** — Works with Groq, Google Gemini, OpenAI, and Anthropic
- **No Backend Required** — Fully static site, API calls run directly from your browser
- **Dark Mode UI** — Modern, responsive design with smooth animations

---

## Practice Modules

### 1. System Prompt Exercise

Build a CLAUDE.md file and compare LLM outputs with and without structured context.

- **Single Mode** — Run a prompt with or without CLAUDE.md context
- **Compare Mode** — Side-by-side comparison of outputs
- **Evaluation Tab** — See which conventions your output follows
- **CLAUDE.md Builder** — Six editable sections:
  - Project Overview
  - Project Structure
  - Code Conventions
  - Testing Requirements
  - Important Patterns
  - Common Mistakes to Avoid

### 2. Retrieval & Context Engineering

Comprehensive learning module covering 16 lessons on context engineering principles.

**Learning Content:**
- Context engineering vs. prompt engineering
- Process specification over answer specification
- Grounding responses in available data (RAG)
- Behavioral rules and critical constraints
- Tone design and edge case handling
- Iterative prompt building methodology
- Evaluation methodology and scoring

**Practice Mode:**
- Write one system prompt for a customer support chatbot
- Run against 10 standardized scenarios:
  1. Return Request
  2. Product Price Inquiry
  3. Angry Customer
  4. Missing Package
  5. Cancel Order
  6. Warranty Claim
  7. Refund Status
  8. Technical Support
  9. Account Access
  10. Product Recommendation

**Scoring:**
- Prompt Quality (40%): Altitude, Identity, Rules, Tone, Edge Cases, Structure
- Chatbot Responses (60%): Intent, Workflow, Accuracy, Tone, Safety

### 3. Context Engineering Quiz

Test your knowledge with 24 multiple-choice questions covering:
- Prompt Engineering fundamentals
- Context Engineering principles
- RAG (Retrieval-Augmented Generation)
- System prompt design
- Evaluation methodologies

Features immediate feedback with instructor explanations for each answer.

---

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: 20)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/HafizAhmadHassan/context-engineering-lab2-system-prompt.git
cd context-engineering-lab2-system-prompt

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/context-engineering-lab2-system-prompt/`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## API Configuration

The app supports multiple AI providers. Configure your API key on the **API Configuration** page.

### CORS-Friendly Providers (Recommended)

These providers support browser CORS and work without any backend:

| Provider | Free Tier | Models |
|----------|-----------|--------|
| **Groq** | Yes (rate-limited) | Llama 3.3 70B, Llama 3.1 8B, GPT-OSS 120B, Qwen3 32B |
| **Google Gemini** | Yes (no credit card) | Gemini 2.5 Flash, Gemini 2.5 Flash-Lite, Gemini 2.5 Pro |

### Providers Requiring Proxy

These providers block browser CORS calls. They work in development (via Vite proxy) but need a backend proxy in production:

| Provider | Free Tier | Models |
|----------|-----------|--------|
| **OpenAI** | $15 trial credit | GPT-4o Mini, GPT-5 Nano, GPT-5 Mini, GPT-5 |
| **Anthropic** | ~$5 trial credit | Claude Haiku 4.5, Claude Sonnet 5, Claude Sonnet 4.5, Claude Opus 4.8 |

### Production Proxy (Optional)

For OpenAI/Anthropic in production, set up a Cloudflare Worker proxy:

1. Create a Cloudflare Worker
2. Update `WORKER_URL` in `src/utils/api.js`:
   ```javascript
   const WORKER_URL = "https://your-worker.workers.dev";
   ```

---

## Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── public/
│   └── vite.svg                # Static assets
├── src/
│   ├── components/
│   │   ├── Footer.jsx          # Site footer
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── MotionWrapper.jsx   # Framer Motion utilities
│   │   └── Navbar.jsx          # Navigation bar
│   ├── data/
│   │   └── quizData.js         # Quiz questions and answers
│   ├── pages/
│   │   ├── About.jsx           # About page
│   │   ├── Api.jsx             # API key configuration
│   │   ├── Contact.jsx         # Contact page
│   │   ├── Home.jsx            # Landing page
│   │   ├── Practice.jsx        # Practice module selector
│   │   └── practice/
│   │       ├── Quiz.jsx        # Quiz interface
│   │       ├── Retrieval.jsx   # Context engineering lessons + practice
│   │       └── SystemPrompt.jsx # CLAUDE.md builder + comparison
│   ├── utils/
│   │   ├── api.js              # API provider abstraction
│   │   ├── evaluation.js       # CLAUDE.md sections + prompt evaluation
│   │   └── practiceService.js  # LLM call orchestration
│   ├── App.jsx                 # React Router setup
│   ├── index.css               # Global styles (Tailwind)
│   └── main.jsx                # React entry point
├── worker/                     # Cloudflare Worker proxy (optional)
│   ├── deploy-worker.sh
│   ├── worker.js
│   └── wrangler.toml
├── index.html                  # HTML entry point
├── package.json
├── postcss.config.cjs
├── tailwind.config.js
└── vite.config.js              # Vite config with dev proxy
```

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite 5** | Build tool and dev server |
| **Tailwind CSS 3** | Utility-first styling |
| **Framer Motion** | Animations and transitions |
| **React Router 6** | Client-side routing |
| **GitHub Pages** | Static hosting |
| **GitHub Actions** | CI/CD deployment |

---

## Deployment

### Automatic Deployment

The site deploys automatically via GitHub Actions when you push to `main`:

1. GitHub Actions runs `npm run build`
2. Uploads the `dist/` folder as a Pages artifact
3. Deploys to GitHub Pages

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy using gh-pages (optional)
npx gh-pages -d dist
```

### GitHub Pages Setup

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will run on your next push to `main`

---

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

### Dev Server Proxy

The Vite dev server proxies API calls to avoid CORS issues during development:

- `/api/openai/*` → `https://api.openai.com/v1/*`
- `/api/anthropic/*` → `https://api.anthropic.com/v1/*`
- `/api/google/*` → `https://generativelanguage.googleapis.com/v1beta/*`
- `/api/groq/*` → `https://api.groq.com/openai/v1/*`

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Security Notes

- API keys are stored **only** in your browser's local storage
- Keys are never sent to any server except the configured AI provider
- No tracking or analytics are included
- The site is fully static with no backend

---

## Acknowledgments

- Built as part of the Context Engineering Lab course material
- Demonstrates practical prompt engineering and context design
- Uses modern web technologies for a seamless learning experience

---

## Contact

For questions or feedback, visit the [Contact page](https://hafizahmadhassan.github.io/context-engineering-lab2-system-prompt/contact) or open an issue on GitHub.

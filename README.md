# n8n-nodes-prompeteer

[![npm version](https://img.shields.io/npm/v/n8n-nodes-prompeteer.svg)](https://www.npmjs.com/package/n8n-nodes-prompeteer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Prompeteer.ai](https://prompeteer.ai) community node for [n8n](https://n8n.io) — generate, score, and enhance AI prompts for 140+ platforms.

## Install

In your n8n instance:

**Settings → Community Nodes → Install → `n8n-nodes-prompeteer`**

## Setup

1. Get a free API key at [prompeteer.ai/settings](https://prompeteer.ai/settings?tab=integrations)
2. In n8n: **Credentials → New → Prompeteer API** → paste your key

## Operations

| Operation | What It Does | Quota |
|-----------|-------------|-------|
| **Generate Prompt** | Create an optimized prompt for ChatGPT, Claude, Gemini, Midjourney, and 140+ more platforms | Uses monthly quota ([see pricing](https://prompeteer.ai/pricing)) |
| **Score Prompt** | Get a Prompt Score quality score (0-100) across 16 dimhensions: structure, clarity, context, precision | Free — no quota |
| **Enhance Prompt** | Rewrite any prompt into a professional, optimized version using AI | Free — no quota |

## Example Workflows

### Auto-score before sending to ChatGPT
```
Webhook → Prompeteer (Score) → IF score < 70 → Prompeteer (Enhance) → OpenAI
```

### Batch generate from Google Sheets
```
Google Sheets (Read) → Prompeteer (Generate) → Google Sheets (Write)
```

### Slack bot that improves prompts
```
Slack (Message) → Prompeteer (Enhance) → Slack (Reply)
```

## Platforms Supported

ChatGPT, Claude, Gemini, Midjourney, DALL·E, Stable Diffusion, Perplexity, Grok, Meta AI, Copilot, Suno, Runway, and 130+ more.

## Links

- [API Reference](https://prompeteer.ai/connect)
- [Postman Collection](https://prompeteer.ai/postman/prompeteer-api-collection.json)
- [MCP Server](https://prompeteer.ai/connect)
- [Chrome Extension](https://chromewebstore.google.com/detail/oehemojdcbaalacmgbjcmbdecopjikgb)

## License

MIT — [Garage Capital Ventures LLC](https://prompeteer.ai)

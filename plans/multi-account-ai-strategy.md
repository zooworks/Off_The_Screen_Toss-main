# Multi-Account AI Strategy (High-Speed Free Tier)

## 📌 Goal
Achieve **paid-tier performance (40-60 RPM)** using 3+ Free Tier accounts in rotation, bypassing the single-key Rate Limit (15 RPM).

## 🏗️ Architecture

### 1. Key Management (Round Robin)
- Use a pool of API Keys: `[KEY_1, KEY_2, KEY_3]`
- Rotate keys for every request: `Request 1 -> Key 1`, `Request 2 -> Key 2`, `Request 3 -> Key 3`
- **Smart Failover**: If `Key 1` hits Rate Limit (429), immediately retry with `Key 2` (Zero Downtime).

### 2. Migration: CLI → SDK
- Deprecate **Gemini CLI** (Slow, unstable, separate quota).
- Adopt **Google Generative AI SDK** (`@google/generative-ai`)
  - **Speed**: 3~5s (vs CLI 30s+)
  - **Stability**: No shell spawning overhead.
  - **Control**: Precise error handling.

### 3. Concurrency Boost
- **Before**: 2 items / 3s delay (Effective: ~20 RPM)
- **After**: 6 items parallel / No delay (Effective: ~60 RPM with 3 keys)

---

## 🛠️ Implementation Plan

- [ ] **Step 1: Environment Setup**
    - Add `GEMINI_API_KEYS="key1,key2,key3"` to `.env`
    - Install SDK: `pnpm add @google/generative-ai`

- [ ] **Step 2: Backend Refactor (`gemini.service.ts`)**
    - Create `KeyManager` class to handle rotation & active keys.
    - Replace `spawn('gemini')` with `model.generateContent()`.
    - Implement `retryWithNextKey` logic for 429 errors.

- [ ] **Step 3: Controller Optimization (`ai.controller.ts`)**
    - Remove `delay()` and `CHUNK_SIZE` throttling.
    - Increase `Promise.all` concurrency to match pool size (e.g., 3 keys * 5 threads = 15 parallel).

## ⚠️ Requirements
**You need to provide 3 Google AI Studio API Keys.**
[Get Keys Here](https://aistudio.google.com/app/apikey)

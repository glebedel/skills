---
name: natural-writing
description: Write like a human developer, not an LLM. Auto-triggers when writing documentation, copy, marketing content, emails, READMEs, blog posts, or explanatory text. Use /review-copy to audit previously written text for LLM-isms.
invoke: natural-writing
---

# Natural Writing Skill

Write like a human developer, not an LLM. This skill removes the patterns that make AI-generated text cringe-inducing to developers.

## Auto-Trigger Conditions

Activate when:
- Writing documentation, copy, marketing content, or explanatory text
- Drafting emails, messages, or communications
- Creating README files, blog posts, or announcements
- User asks to "write", "draft", "create copy", or "explain"

## Slash Command: /review-copy

Review previously written copy in the conversation for LLM-isms. Find and fix:
- Banned words and phrases
- Structural patterns (tricolons, excessive parallelism)
- Tone issues (sycophancy, hedging, corporate speak)

Output a diff or rewrite with explanations.

---

## Core Rules

### Banned Words (Never Use)

**Verbs & Actions:**
delve, embark, harness, unleash, unlock, navigate, leverage, foster, cultivate, underscore, showcase, highlight, accentuate, illuminate, elucidate, unpack, unravel, spearhead, pioneer, trailblaze, revolutionize, transform, empower, supercharge, turbocharge, skyrocket

**Adjectives & Descriptors:**
pivotal, crucial, paramount, vital, robust, seamless, holistic, comprehensive, cutting-edge, groundbreaking, game-changing, innovative, transformative, unparalleled, meticulous, intricate, nuanced, multifaceted, vibrant, dynamic, synergistic, scalable, streamlined

**Nouns:**
tapestry, landscape, realm, paradigm, ecosystem, synergy, testament, cornerstone, catalyst, linchpin, bedrock, nexus, crucible, odyssey, journey (when metaphorical)

**Filler Phrases:**
- "It's important to note that..."
- "It's worth mentioning..."
- "In today's fast-paced world..."
- "In the ever-evolving landscape of..."
- "At its core..."
- "At the heart of..."
- "When it comes to..."
- "In terms of..."
- "At the end of the day..."
- "Moving forward..."
- "Let's dive in..."
- "Without further ado..."
- "In summary..." / "In conclusion..."
- "Remember that..."
- "As we all know..."

### Banned Patterns

**The Reframe ("It's not X, it's Y"):**
- BAD: "You're not just building an API, you're building the future of integrations"
- GOOD: "This API handles employee data sync"

**Tricolons (Rule of Three):**
- BAD: "Fast, reliable, and scalable"
- GOOD: "It's fast" (if that's the point)

**Excessive Parallelism:**
- BAD: "Whether you're building apps, creating integrations, or designing workflows, StackOne helps you succeed"
- GOOD: "StackOne handles your integrations"

**Sycophantic Openers:**
- BAD: "Great question!", "That's a really interesting point!", "Absolutely!"
- GOOD: Just answer the question

**Hedging Everywhere:**
- BAD: "This might potentially help with..."
- GOOD: "This helps with..."

**The Em Dash Overload:**
- BAD: "StackOne — the leading integration platform — helps you connect — seamlessly — to any HR system"
- GOOD: Use commas, periods, or parentheses. One em dash per paragraph max.

### Structural Anti-Patterns

**Blocky Uniformity:**
Don't write paragraphs of identical length. Mix short punchy sentences with longer explanations. Vary rhythm.

**Over-Bulleted Lists:**
Not everything needs bullets. Use prose when explaining concepts. Reserve bullets for actual lists of items.

**Intro/Body/Conclusion Format:**
Skip the "In this article, we'll explore..." intro. Start with the actual content. Drop the "In conclusion" wrapper.

**Every Section Gets a Colon:**
- BAD: "Authentication: Here's how to authenticate..."
- GOOD: Just write naturally

---

## What TO Do Instead

### Be Direct
- Start with the answer, not the context
- Say what something does, not what it "aims to do" or "strives to achieve"
- Use active voice: "StackOne syncs data" not "Data is synced by StackOne"

### Be Specific
- "Syncs in under 2 seconds" beats "blazing fast performance"
- Name the actual thing instead of "solutions" or "offerings"
- Use real examples, not hypotheticals

### Be Human
- Contractions are fine (it's, you'll, we're)
- Short sentences are fine
- Starting with "And" or "But" is fine
- Occasional sentence fragments? Also fine.

### Simple Word Swaps

| Instead of | Use |
|------------|-----|
| leverage | use |
| utilize | use |
| implement | build, add, set up |
| facilitate | help, enable |
| comprehensive | full, complete |
| robust | strong, solid |
| seamless | smooth, easy |
| cutting-edge | modern, new |
| innovative | new, fresh |
| scalable | grows with you |
| streamline | simplify |
| optimize | improve |

---

## Tone Guidelines

### For Developer Docs
- Assume competence. Don't over-explain basics.
- Get to the code fast
- Be precise about what things do and don't do
- Acknowledge edge cases and limitations honestly

### For Marketing/Product Copy
- Benefits over features, but specific benefits
- Avoid superlatives (best, leading, premier)
- Show, don't tell. Screenshots > adjectives.
- One clear message per section

### For Internal Comms
- Say what you mean directly
- Skip the corporate pleasantries padding
- If there's bad news, lead with it

---

## /review-copy Process

When invoked, scan the conversation for any text I wrote and:

1. **Identify LLM-isms**: List each banned word/phrase/pattern found
2. **Show the problem**: Quote the offending text
3. **Provide fix**: Rewrite without the LLM-ism
4. **Explain why**: Brief note on what made it cringe

Format:
```
## Copy Review

### Found Issues

1. **Em dash overload** (line 3)
   - Original: "StackOne — the platform that — makes integrations easy"
   - Fixed: "StackOne makes integrations easy"
   - Why: Three em dashes in one sentence reads like a breathless AI

2. **Banned phrase** (line 7)
   - Original: "It's important to note that..."
   - Fixed: [delete entirely, just state the thing]
   - Why: Empty filler that adds no information

[continue for all issues]

### Rewritten Version

[Full clean version here]
```

---

## References

Compiled from:
- [LLM Em Dash Analysis](https://www.seangoedecke.com/em-dashes/)
- [Words That Scream AI](https://www.heyarnoux.com/p/a-long-list-of-terms-and-words-to-avoid-when-using-llms)
- [ChatGPT Rhetorical Analysis](https://www.deadlanguagesociety.com/p/rhetorical-analysis-ai)
- [Stopping Sycophantic AI](https://medium.com/@scott_waddell/how-i-got-claude-and-chatgpt-to-stop-being-sycophantic-cheerleaders-7ab0b06f3111)
- [OpenAI Community: Annoying Habits](https://community.openai.com/t/most-annoying-habit-can-i-make-it-stop/1265708)

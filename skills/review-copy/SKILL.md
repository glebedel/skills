---
name: review-copy
description: Review previously written copy in a conversation for LLM-isms, banned words, and patterns that make AI-generated text obvious.
invoke: review-copy
---

# Review Copy Skill

Review previously written copy in this conversation for LLM-isms.

Scan ALL text generated in this conversation and identify:

## What to Find

**Banned Words:**
delve, embark, harness, unleash, unlock, navigate, leverage, foster, cultivate, underscore, showcase, highlight, accentuate, illuminate, elucidate, unpack, unravel, spearhead, pioneer, trailblaze, revolutionize, transform, empower, supercharge, turbocharge, skyrocket, pivotal, crucial, paramount, vital, robust, seamless, holistic, comprehensive, cutting-edge, groundbreaking, game-changing, innovative, transformative, unparalleled, meticulous, intricate, nuanced, multifaceted, vibrant, dynamic, synergistic, scalable, streamlined, tapestry, landscape, realm, paradigm, ecosystem, synergy, testament, cornerstone, catalyst, linchpin, bedrock, nexus, crucible, odyssey, journey (metaphorical)

**Banned Phrases:**
- "It's important to note..."
- "It's worth mentioning..."
- "In today's fast-paced world..."
- "In the ever-evolving landscape..."
- "At its core..." / "At the heart of..."
- "When it comes to..." / "In terms of..."
- "At the end of the day..."
- "Moving forward..."
- "Let's dive in..."
- "Without further ado..."
- "In summary..." / "In conclusion..."
- "Remember that..."
- "As we all know..."

**Banned Patterns:**
- Em dash overload (more than 1 per paragraph)
- "It's not X, it's Y" reframes
- Tricolons (rule of three lists)
- Sycophantic openers ("Great question!", "Absolutely!")
- Excessive hedging ("might potentially")
- Blocky uniform paragraphs

## Output Format

```
## Copy Review

### Found Issues

1. **[Pattern type]** (location)
   - Original: "[quoted text]"
   - Fixed: "[rewritten version]"
   - Why: [brief explanation]

[repeat for all issues]

### Rewritten Version

[Full clean version of any problematic sections]
```

If no issues found, say: "Copy is clean. No LLM-isms detected."

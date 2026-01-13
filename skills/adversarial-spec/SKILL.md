---
name: adversarial-spec
description: Iteratively refine a product spec by debating with multiple LLMs (GPT, Gemini, Grok, etc.) until all models agree. Use when user wants to write or refine a specification document using adversarial development.
allowed-tools: Bash, Read, Write, AskUserQuestion
---

# Adversarial Spec Development

Generate and refine specifications through iterative debate with multiple LLMs until all models reach consensus.

**Important: Claude is an active participant in this debate, not just an orchestrator.** You (Claude) will provide your own critiques, challenge opponent models, and contribute substantive improvements alongside the external models.

## Requirements

- Python 3.10+ with `litellm` package installed
- API key for at least one provider (set via environment variable)

## Supported Providers

| Provider  | API Key Env Var      | Example Models                              |
|-----------|----------------------|---------------------------------------------|
| OpenAI    | `OPENAI_API_KEY`     | `gpt-4o`, `gpt-4-turbo`, `o1`               |
| Anthropic | `ANTHROPIC_API_KEY`  | `claude-sonnet-4-20250514`, `claude-opus-4-20250514` |
| Google    | `GEMINI_API_KEY`     | `gemini/gemini-2.0-flash`, `gemini/gemini-pro` |
| xAI       | `XAI_API_KEY`        | `xai/grok-3`, `xai/grok-beta`               |
| Mistral   | `MISTRAL_API_KEY`    | `mistral/mistral-large`, `mistral/codestral`|
| Groq      | `GROQ_API_KEY`       | `groq/llama-3.3-70b-versatile`              |
| Deepseek  | `DEEPSEEK_API_KEY`   | `deepseek/deepseek-chat`                    |

Run `python3 ~/.claude/skills/adversarial-spec/scripts/debate.py providers` to see which keys are set.

## Document Types

### PRD (Product Requirements Document)

Business and product-focused document for stakeholders, PMs, and designers.

**Structure:**
- Executive Summary
- Problem Statement / Opportunity
- Target Users / Personas
- User Stories / Use Cases
- Functional Requirements
- Non-Functional Requirements
- Success Metrics / KPIs
- Scope (In/Out)
- Dependencies
- Risks and Mitigations

**Critique Criteria:**
1. Clear problem definition with evidence
2. Well-defined user personas with real pain points
3. User stories follow proper format (As a... I want... So that...)
4. Measurable success criteria
5. Explicit scope boundaries
6. Realistic risk assessment
7. No technical implementation details (that's for tech spec)

### Technical Specification

Engineering-focused document for developers and architects.

**Structure:**
- Overview / Context
- Goals and Non-Goals
- System Architecture
- Component Design
- API Design (endpoints, request/response schemas)
- Data Models / Database Schema
- Infrastructure Requirements
- Security Considerations
- Error Handling Strategy
- Performance Requirements / SLAs
- Observability (logging, metrics, alerting)
- Testing Strategy
- Deployment Strategy
- Migration Plan (if applicable)
- Open Questions / Future Considerations

**Critique Criteria:**
1. Clear architectural decisions with rationale
2. Complete API contracts (not just endpoints, but full schemas)
3. Data model handles all identified use cases
4. Security threats identified and mitigated
5. Error scenarios enumerated with handling strategy
6. Performance targets are specific and measurable
7. Deployment is repeatable and reversible
8. No ambiguity an engineer would need to resolve

## Process

### Step 0: Gather Input

Ask the user:
1. **Document type**: "PRD" or "tech"
2. **Starting point**: Path to existing file or describe what to build
3. **Interview mode** (optional): Comprehensive requirements gathering before debate

### Step 1: Load or Generate Initial Document

**If user provided a file path:** Read and use as starting document.

**If user describes what to build:**
1. Ask 2-4 clarifying questions first
2. Generate a complete document following the appropriate structure
3. Present draft for user review before debate

### Step 2: Select Opponent Models

Check which API keys are configured:

```bash
python3 ~/.claude/skills/adversarial-spec/scripts/debate.py providers
```

Use AskUserQuestion with multiSelect to let user choose models.

### Step 3: Send to Opponent Models for Critique

```bash
python3 ~/.claude/skills/adversarial-spec/scripts/debate.py critique --models MODEL_LIST --doc-type TYPE <<'SPEC_EOF'
<document here>
SPEC_EOF
```

### Step 4: Review, Critique, and Iterate

After receiving opponent model responses:

1. **Provide your own independent critique**
2. **Evaluate opponent critiques** for validity
3. **Synthesize all feedback** into revisions
4. **Explain your reasoning** to the user

Display format:
```
--- Round N ---
Opponent Models:
- [Model A]: <agreed | critiqued: summary>
- [Model B]: <agreed | critiqued: summary>

Claude's Critique:
<Your independent analysis>

Synthesis:
- Accepted from Model A: <what>
- Accepted from Model B: <what>
- Added by Claude: <your contributions>
- Rejected: <what and why>
```

**Handling Early Agreement:** If any model agrees within first 2 rounds, use `--press` flag to verify they actually read the document.

### Step 5: Finalize and Output

When ALL models AND you agree:
1. Print the complete document
2. Write to `spec-output.md`
3. Print summary with rounds, models, and key refinements

### Step 6: User Review Period

Offer options:
1. Accept as-is
2. Request changes
3. Run another review cycle

### Step 7: PRD to Tech Spec (Optional)

If PRD completed, offer to continue into Technical Specification.

## Convergence Rules

- Maximum 10 rounds per cycle
- ALL models AND Claude must agree
- Quality over speed - only accept when genuinely complete
- Be skeptical of early agreement

## Advanced Features

### Focus Modes

```bash
python3 debate.py critique --models gpt-4o --focus security --doc-type tech <<'SPEC_EOF'
```

Available: `security`, `scalability`, `performance`, `ux`, `reliability`, `cost`

### Model Personas

```bash
python3 debate.py critique --models gpt-4o --persona "security-engineer" --doc-type tech <<'SPEC_EOF'
```

Available: `security-engineer`, `oncall-engineer`, `junior-developer`, `qa-engineer`, `site-reliability`, `product-manager`, `data-engineer`, `mobile-developer`, `accessibility-specialist`, `legal-compliance`

### Context Injection

Include existing documents:
```bash
python3 debate.py critique --models gpt-4o --context ./existing-api.md --doc-type tech <<'SPEC_EOF'
```

### Preserve Intent Mode

Require explicit justification for removals:
```bash
python3 debate.py critique --models gpt-4o --preserve-intent --doc-type tech <<'SPEC_EOF'
```

### Cost Tracking

Every critique round displays token usage and estimated cost.

### Saved Profiles

```bash
# Create
python3 debate.py save-profile strict-security --models gpt-4o,gemini/gemini-2.0-flash --focus security

# Use
python3 debate.py critique --profile strict-security <<'SPEC_EOF'
```

### Diff Between Rounds

```bash
python3 debate.py diff --previous round1.md --current round2.md
```

### Export to Task List

```bash
cat spec-output.md | python3 debate.py export-tasks --models gpt-4o --doc-type prd --json
```

## Script Reference

```bash
# Core commands
python3 debate.py critique --models MODEL_LIST --doc-type TYPE [OPTIONS] < spec.md
python3 debate.py diff --previous OLD.md --current NEW.md
python3 debate.py export-tasks --models MODEL --doc-type TYPE [--json] < spec.md

# Info commands
python3 debate.py providers
python3 debate.py focus-areas
python3 debate.py personas
python3 debate.py profiles

# Profile management
python3 debate.py save-profile NAME --models ... [--focus ...] [--persona ...]
```

**Critique options:**
- `--models, -m` - Comma-separated model list (default: gpt-4o)
- `--doc-type, -d` - Document type: prd or tech (default: tech)
- `--round, -r` - Current round number (default: 1)
- `--focus, -f` - Focus area for critique
- `--persona` - Professional persona for critique
- `--context, -c` - Context file (can be used multiple times)
- `--profile` - Load settings from saved profile
- `--preserve-intent` - Require explicit justification for any removal
- `--press, -p` - Anti-laziness check for early agreement
- `--json, -j` - Output as JSON

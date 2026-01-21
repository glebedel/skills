---
name: stackone-remotion-video
description: Create StackOne marketing videos using Remotion with brand guidelines and messaging
metadata:
  tags: remotion, video, marketing, stackone, animation
---

## When to use

Use this skill when creating marketing videos for StackOne features, products, or announcements. This skill ensures videos follow StackOne brand guidelines, messaging framework, and appeal to technical users.

## Workflow Overview

1. **Gather Feature Information** from Notion (marketing brief / feature page)
2. **Fetch Additional Context** from linked resources (Loom videos, URLs, docs)
3. **Design Video Structure** following StackOne messaging guidelines
4. **Build with Remotion** using brand colors and technical-user-focused design
5. **Render and Deliver** in multiple formats (square, landscape, GIF)

---

## Step 1: Gather Feature Information from Notion

### Finding the Marketing Brief

Search Notion for the feature's marketing brief or feature page:

```
Use Notion MCP tools to search for:
- Feature name + "marketing brief"
- Feature name + "feature page"
- Product announcement documents
```

### Key Information to Extract

From the Notion page, extract:

| Field | Purpose |
|-------|---------|
| **Feature Name** | Video title/headline |
| **Problem Statement** | What pain point does this solve? |
| **Solution** | How does StackOne solve it? |
| **Key Benefits** | 3-4 bullet points for the video |
| **Target Persona** | Developer, AI builder, DevOps, etc. |
| **Demo Flow** | CLI commands, API calls, or UI screenshots |
| **Links** | Loom videos, docs, related URLs to scrape |

---

## Step 2: Fetch Additional Context

### Scraping Linked Resources

For any URLs in the Notion brief:

1. **Loom Videos**: Extract the transcript or key moments
2. **Documentation Pages**: Pull relevant code examples
3. **Blog Posts**: Extract key messaging and benefits
4. **Landing Pages**: Understand positioning and CTAs

Use WebFetch to scrape content:
```
WebFetch URL with prompt to extract:
- Main value proposition
- Code examples
- Key technical details
- Call-to-action messaging
```

### Processing Loom Videos

If a Loom link is provided:
- Extract the transcript (if available)
- Note key demo moments for recreation
- Identify the narrative flow

---

## Step 3: StackOne Messaging Guidelines

### Core Messaging Framework

**Industry Pain Point:**
> The world isn't built for AI agents to perform actions accurately, reliably, or securely. As a result, AI Agents often get stuck in POC Hell.

**StackOne Core Promise:**
> We provide the infrastructure that helps developers equip their AI agents with production-ready actions for any app.

**How We Do It:**
> We provide AI builder tools to create integrations for agents in minutes and the infrastructure for accurate, reliable, and secure AI execution in production.

**The Four Pillars (Proof Points):**
1. **Coverage** - Broad integration support across apps
2. **Runtime Performance** - Fast, reliable execution
3. **Security & Compliance** - Enterprise-grade security
4. **Builder Experience** - Developer-first tooling

### Voice & Tone for Technical Users

| Do | Don't |
|----|-------|
| Be direct and specific | Use marketing fluff |
| Show real code examples | Abstract hand-wavy benefits |
| Highlight technical capabilities | Oversimplify for non-technical users |
| Use developer terminology | Dumb down the language |
| Focus on time savings | Make vague productivity claims |
| Show the CLI/API in action | Just talk about features |

### Messaging Patterns to Use

```
Pattern: Problem → Solution → Proof

Example:
"Building integrations takes weeks" (Problem)
→ "StackOne CLI generates them in minutes" (Solution)
→ [Show CLI demo generating an integration] (Proof)
```

```
Pattern: Before/After

Example:
"Before: 50+ API docs to read"
→ "After: One unified API"
→ [Show code comparison]
```

---

## Step 4: Build with Remotion

### Project Structure

```
stackone-[feature]-video/
├── src/
│   ├── index.ts           # Entry point
│   ├── Root.tsx           # Composition definitions
│   ├── [Feature]Video.tsx # Main video component
│   ├── components/        # Reusable components
│   │   ├── Terminal.tsx
│   │   ├── AnimatedBackground.tsx
│   │   ├── GradientText.tsx
│   │   └── Badge.tsx
│   └── scenes/            # Video scenes
│       ├── IntroScene.tsx
│       ├── ProblemScene.tsx
│       ├── SolutionScene.tsx
│       └── CTAScene.tsx
├── package.json
└── tsconfig.json
```

### StackOne Brand Colors

```typescript
const COLORS = {
  // Primary
  primary: "#10B981",        // StackOne Green (logo, accents)
  primaryDark: "#059669",    // Darker green for hover/emphasis

  // Neutral / Dark
  black: "#0A0A0A",          // Primary black (buttons, headings)
  darkGray: "#111111",       // Alternative dark

  // Backgrounds
  bgDark: "#0A0A0B",         // Dark mode background (preferred)
  bgLight: "#FAFAFA",        // Light mode background
  bgCard: "#F5F5F5",         // Card backgrounds

  // Text
  text: "#FFFFFF",           // White text on dark
  textDark: "#0A0A0A",       // Dark text on light
  textMuted: "#71717A",      // Muted/secondary text
  textGray: "#A1A1AA",       // Gray text

  // Accents
  accent: "#22D3EE",         // Cyan accent (links, highlights)
  purple: "#8B5CF6",         // Purple accent
  blue: "#0061EF",           // Blue accent

  // Terminal / Code
  terminal: "#0D1117",       // Terminal background
  terminalBorder: "#30363D", // Terminal border

  // Status
  success: "#22C55E",        // Green success
  warning: "#FBBF24",        // Yellow warning
  error: "#EF4444",          // Red error
};
```

### Typography

```typescript
const TYPOGRAPHY = {
  heading: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },
  body: {
    fontFamily: "Inter, system-ui, sans-serif",
    fontWeight: 500,
  },
  mono: {
    fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
  },
};
```

### Essential Components

#### Animated Background

```tsx
const AnimatedBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 600], [0, 360]);

  return (
    <AbsoluteFill style={{ background: COLORS.bgDark }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "200%",
          height: "200%",
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          background: `conic-gradient(from 0deg, ${COLORS.primary}15, ${COLORS.accent}15, ${COLORS.purple}15, ${COLORS.primary}15)`,
          filter: "blur(120px)",
        }}
      />
    </AbsoluteFill>
  );
};
```

#### Terminal Component

```tsx
const Terminal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        background: COLORS.terminal,
        borderRadius: 12,
        border: `1px solid ${COLORS.terminalBorder}`,
        overflow: "hidden",
        boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.5)",
      }}
    >
      {/* Traffic lights */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          borderBottom: `1px solid ${COLORS.terminalBorder}`,
          background: "rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
};
```

#### Gradient Text

```tsx
const GradientText: React.FC<{ children: React.ReactNode; fontSize?: number }> = ({
  children,
  fontSize = 64,
}) => {
  return (
    <div
      style={{
        fontSize,
        fontWeight: 800,
        fontFamily: "Inter, system-ui, sans-serif",
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </div>
  );
};
```

#### Tool Badge

```tsx
const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span
      style={{
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Inter, system-ui, sans-serif",
        color: COLORS.accent,
        background: "rgba(34, 211, 238, 0.1)",
        border: "1px solid rgba(34, 211, 238, 0.25)",
        padding: "6px 14px",
        borderRadius: 16,
      }}
    >
      {children}
    </span>
  );
};
```

### Video Scene Structure

A typical StackOne marketing video follows this structure:

```tsx
export const StackOneFeatureVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <AnimatedBackground />

      {/* Scene 1: Hook/Problem (0-3 seconds) */}
      <Sequence from={0} durationInFrames={90}>
        <ProblemScene />
      </Sequence>

      {/* Scene 2: Solution Introduction (3-6 seconds) */}
      <Sequence from={90} durationInFrames={90}>
        <SolutionIntroScene />
      </Sequence>

      {/* Scene 3: Demo/Proof (6-15 seconds) */}
      <Sequence from={180} durationInFrames={270}>
        <DemoScene />
      </Sequence>

      {/* Scene 4: Benefits/Features (15-18 seconds) */}
      <Sequence from={450} durationInFrames={90}>
        <BenefitsScene />
      </Sequence>

      {/* Scene 5: CTA (18-20 seconds) */}
      <Sequence from={540} durationInFrames={60}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
```

### Animation Patterns

#### Text Reveal with Spring

```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const opacity = spring({
  frame,
  fps,
  config: { damping: 200 },
});

const translateY = spring({
  frame,
  fps,
  config: { damping: 200 },
  from: 20,
  to: 0,
});
```

#### Typewriter Effect for CLI

```tsx
const TypewriterText: React.FC<{ text: string; startFrame: number }> = ({
  text,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const charsToShow = Math.floor(
    interpolate(frame - startFrame, [0, text.length * 2], [0, text.length], {
      extrapolateRight: "clamp",
    })
  );

  return (
    <span style={{ fontFamily: TYPOGRAPHY.mono.fontFamily }}>
      {text.slice(0, charsToShow)}
      <span style={{ opacity: frame % 30 < 15 ? 1 : 0 }}>▋</span>
    </span>
  );
};
```

---

## Step 5: Render and Deliver

### Composition Setup

```tsx
// Root.tsx
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Square format (Instagram, LinkedIn) */}
      <Composition
        id="FeatureVideo"
        component={FeatureVideo}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1080}
      />

      {/* Landscape format (YouTube, Twitter) */}
      <Composition
        id="FeatureVideo-Landscape"
        component={FeatureVideo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
```

### Package.json Scripts

```json
{
  "scripts": {
    "studio": "remotion studio src/index.ts",
    "render": "remotion render src/index.ts FeatureVideo out/feature.mp4",
    "render:landscape": "remotion render src/index.ts FeatureVideo-Landscape out/feature-landscape.mp4",
    "render:gif": "remotion render src/index.ts FeatureVideo out/feature.gif --image-format=png"
  }
}
```

### Delivery Checklist

- [ ] Square format (1080x1080) for LinkedIn/Instagram
- [ ] Landscape format (1920x1080) for YouTube/Twitter
- [ ] GIF version for embedding in docs/Notion
- [ ] Preview in Remotion Studio before final render

---

## Technical User Appeal Checklist

When reviewing the video, ensure it:

- [ ] Shows real code/CLI commands (not abstract illustrations)
- [ ] Demonstrates actual functionality (not promises)
- [ ] Uses technical terminology appropriately
- [ ] Has a fast pace (developers skim, don't linger)
- [ ] Includes specific metrics when available (e.g., "50+ integrations")
- [ ] Shows before/after comparisons
- [ ] Ends with a clear, actionable CTA

---

## Example: Creating a CLI Feature Video

Given a Notion brief for "StackOne CLI Generate Command":

1. **Search Notion**: Find the marketing brief for CLI Generate
2. **Extract key info**:
   - Problem: "Building integrations takes weeks of reading API docs"
   - Solution: "Generate type-safe integrations from the CLI in minutes"
   - Demo: `stackone generate --provider bamboohr --category hris`
3. **Design scenes**:
   - Hook: "Weeks of API docs?" with stack of documentation
   - Solution: "One command" with CLI appearing
   - Demo: Typewriter animation of the command, output appearing
   - Benefits: "Type-safe, Production-ready, Minutes not weeks"
   - CTA: "Try StackOne CLI" with terminal prompt
4. **Build in Remotion** using components above
5. **Render** square and landscape versions

---

## Reference Files

- Brand colors: `~/.agents/skills/remotion-best-practices/rules/stackone-brand.md`
- Remotion best practices: `~/.agents/skills/remotion-best-practices/SKILL.md`
- Example video: `/Users/guillaume/Documents/llm_contexts/product-marketing/stackone-cli-video/`

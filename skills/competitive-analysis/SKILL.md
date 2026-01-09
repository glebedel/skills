---
name: competitive-analysis
description: Create comprehensive competitive analysis for any StackOne competitor. Auto-triggers on "create competitive analysis for X" requests.
invoke: competitive-analysis
---

# Competitive Analysis Skill

Generate in-depth competitive analysis comparing StackOne against any competitor in the integration/iPaaS/AI tooling space.

## Auto-Trigger Conditions

Activate when:
- User says "create competitive analysis for X"
- User asks to "compare StackOne with X"
- User requests "competitor analysis" or "competitive breakdown" for a specific company
- User asks to "analyze X as a competitor"

## Sources

### StackOne Information
**Primary source**: https://docs.stackone.com

Key areas to fetch:
- Product documentation and capabilities
- API reference and integration patterns
- Security and compliance documentation
- Pricing and deployment options
- Use cases and examples

### Competitor Information
Research the competitor using:
1. **Official Documentation** - Their docs site, API references
2. **Product Pages** - Features, pricing, use cases
3. **GitHub** - Open source repos, activity, community
4. **Case Studies** - Customer success stories
5. **Online Reviews** - G2, Capterra, TrustRadius ratings
6. **News & Announcements** - Recent funding, acquisitions, partnerships
7. **Job Postings** - Hiring trends indicate strategic focus

## Workflow

### Step 1: Check Notion Competitor Database

Search the competitor database to see if the competitor already exists:
- Database data source: `collection://f49af32c-7c84-4352-a53f-d6d532cced0b`
- Search by company name

### Step 2: Add Competitor to Database (if needed)

If competitor doesn't exist, create a new entry with:

```json
{
  "parent": {"data_source_id": "f49af32c-7c84-4352-a53f-d6d532cced0b"},
  "pages": [{
    "properties": {
      "Name": "[Competitor Name]",
      "Website": "[Main URL]",
      "Documentation": "[Docs URL]",
      "Type": "[Comma-separated: AI, MCP, Tool Calling, Unified API, Workflow Automation, Embedded, OpenSource, etc.]",
      "Status Direct/Indirect/Dead etc.": "[Direct | Indirect / Never competing | Dead]"
    }
  }]
}
```

**Type Options**: Unified API, Workflow Automation, OpenSource, Embedded, field_mapping, AI, Reverse ETL, Tool Calling, RAG, MCP, Agent Builder, Action Permissioning

**Status Options**: Direct, Dead, Indirect / Never competing

### Step 3: Research Both Platforms

Gather information on:

**StackOne** (from docs.stackone.com):
- Core value proposition (Agentic Integration Gateway)
- 4 Pillars: Coverage, Runtime Performance, Security & Compliance, Builder Experience
- Key differentiators: Meta Tools, Falcon Engine, A2A Protocol, MCP support
- Target audience: AI agents and agentic workflows

**Competitor**:
- Core positioning and target market
- Technical architecture
- Integration coverage
- Pricing model
- Strengths and weaknesses
- Recent developments

### Step 4: Create Analysis Page

Create a child page under the competitor's database entry with the competitive analysis.

Use this structure:

```markdown
# [Competitor Name] vs StackOne - Competitive Analysis

## Executive Summary
[2-3 sentences on the competitive landscape and key takeaway]

## Strategic Positioning Comparison

| Aspect | StackOne | [Competitor] |
|--------|----------|--------------|
| Core Focus | Agentic Integration Gateway | [Their focus] |
| Target Audience | AI Agents & Developers | [Their audience] |
| Primary Use Case | Tool calling for AI | [Their use case] |

## Detailed Comparison by StackOne's 4 Pillars

### 1. Coverage
[Compare integration breadth, depth, unified models]

### 2. Runtime Performance
[Compare execution speed, reliability, scalability]

### 3. Security & Compliance
[Compare certifications, data handling, enterprise features]

### 4. Builder Experience
[Compare DX, documentation, SDKs, time-to-integration]

## Where StackOne Wins
[Bullet points of clear advantages]

## Where [Competitor] Wins
[Honest assessment of their strengths]

## Battlecard

### Quick Facts
- **Founded**: [Year]
- **Funding**: [Amount/Stage]
- **Employees**: [Estimate]
- **Key Customers**: [Notable logos]

### When to Position Against [Competitor]
[Scenarios where StackOne is the better choice]

### When [Competitor] Might Win
[Scenarios where they have an edge - be honest]

### Objection Handling

**"Why not [Competitor]?"**
[Response framework]

**"[Competitor] has X feature"**
[How to address specific feature comparisons]

## Architecture Comparison
[If relevant, compare technical approaches]

## Pricing Comparison
[Compare models if publicly available]

## Recent Developments
[News, funding, acquisitions, product launches]

---
*Analysis created: [Date]*
*Sources: [List key sources used]*
```

### Step 5: Update Competitor Database Entry

After creating the analysis, update the competitor's database entry:
- Add any discovered features to "(Advertised) Features"
- Add key differentiators to "Competitive Differentiators"
- Add relevant comments to "Comment"
- Update "Integration List" if found

## Quality Guidelines

1. **Be honest** - Acknowledge competitor strengths genuinely
2. **Be specific** - Use concrete features, numbers, examples
3. **Be current** - Note when information was gathered
4. **Be balanced** - Not a sales pitch, a strategic analysis
5. **Cite sources** - Link to documentation and reviews
6. **Apply /natural-writing rules** - Avoid LLM-isms in the output

## Output

The analysis should be:
- Created as a Notion page under the competitor's database entry
- Written in clear, direct language (follow /natural-writing skill)
- Actionable for sales and product teams
- Updated with a timestamp

## Example Usage

User: "Create competitive analysis for Composio"

1. Search Notion for "Composio" in competitor database
2. If not found, add Composio with basic info (website, docs, type: AI, Tool Calling, OpenSource)
3. Research Composio: docs.composio.dev, GitHub, G2 reviews
4. Fetch StackOne info from docs.stackone.com
5. Create analysis page as child of Composio entry
6. Update Composio entry with discovered features and differentiators

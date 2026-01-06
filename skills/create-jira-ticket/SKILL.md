---
name: create-jira-ticket
description: Create well-researched, implementation-ready Jira tickets. Supports extraction from Fireflies calls, Slack threads, and competitor research.
invoke: create-ticket
---

# Create Jira Ticket Skill

Create well-researched, implementation-ready Jira tickets for engineering work.

## Trigger

User mentions: "create a ticket", "create an issue", "create a work item", "new ticket", "new issue", "new story", "new epic", "new task"

Also triggered when user provides a Fireflies call recording link or asks to search for a call to create a ticket from.

## Workflow

### 1. Gather Requirements (Interactive)

Ask the user:
1. **What problem are we solving?** (pain point, user need, or technical gap)
2. **Who is this for?** (end-user persona, internal team, or customer)
3. **Ticket type preference?** (Epic for large initiatives, Story for features, Task for technical work)
4. **Any urgency or sprint preference?** (current sprint, next sprint, backlog)

If the user provides a Slack thread, meeting notes, Fireflies call link, or description - extract the key information instead of asking.

### 2. Research Phase

#### 2.1 Call Transcripts (When Provided)

If the user provides a call link or asks to search for a relevant call:

1. **Direct link provided**: Fetch full transcript and AI-generated summary
2. **Search for a call**: Search by participant names, keywords, or date range
3. **Extract from transcript**:
   - Problem statements and pain points discussed
   - Feature requests or requirements mentioned
   - User personas or stakeholders identified
   - Technical constraints or considerations
   - Action items and decisions made
   - Quotes that capture user needs

Include a link to the call in the ticket's Links section.

#### 2.2 Context Gathering

Read relevant context from local documentation folders for architecture, vision, roadmap, and existing analysis.

#### 2.3 Competition Research

For feature tickets, research how competitors handle similar functionality using web search.

#### 2.4 Codebase Research (When Needed)

If the ticket requires understanding current implementation, check existing repositories or clone fresh to understand the current state.

#### 2.5 Documentation Check

Always check for:
- Existing documentation that needs updating
- New documentation pages that should be created

### 3. Determine Component & Squad

Based on the ticket scope, assign to the appropriate team/component.

### 4. Find or Create Parent Epic

Search for relevant existing epics. If no relevant epic exists, create one first with clear scope definition and success criteria.

### 5. Create Feature Page (If Needed)

For Stories or Epics, create a feature page with:
- Problem statement
- Solution overview
- User Value
- Technical Approach

Link the feature page in the Jira ticket description.

### 6. Write the Ticket

#### Ticket Structure

```markdown
## Problem
[1-2 sentences: What pain point or gap exists?]

## User Value
[1-2 sentences: Why does this matter to users/customers?]

## Solution Overview
[Brief description of the proposed approach]

## User Stories
- As a [persona], I want [capability] so that [benefit]

## Acceptance Criteria
- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]
- [ ] [Include edge cases]

## Technical Approach (Optional - for guidance, not prescription)
[High-level implementation ideas - let implementer decide details]
- Potential approach 1: [brief description]
- Potential approach 2: [brief description]
- Key files/areas likely affected: [list]

## Competition Reference
[How do competitors handle this? Brief comparison]

## Out of Scope (v0)
[Explicitly list what we're NOT building to avoid scope creep]
- [Feature/enhancement for later]
- [Nice-to-have deferred]

## Documentation
- [ ] Update: [link to existing doc if needs update]
- [ ] Create: [new doc page needed]

## Links
- Feature Page: [link]
- Related tickets: [links]
- Slack thread: [link if applicable]
- Call recording: [link if applicable]
```

#### Writing Guidelines

1. **Be concise but exhaustive on edge cases** - Cover the edges, not the boilerplate
2. **Prioritize v0** - Build minimum viable, iterate later
3. **Clear scope boundaries** - Explicit "Out of Scope" section
4. **AI-implementable** - Written so a coding agent could implement it
5. **No time estimates** - Focus on what, not when
6. **User stories format** - When describing features
7. **Testable UACs** - Every criterion should be verifiable

### 7. Create the Jira Ticket

Use the Jira API to create the ticket with:
- Project key
- Issue type (Epic, Story, or Task)
- Summary (clear, concise title)
- Description (full ticket content in markdown)
- Components
- Parent epic (for Stories/Tasks)
- Labels

### 8. Post-Creation

After creating the ticket:
1. Return the ticket URL to the user
2. If documentation tasks identified, offer to create linked doc tickets
3. Ask if user wants to refine anything

## Example Invocations

**Basic:**
User: "Create a ticket for adding native GraphQL support"

**With call recording:**
User: "Create a ticket from this call: https://app.fireflies.ai/view/abc123"

**Search for call:**
User: "Create a ticket from the customer call we had last week about webhooks"

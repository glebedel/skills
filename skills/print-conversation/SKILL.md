---
name: print-conversation
description: Export Claude Code conversations to terminal-styled PDF or HTML. Supports filtering by last N exchanges, topic search, and theme options.
invoke: print
---

# Print Conversation Skill

Export this conversation to a terminal-styled PDF.

## Automatic Execution

When invoked, immediately:

1. **Find the conversation file**:
   ```bash
   # Encode current working directory (replace / with -, remove leading -)
   ls -lt ~/.claude/projects/{encoded-cwd}/*.jsonl | head -1
   ```

2. **If no arguments provided**, ask user to choose:
   - Full conversation
   - Last N exchanges (suggest 10, 20, 50)
   - From a specific topic (scan and propose 3-5 key moments)

3. **Run the export**:
   ```bash
   node ~/.claude/scripts/export-conversation.js <file> [options]
   ```

4. **Report the output location** and offer to open it

## Arguments

Pass these directly after `/print`:
- `last 10` - Export last 10 exchanges
- `from "topic"` - Start from message containing "topic"
- `light` - Use light theme
- `html` - Output HTML instead of PDF
- `full` - Export everything (no prompts)

Examples:
- `/print` - Interactive mode
- `/print last 20` - Last 20 exchanges
- `/print from "logo creator"` - From specific topic
- `/print full light` - Full conversation, light theme

## Script Options Reference

```
--output <path>       Output path (default: ~/Desktop/claude-conversation-{timestamp}.pdf)
--html-only           Output HTML instead of PDF
--light-theme         Light background
--include-thinking    Show thinking blocks
--include-tools       Show full tool inputs
--from "<text>"       Start from message containing text
--last <n>            Only last n exchanges
```

## Output Format

Terminal-styled with:
- Dark background (#1e1e1e) / Light option available
- Green `>` prompt prefix
- Blue user text
- Gray assistant responses
- Muted italic tool uses
- Monospace font throughout

## Setup Requirements

The skill requires a Node.js script at `~/.claude/scripts/export-conversation.js` with puppeteer installed:

```bash
cd ~/.claude/scripts
npm install puppeteer
```

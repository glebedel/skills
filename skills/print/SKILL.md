# Print Skill

Export Claude Code conversations to terminal-styled PNG, SVG, PDF, or HTML.

## Trigger

Activate this skill when the user wants to:
- Export or print the current conversation
- Save the conversation as an image
- Create a screenshot of the conversation
- Share the conversation visually

## Usage

```
/print [arguments]
```

## Arguments

- `last N` - Export last N exchanges
- `from "topic"` - Start from message containing "topic"
- `until "topic"` - Stop before message containing "topic"
- `light` - Use light theme
- `png` / `svg` / `pdf` / `html` - Output format (default: png)
- `full` - Export everything without prompts

## Examples

- `/print` - Interactive mode (asks what to export)
- `/print last 20` - Last 20 exchanges as PNG
- `/print from "logo creator"` - From specific topic
- `/print until "debugging"` - Exclude debugging discussion
- `/print full light pdf` - Full conversation, light theme, PDF format
- `/print svg` - Export as SVG

## Automatic Execution

When invoked:

1. **Find the conversation file**:
   ```bash
   # Encode current working directory (replace / with -, remove leading -)
   ls -lt ~/.claude/projects/{encoded-cwd}/*.jsonl | head -1
   ```

2. **If no arguments provided**, ask user to choose:
   - Full conversation
   - Last N exchanges (suggest 10, 20, 50)
   - From a specific topic (scan and propose 3-5 key moments)
   - Until a specific topic (exclude messages after)

3. **Run the export**:
   ```bash
   node ~/.claude/skills/print/scripts/export-conversation.js <file> [options]
   ```

4. **Report the output location** and offer to open it

## Script Options Reference

```
--output <path>       Output path (default: ~/Desktop/claude-conversation-{timestamp}.png)
--format <type>       Output format: png (default), svg, pdf, html
--width <pixels>      Page width (default: 1200)
--scale <factor>      PNG scale factor for high-DPI (default: 2)
--light-theme         Light background
--include-thinking    Show thinking blocks
--include-tools       Show full tool inputs
--from "<text>"       Start from message containing text
--until "<text>"      Stop before message containing text
--last <n>            Only last n exchanges
```

## Output Format

Terminal-styled with:
- GitHub dark background (#0d1117) / Light option available
- Green `❯` prompt prefix for user messages
- Blue user text (#58a6ff)
- White assistant responses (#e6edf3)
- Muted gray tool uses (#7d8590)
- JetBrains Mono monospace font
- Proper syntax highlighting for code blocks
- Accurate line height matching terminal output

## Requirements

- Node.js
- Puppeteer (`npm install puppeteer`)

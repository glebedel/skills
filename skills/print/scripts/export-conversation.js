#!/usr/bin/env node

/**
 * Claude Conversation Exporter
 * Converts conversation JSONL to terminal-styled PNG/SVG
 *
 * Usage: node export-conversation.js <jsonl-file> [options]
 * Options:
 *   --output <path>     Output path (default: ~/Desktop/claude-conversation-{timestamp}.png)
 *   --format <fmt>      Output format: png, svg, pdf, html (default: png)
 *   --include-thinking  Include assistant thinking blocks
 *   --include-tools     Show full tool inputs
 *   --light-theme       Use light theme instead of dark
 *   --from <text>       Start from message containing text
 *   --until <text>      Stop before message containing text
 *   --last <n>          Only include last n message pairs
 *   --width <px>        Image width in pixels (default: 1200)
 *   --scale <n>         Pixel scale factor for PNG (default: 2)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Parse arguments
const args = process.argv.slice(2);
const options = {
  input: null,
  output: null,
  format: 'png',
  includeThinking: false,
  includeTools: false,
  lightTheme: false,
  fromText: null,
  untilText: null,
  lastN: null,
  width: 1200,
  scale: 2,
};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--output' && args[i + 1]) {
    options.output = args[++i];
  } else if (arg === '--format' && args[i + 1]) {
    options.format = args[++i];
  } else if (arg === '--include-thinking') {
    options.includeThinking = true;
  } else if (arg === '--include-tools') {
    options.includeTools = true;
  } else if (arg === '--light-theme') {
    options.lightTheme = true;
  } else if (arg === '--from' && args[i + 1]) {
    options.fromText = args[++i];
  } else if (arg === '--until' && args[i + 1]) {
    options.untilText = args[++i];
  } else if (arg === '--last' && args[i + 1]) {
    options.lastN = parseInt(args[++i], 10);
  } else if (arg === '--width' && args[i + 1]) {
    options.width = parseInt(args[++i], 10);
  } else if (arg === '--scale' && args[i + 1]) {
    options.scale = parseFloat(args[++i]);
  } else if (!arg.startsWith('--')) {
    options.input = arg;
  }
}

if (!options.input) {
  console.error('Usage: node export-conversation.js <jsonl-file> [options]');
  console.error('Options:');
  console.error('  --output <path>     Output path');
  console.error('  --format <fmt>      png, svg, pdf, html (default: png)');
  console.error('  --include-thinking  Include thinking blocks');
  console.error('  --include-tools     Show full tool inputs');
  console.error('  --light-theme       Use light theme');
  console.error('  --from <text>       Start from message containing text');
  console.error('  --until <text>      Stop before message containing text');
  console.error('  --last <n>          Only last n exchanges');
  console.error('  --width <px>        Image width (default: 1200)');
  console.error('  --scale <n>         PNG scale factor (default: 2)');
  process.exit(1);
}

// Default output path
if (!options.output) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  options.output = path.join(os.homedir(), 'Desktop', `claude-conversation-${timestamp}.${options.format}`);
}

// Terminal color themes - matching Claude Code's actual terminal output
const darkTheme = {
  bg: '#0d1117',           // GitHub dark background
  text: '#e6edf3',         // Primary text
  textMuted: '#7d8590',    // Muted text
  userPrompt: '#3fb950',   // Green prompt symbol
  userText: '#58a6ff',     // Blue user input
  assistantText: '#e6edf3', // White assistant text
  codeBg: '#161b22',       // Code block background
  codeBorder: '#30363d',   // Code block border
  codeText: '#e6edf3',     // Code text
  toolText: '#7d8590',     // Tool calls (muted)
  thinkingBg: '#1c2128',   // Thinking block background
  headerText: '#f0883e',   // Orange headers
  linkText: '#58a6ff',     // Links
  bold: '#ffffff',         // Bold text
  italic: '#e6edf3',       // Italic text
  inlineCode: '#ff7b72',   // Inline code
  inlineCodeBg: '#343942', // Inline code background
};

const lightTheme = {
  bg: '#ffffff',
  text: '#1f2328',
  textMuted: '#656d76',
  userPrompt: '#1a7f37',
  userText: '#0969da',
  assistantText: '#1f2328',
  codeBg: '#f6f8fa',
  codeBorder: '#d0d7de',
  codeText: '#1f2328',
  toolText: '#656d76',
  thinkingBg: '#f6f8fa',
  headerText: '#953800',
  linkText: '#0969da',
  bold: '#000000',
  italic: '#1f2328',
  inlineCode: '#cf222e',
  inlineCodeBg: '#eff1f3',
};

// Parse JSONL file
function parseConversation(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const messages = [];

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'user' || entry.type === 'assistant') {
        messages.push(entry);
      }
    } catch (e) {
      // Skip malformed lines
    }
  }

  return messages;
}

// Extract text content from message
function extractTextContent(msg) {
  if (msg.type === 'user') {
    const content = msg.message?.content;
    if (typeof content === 'string') {
      return content;
    }
    if (Array.isArray(content)) {
      return content
        .filter(c => c.type === 'text')
        .map(c => c.text || '')
        .join('\n');
    }
    return '';
  }
  if (msg.type === 'assistant') {
    const content = msg.message?.content;
    if (Array.isArray(content)) {
      return content
        .filter(c => c.type === 'text')
        .map(c => c.text || '')
        .join('\n');
    }
    if (typeof content === 'string') {
      return content;
    }
  }
  return '';
}

// Filter messages based on options
function filterMessages(messages) {
  let filtered = messages;

  if (options.fromText) {
    const searchLower = options.fromText.toLowerCase();
    const startIndex = filtered.findIndex(msg => {
      const content = extractTextContent(msg);
      return content.toLowerCase().includes(searchLower);
    });
    if (startIndex >= 0) {
      filtered = filtered.slice(startIndex);
    }
  }

  if (options.untilText) {
    const searchLower = options.untilText.toLowerCase();
    const endIndex = filtered.findIndex(msg => {
      const content = extractTextContent(msg);
      return content.toLowerCase().includes(searchLower);
    });
    if (endIndex >= 0) {
      filtered = filtered.slice(0, endIndex);
    }
  }

  if (options.lastN) {
    let exchanges = 0;
    let cutIndex = filtered.length;
    for (let i = filtered.length - 1; i >= 0; i--) {
      if (filtered[i].type === 'user') {
        exchanges++;
        if (exchanges >= options.lastN) {
          cutIndex = i;
          break;
        }
      }
    }
    filtered = filtered.slice(cutIndex);
  }

  return filtered;
}

// Escape HTML
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Convert markdown to HTML with terminal styling
function markdownToHtml(text, theme) {
  let html = escapeHtml(text);

  // Code blocks with syntax highlighting appearance
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<div class="code-block"><div class="code-header">${lang || 'code'}</div><pre><code>${code.trim()}</code></pre></div>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="inline">$1</code>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Lists
  html = html.replace(/^- (.+)$/gm, '<div class="list-item">• $1</div>');
  html = html.replace(/^\d+\. (.+)$/gm, '<div class="list-item">$1</div>');

  // Line breaks (preserve spacing)
  html = html.replace(/\n/g, '<br>\n');

  return html;
}

// Render single message
function renderMessage(msg, theme) {
  if (msg.type === 'user') {
    const rawContent = msg.message?.content;
    let content;
    if (typeof rawContent === 'string') {
      content = escapeHtml(rawContent);
    } else if (Array.isArray(rawContent)) {
      content = escapeHtml(rawContent
        .filter(c => c.type === 'text')
        .map(c => c.text || '')
        .join('\n'));
    } else {
      content = '';
    }

    // Split into lines and add prompt to first line
    const lines = content.split('\n');
    const formattedContent = lines.map((line, i) => {
      if (i === 0) {
        return `<span class="prompt">❯</span> ${line}`;
      }
      return `<span class="prompt-space">  </span>${line}`;
    }).join('<br>\n');

    return `<div class="message user-message"><div class="user-content">${formattedContent}</div></div>`;
  }

  if (msg.type === 'assistant') {
    const parts = [];
    const content = msg.message?.content;

    if (Array.isArray(content)) {
      for (const block of content) {
        if (block.type === 'thinking' && options.includeThinking) {
          parts.push(`<div class="thinking"><div class="thinking-label">Thinking...</div>${escapeHtml(block.thinking)}</div>`);
        } else if (block.type === 'text') {
          parts.push(`<div class="assistant-text">${markdownToHtml(block.text, theme)}</div>`);
        } else if (block.type === 'tool_use') {
          if (options.includeTools) {
            parts.push(`<div class="tool-use"><span class="tool-icon">⚡</span> <span class="tool-name">${block.name}</span><pre class="tool-input">${escapeHtml(JSON.stringify(block.input, null, 2))}</pre></div>`);
          } else {
            parts.push(`<div class="tool-use"><span class="tool-icon">⚡</span> Used <span class="tool-name">${block.name}</span></div>`);
          }
        }
      }
    }

    return `<div class="message assistant-message">${parts.join('\n')}</div>`;
  }

  return '';
}

// Generate HTML that looks like terminal
function generateHtml(messages) {
  const theme = options.lightTheme ? lightTheme : darkTheme;
  const messagesHtml = messages.map(msg => renderMessage(msg, theme)).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Claude Conversation</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      background: ${theme.bg};
      color: ${theme.text};
      font-family: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 13px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    body {
      padding: 24px 32px;
      min-height: 100vh;
    }

    .conversation {
      max-width: 100%;
    }

    .message {
      margin-bottom: 24px;
    }

    /* User message styling */
    .user-message {
      margin-bottom: 16px;
    }

    .user-content {
      color: ${theme.userText};
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .prompt {
      color: ${theme.userPrompt};
      font-weight: 600;
      margin-right: 8px;
    }

    .prompt-space {
      display: inline-block;
      width: 20px;
    }

    /* Assistant message styling */
    .assistant-message {
      padding-left: 0;
    }

    .assistant-text {
      color: ${theme.assistantText};
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    /* Headers */
    h1, h2, h3 {
      color: ${theme.headerText};
      font-weight: 600;
      margin: 16px 0 8px 0;
    }

    h1 { font-size: 1.4em; }
    h2 { font-size: 1.2em; }
    h3 { font-size: 1.1em; }

    /* Code blocks */
    .code-block {
      background: ${theme.codeBg};
      border: 1px solid ${theme.codeBorder};
      border-radius: 6px;
      margin: 12px 0;
      overflow: hidden;
    }

    .code-header {
      background: ${theme.codeBorder};
      color: ${theme.textMuted};
      padding: 6px 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .code-block pre {
      margin: 0;
      padding: 12px 16px;
      overflow-x: auto;
    }

    .code-block code {
      color: ${theme.codeText};
      font-size: 12px;
      line-height: 1.5;
    }

    /* Inline code */
    code.inline {
      background: ${theme.inlineCodeBg};
      color: ${theme.inlineCode};
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
    }

    /* Tool usage */
    .tool-use {
      color: ${theme.toolText};
      font-size: 12px;
      padding: 8px 0;
      border-left: 2px solid ${theme.codeBorder};
      padding-left: 12px;
      margin: 8px 0;
    }

    .tool-icon {
      color: ${theme.userPrompt};
    }

    .tool-name {
      color: ${theme.linkText};
      font-weight: 500;
    }

    .tool-input {
      margin-top: 8px;
      padding: 8px;
      background: ${theme.codeBg};
      border-radius: 4px;
      font-size: 11px;
      overflow-x: auto;
    }

    /* Thinking blocks */
    .thinking {
      background: ${theme.thinkingBg};
      border-radius: 6px;
      padding: 12px 16px;
      margin: 12px 0;
      font-size: 12px;
      color: ${theme.textMuted};
    }

    .thinking-label {
      color: ${theme.textMuted};
      font-size: 11px;
      margin-bottom: 8px;
      font-style: italic;
    }

    /* Lists */
    .list-item {
      padding-left: 16px;
      margin: 4px 0;
    }

    /* Typography */
    strong {
      color: ${theme.bold};
      font-weight: 600;
    }

    em {
      font-style: italic;
    }

    /* Horizontal rule */
    hr {
      border: none;
      border-top: 1px solid ${theme.codeBorder};
      margin: 24px 0;
    }
  </style>
</head>
<body>
  <div class="conversation">
    ${messagesHtml}
  </div>
</body>
</html>`;
}

// Main function
async function main() {
  console.log('Reading conversation...');
  const messages = parseConversation(options.input);
  console.log(`Found ${messages.length} messages`);

  const filtered = filterMessages(messages);
  console.log(`Exporting ${filtered.length} messages`);

  const html = generateHtml(filtered);

  // HTML-only output
  if (options.format === 'html') {
    fs.writeFileSync(options.output, html);
    console.log(`HTML saved to: ${options.output}`);
    return;
  }

  // Use Puppeteer for PNG/SVG/PDF
  const tempHtml = options.output.replace(/\.(png|svg|pdf)$/, '.tmp.html');
  fs.writeFileSync(tempHtml, html);

  try {
    const puppeteer = require('puppeteer');
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: options.width,
      height: 800,
      deviceScaleFactor: options.scale,
    });

    await page.goto(`file://${path.resolve(tempHtml)}`, { waitUntil: 'networkidle0' });

    // Wait for fonts to load
    await page.evaluate(() => document.fonts.ready);

    if (options.format === 'png') {
      console.log('Generating PNG...');
      await page.screenshot({
        path: options.output,
        fullPage: true,
        type: 'png',
      });
      console.log(`PNG saved to: ${options.output}`);
    } else if (options.format === 'svg') {
      console.log('Generating SVG...');
      // Get page dimensions
      const dimensions = await page.evaluate(() => {
        const body = document.body;
        return {
          width: body.scrollWidth,
          height: body.scrollHeight,
        };
      });

      // Take screenshot as base64 PNG and embed in SVG
      const screenshot = await page.screenshot({
        fullPage: true,
        type: 'png',
        encoding: 'base64',
      });

      const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${dimensions.width * options.scale}" height="${dimensions.height * options.scale}"
     viewBox="0 0 ${dimensions.width * options.scale} ${dimensions.height * options.scale}">
  <image width="100%" height="100%" xlink:href="data:image/png;base64,${screenshot}"/>
</svg>`;

      fs.writeFileSync(options.output, svg);
      console.log(`SVG saved to: ${options.output}`);
    } else if (options.format === 'pdf') {
      console.log('Generating PDF...');
      await page.pdf({
        path: options.output,
        format: 'A4',
        printBackground: true,
        margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' },
      });
      console.log(`PDF saved to: ${options.output}`);
    }

    await browser.close();
  } catch (e) {
    console.error('Export failed:', e.message);
    if (e.message.includes('Cannot find module')) {
      console.log('Install puppeteer: npm install -g puppeteer');
    }
    console.log(`HTML saved to: ${tempHtml}`);
    process.exit(1);
  } finally {
    if (fs.existsSync(tempHtml)) {
      fs.unlinkSync(tempHtml);
    }
  }
}

main().catch(console.error);

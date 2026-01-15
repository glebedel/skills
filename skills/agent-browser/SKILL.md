# agent-browser: AI-Optimized Browser Automation

Use this skill when performing browser automation tasks, especially when:
- The user explicitly requests agent-browser
- Parallel browser sessions are needed (multiple isolated contexts)
- Lightweight Chromium is required (serverless, CI/CD)
- Origin-scoped authentication is needed
- Playwright MCP or Chrome DevTools MCP are unavailable or causing issues

## When to Prefer agent-browser Over Other Tools

| Use Case | Recommended Tool |
|----------|-----------------|
| Quick single-page interaction | Chrome DevTools MCP |
| Complex multi-step workflows | agent-browser |
| Parallel browser sessions | agent-browser |
| Recording GIFs | Chrome DevTools MCP |
| CI/CD / serverless automation | agent-browser |
| Debugging existing Chrome tabs | Chrome DevTools MCP |
| Web scraping at scale | agent-browser |

## Installation (Run Once)

```bash
# Install globally
npm install -g agent-browser

# Download Chromium (required)
agent-browser install

# Linux only: install system dependencies
agent-browser install --with-deps
```

## Core Workflow (AI-Optimized)

The optimal pattern for AI agents uses snapshot-based refs:

### Step 1: Navigate and Snapshot
```bash
# Open URL and get interactive elements
agent-browser open "https://example.com"
agent-browser snapshot -i --json
```

### Step 2: Parse the Snapshot
The snapshot returns an accessibility tree with refs like `@e1`, `@e2`. These refs are deterministic and don't require DOM re-queries.

### Step 3: Interact Using Refs
```bash
# Click an element by ref
agent-browser click @e5

# Fill a text field by ref
agent-browser fill @e3 "user@example.com"

# Type with keyboard events (for autocomplete, etc.)
agent-browser type @e3 "search query"
```

### Step 4: Re-snapshot After Page Changes
After any action that modifies the page (navigation, form submission, AJAX), take a new snapshot:
```bash
agent-browser snapshot -i --json
```

## Essential Commands Reference

### Navigation
```bash
agent-browser open "https://site.com"      # Open URL
agent-browser goto "https://other.com"     # Navigate
agent-browser back                          # Go back
agent-browser forward                       # Go forward
agent-browser reload                        # Refresh
```

### Snapshots (Always Use for AI Workflows)
```bash
agent-browser snapshot --json              # Full accessibility tree
agent-browser snapshot -i --json           # Interactive elements only (recommended)
agent-browser snapshot -i -c --json        # Compact mode (removes empty containers)
agent-browser snapshot -i -d 3 --json      # Limit depth
agent-browser snapshot -i -s "form" --json # Scope to selector
```

### Element Interaction
```bash
# By ref (recommended for AI)
agent-browser click @e1
agent-browser dblclick @e1
agent-browser fill @e2 "text"
agent-browser type @e2 "text"              # Character-by-character
agent-browser press @e2 "Enter"
agent-browser hover @e3
agent-browser focus @e4
agent-browser scroll @e5 down 300

# By semantic locator (alternative)
agent-browser find role button click --name "Submit"
agent-browser find label "Email" fill "test@example.com"
agent-browser find placeholder "Search" type "query"
```

### Form Operations
```bash
agent-browser select @e1 "Option Value"    # Dropdown
agent-browser check @e2                     # Checkbox on
agent-browser uncheck @e2                   # Checkbox off
agent-browser upload @e3 "/path/to/file"   # File input
```

### Get Information
```bash
agent-browser get text @e1 --json          # Element text
agent-browser get html @e1 --json          # Element HTML
agent-browser get value @e1 --json         # Input value
agent-browser get title --json             # Page title
agent-browser get url --json               # Current URL
agent-browser get attr @e1 href --json     # Attribute value
```

### Wait Operations
```bash
agent-browser wait visible @e1             # Wait for element
agent-browser wait 2000                    # Wait milliseconds
agent-browser wait text "Success"          # Wait for text
agent-browser wait url "**/dashboard"      # Wait for URL pattern
agent-browser wait load networkidle        # Wait for network idle
```

### Screenshots & PDFs
```bash
agent-browser screenshot output.png        # Visible viewport
agent-browser screenshot output.png --full # Full page
agent-browser pdf output.pdf               # Export as PDF
```

## Session Management (Parallel Browsers)

Run multiple isolated browser instances:

```bash
# Session 1: Admin user
agent-browser --session admin open "https://app.com/login"
agent-browser --session admin fill @e1 "admin@example.com"
agent-browser --session admin fill @e2 "password"
agent-browser --session admin click @e3

# Session 2: Regular user (completely isolated)
agent-browser --session user open "https://app.com/login"
agent-browser --session user fill @e1 "user@example.com"
```

Each session has its own cookies, localStorage, and authentication state.

## Authentication

### Method 1: Origin-Scoped Headers (Recommended)
```bash
# Headers only sent to matching origins
agent-browser set headers "Authorization: Bearer TOKEN" --origin "https://api.example.com"
agent-browser open "https://app.example.com"
```

### Method 2: Save/Load Auth State
```bash
# After manual login, save state
agent-browser state save auth-state.json

# Later, restore authentication
agent-browser state load auth-state.json
agent-browser open "https://app.example.com/dashboard"
```

### Method 3: Cookie Injection
```bash
agent-browser cookie set "session_id=abc123; domain=.example.com; path=/"
```

## Network Operations

```bash
# Block requests (ads, tracking, etc.)
agent-browser network block "*.google-analytics.com/*"
agent-browser network block "*.doubleclick.net/*"

# Mock API responses
agent-browser network mock "https://api.example.com/user" '{"name": "Test"}'

# Intercept and log requests
agent-browser network intercept "https://api.example.com/*"
agent-browser network requests --json  # View intercepted
```

## Tab Management

```bash
agent-browser tab new "https://example.com"  # Open new tab
agent-browser tab list --json                 # List all tabs
agent-browser tab switch 1                    # Switch to tab index
agent-browser tab close 2                     # Close tab index
```

## Browser Configuration

```bash
# Viewport
agent-browser set viewport 1920 1080

# Device emulation
agent-browser set device "iPhone 14"

# Geolocation
agent-browser set geolocation 37.7749 -122.4194

# Dark mode
agent-browser set colorscheme dark

# Offline mode
agent-browser set offline true
```

## Debugging

```bash
# View console messages
agent-browser console --json

# View page errors
agent-browser errors --json

# Enable tracing
agent-browser trace start
# ... perform actions ...
agent-browser trace stop trace.zip

# Execute JavaScript
agent-browser eval "document.title"
agent-browser eval "window.scrollTo(0, document.body.scrollHeight)"
```

## Common Patterns

### Login Flow
```bash
agent-browser open "https://app.com/login"
agent-browser snapshot -i --json
# Parse refs from output
agent-browser fill @e1 "username"
agent-browser fill @e2 "password"
agent-browser click @e3  # Submit button
agent-browser wait url "**/dashboard"
agent-browser snapshot -i --json
```

### Form Submission with Validation
```bash
agent-browser open "https://app.com/form"
agent-browser snapshot -i --json
agent-browser fill @e1 "John Doe"
agent-browser fill @e2 "john@example.com"
agent-browser select @e3 "United States"
agent-browser check @e4  # Terms checkbox
agent-browser click @e5  # Submit
agent-browser wait text "Success"
agent-browser get text "body" --json  # Verify result
```

### Web Scraping
```bash
agent-browser open "https://example.com/products"
agent-browser wait load networkidle
agent-browser snapshot --json  # Get all elements
agent-browser eval "JSON.stringify([...document.querySelectorAll('.product')].map(p => ({name: p.querySelector('.name').textContent, price: p.querySelector('.price').textContent})))"
```

### Multi-Page Workflow
```bash
# Tab 1: Main application
agent-browser tab new "https://app.com"
# Tab 2: Admin panel
agent-browser tab new "https://admin.app.com"

# Switch and interact
agent-browser tab switch 0
agent-browser snapshot -i --json
# ... interact with app ...

agent-browser tab switch 1
agent-browser snapshot -i --json
# ... interact with admin ...
```

## Error Handling

If commands fail:
1. Re-take snapshot (`agent-browser snapshot -i --json`) - page may have changed
2. Check if element exists with `agent-browser is visible @eX`
3. Add waits for dynamic content (`agent-browser wait visible @eX`)
4. Use `--json` flag to get structured error information

## Environment Variables

```bash
AGENT_BROWSER_EXECUTABLE_PATH="/path/to/chromium"  # Custom browser
AGENT_BROWSER_HEADLESS="false"                      # Show browser window
AGENT_BROWSER_SLOWMO="100"                          # Slow down actions (ms)
```

## Tips for AI Agents

1. **Always use `--json` flag** - Enables structured parsing
2. **Prefer `-i` snapshot flag** - Reduces noise, shows only interactive elements
3. **Re-snapshot after page changes** - Refs become stale after navigation/AJAX
4. **Use sessions for parallel work** - Each session is completely isolated
5. **Chain commands efficiently** - Daemon persists, subsequent commands are fast
6. **Use semantic locators as fallback** - When refs are ambiguous, use `find role/label/placeholder`

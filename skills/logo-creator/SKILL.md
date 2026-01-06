---
name: logo-creator
description: Create SVG and PNG logos for tools/integrations. Supports filled, squared, and icon variants with proper coordinate conversion and brand color matching.
invoke: logo-creator
---

# Logo Creator Skill

Create SVG and PNG logos for tools/integrations in a consistent style.

## Logo Specifications

### Three Variants

| Variant | Dimensions | Background | Corners | Use Case |
|---------|------------|------------|---------|----------|
| `filled` | 24x24 | Yes, full-color | Rounded (`rx="8"`) | Primary display, UI components |
| `squared` | 24x24 | Yes, full-color | Sharp (no `rx`) | Alternative display, compact UI |
| `icon` | 16x16 | No | N/A | Small icons, favicons, minimal UI |

### File Naming Convention
```
{provider}-{variant}.{format}
```

**Provider naming rules:**
- All lowercase
- Hyphens for spaces/separators
- Examples: `google-sheets`, `salesforce`, `slack`, `microsoft-teams`

**Output files per tool (6 files):**
```
zapier-filled.svg
zapier-filled.png
zapier-squared.svg
zapier-squared.png
zapier-icon.svg
zapier-icon.png
```

### SVG Structure Templates

#### Filled Variant (24x24, rounded corners)
```xml
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" rx="8" fill="{BRAND_COLOR}"/>
  <g clip-path="url(#clip0)">
    <!-- Logo paths with coordinates in 0-24 range -->
  </g>
  <defs>
    <clipPath id="clip0">
      <rect width="16" height="16" fill="white" transform="translate(4 4)"/>
    </clipPath>
  </defs>
</svg>
```

#### Squared Variant (24x24, sharp corners)
```xml
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" fill="{BRAND_COLOR}"/>
  <g clip-path="url(#clip0)">
    <!-- Logo paths with coordinates in 0-24 range -->
  </g>
  <defs>
    <clipPath id="clip0">
      <rect width="16" height="16" fill="white" transform="translate(4 4)"/>
    </clipPath>
  </defs>
</svg>
```

#### Icon Variant (16x16, no background)
```xml
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0)">
    <!-- Logo mark only, using brand colors -->
  </g>
  <defs>
    <clipPath id="clip0">
      <rect width="16" height="16" fill="white"/>
    </clipPath>
  </defs>
</svg>
```

### Critical: Coordinate Space & Scaling

**The #1 cause of logo problems is incorrect coordinate handling.**

**CORRECT APPROACH**: Define all paths directly in the target coordinate space:
- For 24x24 variants: paths use coordinates in range 0-24
- For 16x16 icon: paths use coordinates in range 0-16

**WRONG APPROACH**: Using transforms to scale arbitrary coordinate paths.

**When converting from source SVG to target dimensions:**
1. Calculate the scale factor: `targetSize / sourceSize`
2. Apply scale to ALL path coordinates
3. Calculate offset to center: `(targetSize - scaledContentSize) / 2`
4. Add offset to all coordinates

### Padding & Content Areas

| Variant | Canvas | Content Area | Padding |
|---------|--------|--------------|---------|
| `filled` | 24x24 | ~16x16 centered | ~4px all sides |
| `squared` | 24x24 | ~16x16 centered | ~4px all sides |
| `icon` | 16x16 | ~12x16 or full | 0-2px |

## Workflow

### 1. Research the Official Logo

**Search order (try each until found):**

1. **Brandfetch** - Search for brandfetch page for the tool
2. **Official website** - Check press kits, brand guidelines
3. **Wikipedia/Wikimedia** - For established tools
4. **SimpleIcons** - https://simpleicons.org
5. **SVGRepo/Iconify** - Community icon collections

**Extract from research:**
- Brand primary color (hex)
- SVG path data for the logo mark
- Official logo proportions

### 2. Create the SVG Files

For each variant:
1. Start with the appropriate template
2. Insert the brand color as background (filled/squared only)
3. Convert paths to target coordinate space
4. Ensure logo is visible against background

### 3. Generate PNG Files

Use browser, Node.js (sharp), or Inkscape CLI to convert SVG to PNG at exact dimensions.

### 4. Browser Review

Before publishing, create a preview HTML and visually verify:
- All 6 files created with correct naming
- Dimensions are exact
- Brand colors are accurate
- Logo is centered and properly sized
- Filled variant has rounded corners
- Squared variant has sharp corners
- Icon variant has no background

## Troubleshooting Common Issues

### Logo appears too small or in corner
**Cause**: Paths in wrong coordinate space
**Fix**: Convert all path coordinates to target space

### Logo is cut off
**Cause**: clipPath missing or incorrectly sized
**Fix**: Add clipPath with correct dimensions

### Colors don't match brand
**Cause**: Using approximate hex values
**Fix**: Research official brand colors

### Filled variant has sharp corners
**Cause**: Missing `rx="8"`
**Fix**: Add `rx="8"` to background rect

## Common Brand Colors (Quick Reference)

| Tool | Primary Color |
|------|---------------|
| Zapier | #FF4A00 |
| Slack | #611F69 |
| Notion | #000000 |
| Salesforce | #00A1E0 |
| Workday | #035CB8 |
| Google Sheets | #0F9D58 |
| Airtable | #18BFFF |
| HubSpot | #FF7A59 |
| Jira | #0052CC |
| GitHub | #24292E |

## Error Handling

**If logo cannot be found:**
- Inform user that official logo could not be sourced
- Suggest alternatives
- Offer to create placeholder with first letter/initials

**If SVG is too complex:**
- Simplify by removing gradients, shadows
- Focus on the core logo mark
- Maintain brand recognition

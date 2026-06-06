# CLAUDE.md

## Project Overview

**Shortlet** is a browser extension (Chrome MV3 + Firefox) that lets users configure and run small DOM automation workflows on webpages via a command palette and keyboard shortcuts. No build step required.

## Development Setup

Load the extension directly into your browser — no compilation needed.

**Chrome:**
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `src/` folder

**Firefox:**
1. Open `about:debugging`
2. Click "This Firefox" → "Load Temporary Add-on"
3. Select `src/manifest.json`

After making changes to source files, click the reload button on the extensions page.

## Repository Structure

```
src/
├── manifest.json              # Extension config (MV3, permissions, content scripts)
├── icon.png
├── shortlet/
│   ├── Shortlet.js            # Content script: bootstraps extension, handles keyboard shortcuts
│   ├── ShortletAPI.js         # All action implementations (click, input, style, goto, etc.)
│   ├── MiniQueue.js           # Sequential action queue with delay support
│   ├── background.js          # Service worker: storage bridge, tab messaging
│   └── actions.css            # Styles injected alongside actions (tooltips, overlays)
├── command-pal/
│   ├── CommandPal.js          # Command palette UI component (keyboard-navigable)
│   ├── theme-dark.css
│   └── theme-shortlet.css
└── options/
    ├── index.html             # Settings page
    ├── options.js             # Reads/writes chrome.storage.sync
    └── options.css
```

## Architecture

- **Content script** (`Shortlet.js`) is injected into every page. It listens for the trigger shortcut, opens the command palette, and drives `ShortletAPI` via `MiniQueue`.
- **Service worker** (`background.js`) bridges storage access and relays messages between the content script and options page.
- **ShortletAPI** is a plain object (`_`) where each key is an action name (e.g. `_.click`, `_.input`, `_.style`). Adding a new action = adding a method to this object.
- **MiniQueue** executes actions sequentially, respecting `wait` delays.

## Code Conventions

- Vanilla ES6+ JavaScript — no frameworks, no npm, no bundler.
- IIFEs for scoping in content scripts (`(function() { ... })()`).
- Async/await for anything promise-based.
- Dev-mode logging: `if (dev_mode) console.log(...)` — toggled via extension settings.
- Element selection uses `querySelectorAll` + optional filters (text regex, viewport visibility, frontmost z-index element).
- Error handling: actions throw on failure; shortlets can define a `fallback` action array.

## Key Concepts

**Shortlet definition (user-authored JSON):**
```json
{
  "id": "example",
  "title": "Example",
  "conditions": [{ "url": "example.com" }],
  "shortcut": "ctrl+e",
  "actions": [
    { "action": "click", "selector": "button.submit" }
  ]
}
```

**Action object properties:**
- `action` — name matching a method on `ShortletAPI`
- `selector` — CSS selector for target elements
- `filter` — optional text/regex filter on `innerText`
- `only_visible` — restrict to in-viewport elements
- `only_frontmost` — restrict to topmost z-index element
- `value` — action-specific value (e.g. text to input)
- `fallback` — array of actions to run if this action fails

## Tests

Unit tests cover pure logic that doesn't require a browser: `MiniQueue` and the element-filter helpers (`matchInnerText`, `textMatchJoin`, `slice_map`). They use Node's built-in test runner — no npm install required.

```
node --test tests/*.test.js
```

| File | What it covers |
|---|---|
| `tests/miniqueue.test.js` | `MiniQueue` constructor, `add`, `start`, `pause` |
| `tests/helpers.test.js` | `matchInnerText`, `textMatchJoin`, `slice_map` |

**How exports work without a bundler:** `MiniQueue.js` and `ShortletAPI.js` contain a `if (typeof module !== 'undefined') module.exports = ...` guard at the bottom. In the browser the guard is falsy (content scripts have no `module`), so it's a no-op. In Node it exports the symbols for testing.

The pure helpers (`matchInnerText`, `textMatchJoin`, `slice_map`) live at the top of `ShortletAPI.js`, outside the IIFE, so they are accessible to both the IIFE and the test guard.

DOM-dependent code (actions, element selection, event dispatch) is not unit-tested. Verify those changes manually by loading the extension in a browser.

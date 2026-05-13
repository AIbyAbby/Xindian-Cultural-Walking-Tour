---
name: open-local-preview
description: Open the local development preview in the Codex in-app browser at http://localhost:8787/ or http://127.0.0.1:8787/. Use when the user asks to open the preview, show the website, view the current static site, open the browser for development, or keep the local site visible while editing.
---

# Open Local Preview

Use this skill when developing the static website and the user wants to see the site in the Codex browser.

## Important Limit

This skill is a Markdown instruction file. It tells Codex what to do when the user asks to open the preview, but it does not run by itself when Codex or the computer starts.

If the Codex app provides an in-app browser control tool, use that tool to open the URL in the sidebar browser. If that tool is not available in the current session, give the user the preview URL and ask them to paste it into the sidebar browser.

## Startup Behavior

Skills cannot currently force the Codex sidebar browser to open automatically on app startup by themselves.

The closest supported workflow is:

1. Keep the local preview server running at startup, if the environment supports it.
2. When the user asks to open the preview, follow this skill.
3. Open the sidebar browser to:

```text
http://localhost:8787/
```

4. If the sidebar browser is already open, reload the same URL.

## Default URL

Open:

```text
http://localhost:8787/
```

If that is blocked or unavailable, try:

```text
http://127.0.0.1:8787/index.html
```

## Workflow

1. Check whether the local preview is reachable.
2. If it is not reachable, restart the local preview server for the current website folder.
3. Open the preview in the Codex in-app browser when the browser tool is available.
4. After frontend edits, reload the same browser tab with a cache-busting query string:

```text
http://localhost:8787/?v=<timestamp>
```

5. Give the user the preview link in the final response.

## Browser Preference

When the Browser plugin is available, use the Codex in-app browser rather than asking the user to open Chrome manually.

If the in-app browser blocks `localhost`, try `127.0.0.1`. If both are blocked but the server is reachable from shell checks, tell the user to paste the URL into Chrome or Edge.

## Friendly Response Pattern

Use short, non-technical updates:

```text
Opening the website preview.
```

When complete:

```text
Preview is open: http://localhost:8787/
```

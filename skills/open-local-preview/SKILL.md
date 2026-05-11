---
name: open-local-preview
description: Open the local development preview in the Codex in-app browser at http://localhost:8787/ or http://127.0.0.1:8787/. Use when the user asks to open the preview, show the website, view the current static site, open the browser for development, or keep the local site visible while editing.
---

# Open Local Preview

Use this skill when developing the static website and the user wants to see the site in the Codex browser.

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
3. Open the preview in the Codex in-app browser.
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
我幫你把右側預覽打開，這樣可以邊改邊看。
```

When complete:

```text
已打開預覽： http://localhost:8787/
```


---
name: safe-git-publish
description: Check a codebase or static website for sensitive information before publishing, committing, or pushing to GitHub. Use when the user asks Codex to review files before git commit, commit changes, push to GitHub, publish a website, upload a repo, or verify that no secrets, tokens, private keys, credentials, local-only paths, or accidental private files are included.
---

# Safe Git Publish

Use this skill before committing or pushing work to GitHub.

## Workflow

1. Inspect the working tree with `git status --short`.
2. Review what will be committed:
   - Use `git diff --stat`.
   - Use `git diff` for tracked changes.
   - Use `git ls-files --others --exclude-standard` for new files.
3. Run `scripts/scan-sensitive.ps1` from this skill against the repo root.
4. If the scan reports high-risk findings, stop. Do not commit or push until the user confirms what to remove or redact.
5. If only low-risk findings appear, summarize them and ask whether to proceed when they involve personal data, local file paths, or private notes.
6. If no concerning findings remain:
   - Stage only intended files.
   - Commit with a clear message.
   - Push only after commit succeeds.

## Sensitive Information To Block

Treat these as blocking findings:

- Private keys, SSH keys, certificates, or files containing `BEGIN ... PRIVATE KEY`.
- API keys and tokens, including GitHub, OpenAI, AWS, Google, Stripe, Slack, Discord, Notion, Firebase, or database credentials.
- `.env` files, credential JSON files, service account files, auth cookies, browser profiles, or local config containing secrets.
- Passwords, access tokens, refresh tokens, or connection strings.
- Large raw personal data exports, private chat logs, or unreviewed documents that the user did not explicitly want published.

## Static Website Notes

For static websites, also check:

- Local absolute paths such as `C:\Users\...` inside public HTML, CSS, JS, Markdown, or JSON.
- Draft notes, source Word files, temporary Office files beginning with `~$`, and preview server files.
- Large raw documents that are not needed by the published website.
- Images or documents that may show private people, phone numbers, addresses, or unapproved interview content.

## Commit Rules

- Never use `git add .` blindly if the scan found questionable files.
- Prefer staging explicit paths.
- Do not commit `.git`, preview logs, temporary build folders, Office lock files, `.env`, or private credentials.
- If push fails because authentication or network is unavailable, provide the exact command for the user to run locally.

## Suggested Commands

Run the scanner:

```powershell
powershell -ExecutionPolicy Bypass -File "skills/safe-git-publish/scripts/scan-sensitive.ps1" -Path "."
```

After a clean scan:

```powershell
git status --short
git add <intended-files>
git commit -m "Your commit message"
git push origin main
```


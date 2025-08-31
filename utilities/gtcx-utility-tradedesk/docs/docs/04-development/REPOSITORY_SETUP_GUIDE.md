# ⚡ Repository Setup & Governance (Lightning Guide)

This guide standardizes how we create, secure, and automate repos across the GTCX orgs for 300x speed. Follow exactly; copy-paste friendly.

## 0) Prereqs
- GitHub org: gtcx-protocol (or target org)
- Access: write/admin as needed
- Installed: Git, GitHub CLI (gh), Node 20+, GitHub Desktop (optional)

## 1) Create repo (new project)
- Name examples:
  - Mobile apps: geotag, tradepass-mobile, tradedesk-mobile
  - APIs: gtcx-backend
  - Bots/services: telegram-bot
- Visibility: Private
- Do NOT add README/.gitignore/license (we push our own)

## 2) Initialize local and push (template)
```bash
# from the app/service folder
rm -rf .git
git init -b main
printf "node_modules\n.expo\n.expo-shared\nios/Pods\nandroid/app/build\n*.log\n.env*\n.DS_Store\ncoverage\nweb-build\n" > .gitignore
git add .
git commit -m "chore: initial import"
# set your repo URL
git remote add origin https://github.com/ORG/REPO.git
git push -u origin main
```

## 3) Minimal CI (status check)
Create .github/workflows/ci.yml:
```yaml
name: CI
on:
  push: { branches: [ main ] }
  pull_request: { branches: [ main ] }
jobs:
  smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - name: Smoke
        run: node -v
```
Commit and push. This exposes the CI / smoke status check.

## 4) Governance files
- .github/CODEOWNERS
```
# default owner
* @amanianai
```
- .github/pull_request_template.md (see templates in templates/github/)

## 5) Branch protection (UI)
Settings → Branches → Add rule for main:
- Require a pull request before merging (1 approving review)
- Require branches to be up to date before merging
- Require status checks to pass → Add check: CI / smoke
- (Optional) Include administrators; Dismiss stale approvals; Conversation resolution

Tip: If protection blocks initial pushes/branches, temporarily disable Require status checks until the first workflow run exists, then re‑enable and select CI / smoke.

## 6) SSH (optional) & GitHub Desktop
- SSH quick setup:
```bash
ssh-keygen -t ed25519 -C "you@example.com"
cat ~/.ssh/id_ed25519.pub  # add to GitHub → Settings → SSH keys
```
- GitHub Desktop:
  - File → Add Local Repository… → select folder
  - Publish → Org, Name, Private → Push origin

## 7) Scripted bootstrap
Use scripts/bootstrap-repo.sh to automate steps 2–4 (requires gh and admin on repo).

## 8) Standard checklist (copy into project README)
- [ ] Repo created and pushed (main)
- [ ] CI workflow merged (status check visible)
- [ ] Branch protection on (PRs, 1 review, up‑to‑date, CI / smoke)
- [ ] CODEOWNERS and PR template in .github/
- [ ] Secrets added (if any) as Actions secrets

## 9) Common pitfalls
- Required status checks cannot be empty: push CI first, then enable the rule.
- Permission denied (publickey): add your SSH key or switch remote to HTTPS.
- Branch protections reject pushes to new branches: temporarily uncheck status checks until first CI run.

---
This document is the standard. Improve as we learn.

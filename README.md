# vanta-backend

## Git Workflow (Team of 4) — Conflict-Free Rules

This repo uses a **feature-branch + PR** workflow with strict ownership to minimize conflicts.

### 1) Branching Model
We use two long-lived branches:

- `main` → always stable / production-ready
- `develop` → integration branch for ongoing work (what we merge into daily)

**Rule:** Never push directly to `main` or `develop`.

### 2) Branch Naming Convention (Required)
Create branches off `develop`:

- Features: `feat/<area>-<short-desc>`
  - Examples: `feat/auth-jwt-refresh`, `feat/events-crud`, `feat/comments-api`
- Fixes: `fix/<area>-<short-desc>`
  - Example: `fix/events-duration-filter`
- Refactor: `refactor/<area>-<short-desc>`
- Chore/CI: `chore/<short-desc>`
- Docs: `docs/<short-desc>`

**Rule:** One branch = one feature set. Keep branches small and reviewable.

### 3) Ownership Rules (Avoiding Overlap)
To avoid two people editing the same files:

- **Dev A owns**: `src/auth`, `src/users`, `src/common`, `src/prisma`, app bootstrap, config
- **Dev B owns**: `src/events`, `src/uploads`, `src/event-images`, `src/event-steps`
- **Dev C owns**: `src/likes`, `src/bookmarks`, `src/comments`, `src/ratings`, `src/stats`
- **Dev D owns**: `src/categories`, `src/amenities`, seeds

If you need to change files owned by someone else:
1) Open a PR
2) Tag the owner as reviewer
3) Do not merge without the owner’s approval

### 4) Prisma / Migrations Rules (CRITICAL)
Database schema conflicts are the most common source of team pain.

**Rules:**
1) Only **one person at a time** generates migrations (recommended: Dev A).
2) Never manually edit an existing migration after it has been merged.
3) If you changed `schema.prisma`, you must include:
   - the generated migration folder
   - and confirm it runs locally from a clean database

**Before opening a PR that touches Prisma:**
```bash
pnpm prisma format
pnpm prisma migrate dev
pnpm test
```

**If you pull new migrations from `develop`:**
```bash
git checkout develop
git pull
pnpm install
pnpm prisma migrate dev
```

### 5) Daily Sync Rule (Rebase Strategy)
To reduce merge conflicts, update your branch daily from `develop`.

Preferred (clean history): **rebase**
```bash
git checkout develop
git pull

git checkout <your-branch>
git rebase develop
```

If rebase conflicts happen:
- Resolve conflicts carefully
- Run tests
- Continue rebase:
```bash
git rebase --continue
```

**Rule:** Do not rebase a branch after other people have started using it.

### 6) Commit Message Convention
Use a consistent convention:

- `feat(auth): add jwt refresh flow`
- `feat(events): add create event endpoint`
- `fix(comments): validate comment length`
- `chore(ci): add lint step`
- `docs(readme): update git workflow section`

### 7) Pull Request (PR) Workflow (Required)
**PR target:** Always open PRs into `develop`.

PR checklist (must pass before merge):
- [ ] Branch is up to date with `develop`
- [ ] Lint passes
- [ ] Tests pass
- [ ] Swagger/docs updated if new endpoints added
- [ ] DTO validation included for all request bodies
- [ ] No secrets committed
- [ ] If Prisma changed: migration included and runs clean

Review rules:
- Minimum **1 reviewer** (2 if touching auth/security or migrations)
- Owner review required if PR touches “owned” module folder (see Ownership Rules)

Merge method:
- Prefer **Squash and merge** (keeps history clean)
- PR title should be descriptive and match the change

### 8) Conflict Avoidance Rules (Practical)
- Keep PRs small: aim < 400 lines changed if possible.
- Don’t mix refactors + features in the same PR.
- Avoid “format-only” changes across many files.
- Do not rename shared files/directories without team agreement.
- If you need a shared type/DTO:
  - add it in a clearly named shared location (e.g. `src/common/types`)
  - announce it in the team channel so others don’t duplicate it.

### 9) Hotfix Policy
If something is broken in production (main):
1) Branch from `main`: `fix/hotfix-<desc>`
2](#)

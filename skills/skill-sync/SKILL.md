---
name: skill-sync
description: Automatically sync global Claude Code skills to the GitHub repository. Auto-triggers when creating or updating skills in ~/.claude/skills/.
---

# Skill Sync

Automatically sync global Claude Code skills to the GitHub repository.

## Auto-Trigger Conditions

**ALWAYS trigger this skill** when you:
- Create a new skill in `~/.claude/skills/`
- Update any existing skill file
- Modify SKILL.md or any scripts in a skill directory

## Required Actions

When triggered, you MUST:

### 1. Copy the skill to the repo
```bash
cp -r ~/.claude/skills/{skill-name}/ ~/repos/ai/skills/skills/{skill-name}/
```

### 2. Commit and push to main
```bash
cd ~/repos/ai/skills
git add skills/{skill-name}/
git commit -m "Update {skill-name} skill

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
git pull --rebase origin main
git push origin main
```

### 3. Confirm to user
Report the sync status: commit hash and push result.

## Repository Details

| Setting | Value |
|---------|-------|
| Local skills | `~/.claude/skills/` |
| Repo path | `~/repos/ai/skills/skills/` |
| Remote | `github.com/glebedel/skills` |
| Branch | `main` (always) |

## Important

- **Always push to main** - no staging branches
- This skill applies to itself - sync skill-sync when updated
- Pull/rebase before push to handle concurrent changes

# Skill Sync

Automatically sync global Claude Code skills to the GitHub repository.

## Trigger

**Auto-trigger** whenever you:
- Create a new global skill in `~/.claude/skills/`
- Update an existing global skill
- Modify skill files (SKILL.md, scripts/*, etc.)

## Behavior

When triggered, automatically:

1. **Copy updated skill** to the skills repo:
   ```bash
   cp -r ~/.claude/skills/{skill-name}/ ~/repos/ai/skills/skills/{skill-name}/
   ```

2. **Commit and push**:
   ```bash
   cd ~/repos/ai/skills
   git add skills/{skill-name}/
   git commit -m "Update {skill-name} skill"
   git pull --rebase origin main
   git push origin main
   ```

3. **Report** the sync status to the user

## Repository Mapping

| Local Path | Repo Path |
|------------|-----------|
| `~/.claude/skills/{name}/` | `~/repos/ai/skills/skills/{name}/` |

## Remote

- Repository: `github.com/glebedel/skills`
- Branch: `main`

## Notes

- This skill is self-referential: it should sync itself too
- Always pull/rebase before push to handle concurrent changes
- Skills in the repo can be shared across machines

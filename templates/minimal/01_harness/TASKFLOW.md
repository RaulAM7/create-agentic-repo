# TASKFLOW

Use this loop every time:

1. Seed
2. Distill
3. Spec
4. Ship
5. QA

Only one active spec at a time.

## First session only

If context files are still empty or stubs, run `initial-context-building` instead of Distill.
It reads broader sources and fills all context slots in one pass.

> Load: `shared/skills/initial-context-building/SKILL.md`

## Distill prompt (copy/paste)

```text
Read 00_inbox/ and distill only what is needed into:
- 02_context/BRIEF.md
- 02_context/FACTS.md
- 02_context/CONSTRAINTS.md
- 02_context/LINKS.md
- 02_context/GLOSSARY.md (if needed)

Rules:
- keep total context readable in 5 minutes
- separate facts from assumptions
- mark unknowns explicitly
- do not move raw dumps into 02_context
```

## Write spec prompt (copy/paste)

```text
Using 02_context, create one active spec in 03_specs/now/001_now.md with:
- Outcome
- Scope / No-scope
- Inputs
- Deliverable path and format
- Acceptance criteria checklist
- Risks / edge cases
- Open questions (max 8)

Keep it execution-ready and concise.
```

## QA gate checklist

- [ ] Deliverable exists in `04_outputs/`
- [ ] Acceptance criteria all checked
- [ ] Unknowns listed
- [ ] Risks noted with mitigation
- [ ] Next action is clear

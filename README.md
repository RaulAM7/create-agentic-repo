# create-agentic-repo

Scaffold a context-lean **Agentic Repo Harness v2** workspace for Claude, Codex, and Antigravity.

## Install

```bash
npm i -g create-agentic-repo
```

Or run directly:

```bash
npx create-agentic-repo my-project --template minimal --yes
```

## Usage

```bash
create-agentic-repo <name> [options]
```

### Options

- `--template minimal` Template to use (only `minimal` for now).
- `--yes` Non-interactive mode. If `<name>` is omitted, defaults to `agentic-repo`.
- `--no-git` Skip `git init` in the generated project.
- `--dry-run` Show actions without writing files.
- `-h, --help` Show help.

## What it generates

`minimal` creates a harness-first tree:

- `00_inbox/` rich raw context drop zone
- `01_harness/` always-on lean rules/taskflow
- `02_context/` distilled 5-minute context
- `03_specs/` one active spec + backlog/decisions
- `04_outputs/`, `05_scratch/`
- `shared/skills/` on-demand skills (includes vendored `skill-creator`)
- `shared/agents/` role agents (one folder per agent)
- `runners/` adapters for Claude/Codex/Antigravity

## Development

```bash
npm run smoke
```

The smoke test scaffolds a temp project, verifies critical files, validates placeholder replacement, and checks `--dry-run` behavior.

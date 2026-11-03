# AGENTS.md — Faceless-Shorts

Instructions for coding agents in this repository.

## Read before you write anything
1. The workspace above, if any: `PROJECT.md`, `ARCHITECTURE.md`, `CONSTITUTION.md`, `CONTRACTS/` (/home/user).
2. `ARCHITECTURE.md` in this repo — the internals of this service.
3. The spec for the feature you are touching: `specs/NNN-slug/`.

## Commands
**If this project uses Python: use `uv` — never `pip`.** `uv add <pkg>` / `uv add --dev <pkg>` to add dependencies, `uv sync` to install,
`uv run <cmd>` to run anything (tests, linters, the app), commit `uv.lock` and never edit it by hand; no `python -m venv`, no `pip install`.

No code yet. New videos follow The-Portuguese-in-India's AGENTS.md commands.

## Where code lives
**Read `CODEMAP.md` before searching the code.** It lists every code folder and what it holds, where outside systems (LLMs,
databases, APIs) are called, where settings are read, and the entry files and tests. After adding, moving or removing a
folder, run `groundwork.py codemap` and describe any new folder in its Holds column.
`groundwork.py layout` shows the layout decision: the GroundWork standard folders, or "keep" — the repo's own structure,
where new code goes next to code of the same kind and copies its patterns.

## Conventions
Follow The-Portuguese-in-India's conventions.

## Code quality
Run `groundwork.py verify` after every change (it runs the commands below) and fix what fails. Never weaken a rule,
add an ignore comment or skip a test to make it pass; an ignore needs a reason on the same line.

- (none yet: they appear when code is added)

1. Reuse before writing: look in CODEMAP.md and search for an existing function first. Never copy-paste a block.
2. Make the smallest change that meets the spec. No speculative abstractions, options or layers.
3. Never swallow errors (no empty catch, no blind `except Exception`). Handle them at the entry point.
4. Validate input where it enters (routes, commands, consumers). Parameterised SQL only; no shell built from input.
5. Add a dependency only with the package manager, after checking it exists and is maintained; prefer what is already used.
6. Comments say why, never what. No commented-out code; no TODO without a tracked item.
7. Names come from the domain (PROJECT.md glossary); no Manager/Helper/Util names.
8. Test behaviour through public functions; mock only connectors to outside systems. A test must fail when the code is wrong.
9. Log through the project's logger, never print in core code, and never log secrets or personal data.
10. Keep files under the size limit and functions short; split by responsibility.

## Process (enforced by the groundwork plugin)
Interview → RFC → human approval → spec → plan → tasks → evals → implement → handover.
Change behaviour ⇒ change the spec in the same change. Do not commit or push unless asked.

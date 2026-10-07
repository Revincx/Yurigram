---
name: perform-task
description: Resolve, start or resume, implement, review, and publish exactly one existing ai-tdesktop task by short slug or full dated id. Use when the user invokes $perform-task or /perform-task with a known task name, or when the continue scheduler delegates one selected task.
---

# Perform One AI Task

Own exactly one selected task through implementation, review, and canonical AI
publication. Do not process the inbox, select follow-up work, or consolidate
pending tasks afterward.

## Validation boundary

Follow the checkout's `AGENTS.md` agent-validation boundary without exception.
Do not create, modify, or run tests, test helpers, harnesses, overlays, probes,
or test data. Do not launch Telegram or another GUI, drive a UI, capture a
runtime screenshot, or invoke Computer Use. Existing task text that asks for
one of these actions records the runtime behavior as unverified; it never
authorizes the action.

Builds are allowed only when the user or task explicitly requires a
non-interactive compilation check. Do not run an executable after a build.

## Read before work

Read these files completely before phase work:

- [Phase effort](../../shared/phase-effort.md);
- on Codex, [child completion and recovery](../../shared/codex-delegation.md);
- `references/pipeline.md` for the task runner contract; and
- `references/phase-prompts.md` for the leaf-worker prompts.

For Grok Build, first read `.grok/ai-workflow-adapter.md` and apply its
host-specific delegation rules.

## Resolve and acquire the task

Run from a Telegram Desktop checkout. Resolve the supplied short slug or full
task id with the workspace helper:

```bash
python3 .agents/skills/process-inbox/scripts/workspace.py resolve \
  --name <short-slug-or-full-task-id>
```

Use `python` or `py -3` when appropriate. Never guess among several unfinished
matches. Inspect the task's readiness, status, owner, explicit source-task
prerequisites, and current source lineage before starting.

- Stop when another task is in progress for this checkout, the task is owned by
  another checkout, or a dependency is unfinished.
- Report and stop when the task is approved or split-required.
- Claim a ready unclaimed `todo` task with `workspace.py start --task <id>`.
- Reopen a blocked task owned by this checkout with `workspace.py retry --task <id>`.
- Resume an in-progress task owned by this checkout without another state commit.

Preserve owned resumable changes. Do not discard, reset, or overwrite dirty
paths. A source-lineage mismatch before implementation is a routing stop, not
a task block.

## Run and publish

Execute `references/pipeline.md`. A changed approved task produces source
implementation commit(s) with the task's three-line message form, tracked
phase artifacts in the AI slot, and one canonical `Approve <task-id>` commit.

Use a complete general review and every applicable specialist review. A task
may be approved only when code review and static inspection support the result.
When behavior can only be established by forbidden local execution, state that
limitation in the result instead of fabricating a substitute test or launching
the app.

Only a genuine exhausted implementation blocker produces `Block <task-id>`.
Tool interruption and unavailable local runtime validation leave the task
in-progress with its durable state intact.

Return the full task id, status or hard stop, touched files, publication
confirmation, review outcome, any requested build result, and unverified
runtime behavior. Never persist or report commit hashes.

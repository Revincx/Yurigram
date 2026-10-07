# Complete Telegram Task Pipeline

Run exactly one selected `ai-tdesktop` task in its Telegram checkout. Keep the
task boundary, source ownership, and AI-state publication rules from the task
record and the checkout's `AGENTS.md`.

## Non-interactive validation only

Do not create, change, or run test code, test tools, test data, probes,
harnesses, overlays, or test-only instrumentation. Do not start Telegram,
another application, a GUI driver, or Computer Use. Do not capture runtime
screenshots. A user-requested non-interactive Debug build may be used only to
compile the changed sources; never execute its output.

Use review, static reading, diff inspection, and explicitly requested
non-interactive builds. Record runtime-dependent acceptance criteria as
unverified for the user instead of attempting local validation.

## Preflight

Before editing:

1. Read `SOURCE_ROOT/AGENTS.md`, `REVIEW.md`, the AI-slot `AGENTS.md`, the
   selected `task.md`, every supplied input, and relevant project context.
2. Verify that the task is in progress and owned by this checkout.
3. Run the source-lineage gate required by the workspace helper.
4. Run `source-prepare` only for a fresh, clean task after lineage succeeds.
   Preserve all resumed task-owned paths and artifacts.
5. Record the available compiler and build-tree information only when a build
   is requested. Do not inspect or prepare app accounts, executables, desktops,
   or GUI drivers.

Never stash, reset, restore, stage, commit, or delete an unexpected path.

## Task artifacts

Use the selected task's tracked work directory for concise durable artifacts:

```text
work/context.md
work/plan.md
work/review1-general.md
work/review1-<lens>.md
work/review1.md
work/review<N>-focused.md
work/result.md
work/owned-paths.txt
work/logs/phase-*.prompt.md
work/logs/phase-*.result.md
```

Artifacts state the requested behavior, assumptions, changed paths, review
findings, build result if one was authorized, and every runtime-dependent
behavior left for the user to verify. Do not create runtime-validation or
execution artifacts.

## Phases

1. Establish context and a minimal implementation plan.
2. Inspect the affected code and make the requested source change.
3. Run an authorized non-interactive Debug build when applicable. A build
   failure is reported and repaired only when it concerns the changed scope.
4. Complete a general review of every changed file and all applicable specialist
   reviews. Repair supported findings and review the changed invariants again.
5. Write `work/result.md`, including `Unverified:` entries for behavior that
   needs an app launch or a test run.

Use the phase prompts for leaf workers. Preserve passing reviews after a narrow
repair; repeat only reviews affected by the repair. If the task expands into
separate independently shippable behavior, publish a split-required result
instead of forcing it through one implementation pass.

## Commits and completion

Source commits owned by the task contain exactly a concise subject, a blank
line, and `Task: <task-id>`. Do not include hashes in artifacts or replies.

After review completes, publish the canonical final state through the workspace
helper. Do not claim that unverified behavior passed. A user can perform those
checks after handoff.

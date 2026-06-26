# SE Demo Runbook

## Purpose
Use the Cumulus Experience Generator to create deterministic demo simulations for Co-Pilot in MS Teams and Claude, then export a standalone HTML file for handoff playback.

## Authoring Workflow
1. Select experience type (`Co-Pilot in MS Teams` or `Claude`).
2. Pick a scenario preset (Headless Audit or Journey Build).
3. Adjust brand colors, assistant name, and greeting.
4. Edit timeline steps in order:
   - `userPrompt`
   - `assistantResponse`
   - `toolAction` (requires title)
5. Run preview to verify sequence and pacing.
6. Fix any validation errors before export.
7. Click `Download Custom Experience` to generate a single HTML file.

## Reliability Rules
- Keep all responses scripted. Do not rely on live model calls during demos.
- Tool actions should mirror what you intend to narrate live (audit, DE creation, journey build, visualization).
- Ensure every step has clear, executive-friendly wording for FINs marketer audiences.

## Suggested Demo Narrative
1. Prompt assistant to audit current environment.
2. Show findings and explain headless value.
3. Trigger DE/journey creation tool actions.
4. Close with visualization output and business impact summary.

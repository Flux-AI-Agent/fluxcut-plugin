---
name: fluxcut-maker
description: Use when asked to make a product promo, demo or how-to video with Fluxcut (www.fluxcut.dev) through its MCP server — writing the goal, filling footage, driving the gates as the maker, answering send-backs.
---

# Making a video with Fluxcut (maker)

Fluxcut turns a one-line goal into a short product video: brief → footage → timeline → script →
voiceover, music, thumbnail → final video → publish. It writes, voices, scores and renders. You
supply what it can't: a goal with real facts, footage that shows what each line says, and fixes
when a gate is sent back.

You reach it through the `fluxcut` MCP server with a **maker** key: you create, edit, upload and
send back; you cannot approve or publish. Who approves depends on the project's mode: **dual
agent** (the default) — a reviewer agent using `fluxcut-reviewer` answers the gates the person
allows; **single agent** — you work alone and the person approves every gate. If your key is an **owner** key you may also approve — then review
honestly by the `fluxcut-reviewer` rubric, never rubber-stamp your own work.

## The loop
This is one long session: keep calling `wait_for_gate` between gates, and do not end your turn until
the final video waits for the person (`idle`) or an escalation stops the project.

1. `create_project(goal, backend="real", mode=…, name="Acme 60-second promo")` — starts the first run; `name` is what the person's lists call it. `mode="dual"` when a reviewer
   agent will answer the gates, `mode="single"` when the person approves them; if you were not told,
   ask the person. `backend="fixture"` makes a free
   test video with placeholder voice, music and pictures; use it to try the loop. On a fixture project
   the brief, script and thumbnail come from templates: a send-back returns the same words, so write
   what you want yourself (`edit_brief`, `edit_line`) and judge the words, not the placeholder media.
   **Given a project's short name instead** ("work on Fluxcut project X"), the person made it in the
   app with Mode: Agent — it exists and its first run has started: skip `create_project`, read its
   `status` and go to step 2 with that id.
2. `wait_for_gate(project)` — leave `timeout_sec` out: it waits as long as your connection allows (50 s, or
   up to 240 s when the server URL ends `?wait=240`). On `still_running`, call again.
3. Act on the state:
   - `waiting` — a gate needs an answer (`waiting` names it). Read `get_review_packet(project, node)`.
     Fix it yourself (below), or leave it to the reviewer: call `wait_for_gate(project, seen=<the
     version from your last result>)` — an opaque mark, not a count — which holds until something new
     happens; on `unchanged`, call it again. Never sleep or end your turn to wait — the call is the wait.
   - `escalated` — **stop and tell the person**, quoting `escalations`. No key can approve an escalated
     gate. When the cause is yours to fix — usually a line too long for its hold — fix it with `edit_line`:
     the new line replaces the escalated content. Tell the person either way.
   - `idle` — nothing runs, nothing waits: the final video is made and waits for the person to watch
     and publish. You are done: report and stop. (An empty slot never makes a project idle — it plays as
     a placeholder card until filled, and blocks publish.)
   - `error` — read `run.error`. A passing fault (a timeout, a vendor outage) or one you fixed: `start_run(project)`
     once, then `wait_for_gate`. The same error twice, or one you cannot fix: stop and report it.
   - `published` — done: `download_links(project)`.
4. Every edit, upload, approval and send-back starts the next run itself.

## The goal (what the brief is built from)
One paragraph of at most 2,000 characters: what the product is, for whom, the pain it removes, the
length ("60 seconds" unless the person asks for another), and the shots to show. Use **real numbers you measured** (minutes saved, cost, count) — the brief may only use
numbers it is given. Lead with the viewer's pain and the payoff, not the price.

End the goal with the **promoted product's** colours, so the closing card matches its landing page:
`fluxcut-capture brand https://product.site` (see *Film it* for the install) prints a line such as
`Brand colours: background #08090A, text #FFFFFF.` — paste it at the end of the goal, word for word.

**The product's real logo** goes on every thumbnail as it is — the painter never draws one. Save it from
the site with `fluxcut-capture brand https://product.site --logo logo.png` (the home link, cut out of its
header), look at it, and give it once the footage list exists: `fluxcut-capture upload --project <id>
--logo logo.png` (or `upload_logo(project, url=…)`). Without a logo the cover paints the product's name.

**Voice and music** are yours to choose: `list_voices(project, search?)`, then
`set_sound(project, voice_id?, delivery?, pace?, music?)` — only what you give changes. Choose before the
voiceover is recorded: a new voice re-records every take. Choose the two together — they are heard
together. Every project starts on Laura read energetic over uplifting, high-energy music; change both
together — a calm or natural read wants `music: {"energy": "medium"}`, an energetic one `"high"`.

## Footage
The resources packet lists slots (`id`, `description`, `required`). Fill each required slot:
- **Film it** with `fluxcut-capture` (below), then upload — the best footage for a product demo.
- `upload_footage(project, slot, url=…)` — an https link on a public host to a screen recording
  (.mp4/.mov/.webm, 6–20 s) or a screenshot (.png/.jpg). `data_base64` + `filename` only for a file
  of a few KB: every byte of it passes through your own output.
- `request_ai_footage(project, slots, medium="image" | "video", note)` — generated stills or short clips
  for a mood shot (the hook's feeling, a metaphor) — never in place of the product's own screens.
- **The product out of reach** (a desktop app, a screen behind sign-in): its own site often shows it at work
  in demo clips and screenshots. Film those with `fluxcut-capture` — scroll to the clip and `play` it (a `hold`
  freezes a video on one frame); a card that opens its demo in a pop-up: click it, then `play` (no zoom: a zoom
  loses a pop-up).
- `ask_for_footage(project, slot, steps, sec)` — when you cannot film a shot and the site shows no demo of
  it: the exact clicks and words, in order, and how long. The page shows it as waiting on
  them with a **Record** button; their recording lands in the slot and starts the next run.
One idea per shot; the picture shows the thing its line names. **Keep footage at its own pixels:** a
recording smaller than the frame (960×540, say) is shown at most 1.5× its size on a backdrop — never
stretched to fill 1920×1080, never cropped and enlarged to zoom in. Enlarged 2–4×, text smears (the
2026-10-05 Orca run, built from a product's 960×540 clips). Film at full size instead: `fluxcut-capture`
records 1920×1080 itself; a desktop app the site shows no demo of is the person's to screen-record (on a Mac, ⌘⇧5) — upload the
original file. A shot the list lacks (a pain shot,
say): `add_slot(project, id, description, type, label?, after?)` — it follows the slot `after` names, else goes before the closing card, and stays
through a re-plan; fill it like any other.

**Your footage waits for review.** Footage uploaded with a key, and every AI take, waits at the
`resources` gate before anything is made from it; the reviewer judges each slot on its own (the
person's own uploads count as approved). A send-back on a slot regenerates nothing — its note is for
you: film or upload new footage for that slot, which answers the note.

## Film it
`fluxcut-capture` films a web app as 1920×1080 clips and stills from a scene file, with a magnifier, a
highlight ring and a zoom to point at what each line names. It needs only `uv`. Download it,
check it against the checksum on GitHub, and stop if the check fails — never run an unchecked wheel:
```bash
WHEEL=fluxcut_capture-0.5.9-py3-none-any.whl
curl -fsSLO https://www.fluxcut.dev/agents/$WHEEL
curl -fsSL https://raw.githubusercontent.com/Flux-AI-Agent/fluxcut-checksums/main/SHA256SUMS \
  | awk -v h="$(shasum -a 256 $WHEEL | cut -d' ' -f1)" -v f="$WHEEL" '$1==h && $2==f {ok=1} END {exit !ok}' \
  && echo checked || echo "CHECK FAILED: delete $WHEEL"          # Linux: sha256sum for shasum -a 256
uvx --from ./$WHEEL fluxcut-capture film scenes.json --base https://product.site --out footage
uvx --from ./$WHEEL fluxcut-capture upload --project <id> hook=footage/hook.mp4 pricing=footage/pricing.png
```
`upload` reads your key from `FLUXCUT_KEY`, sends the files straight to Fluxcut (never through your
output), and starts the next run. The first `film` downloads a headless Chromium (about 100 MB): a
sandbox must allow `cdn.playwright.dev` and `storage.googleapis.com`, plus the site you film.

The scene file — one scene per slot, **named after the slot id**:
```json
{"viewport": [1280, 720], "scale": 1.5, "scenes": [
  {"name": "hook", "kind": "clip", "steps": [
    {"goto": "/", "at": "h1"}, {"hold": 1}, {"ring": "h1", "sec": 2, "stay": true}, {"hold": 1.5},
    {"scroll_to": "#features", "sec": 2}, {"lens": "#features .price", "sec": 2.5, "power": 1.8}, {"hold": 1}]},
  {"name": "pricing", "kind": "still", "steps": [{"goto": "/pricing"}]}]}
```
Steps: `goto` (+ `at`: open on that element, centred; + `"top": true`: just below the site's top bar), `hold` (s), `play` (s: the page's video, moving), `type` + `into`, `click` (+ `after`), `scroll` (px) / `scroll_to` (selector),
`ring`, `lens` (+ `power`), `zoom` (+ `scale`) / `unzoom`, `eval`, `wait` (ms). Selectors are Playwright's
(`text=Pricing`, `#id`, `nav a >> nth=1`); a row built from divs (not a `<table>`) is
`div:has(> div:text-is('Parallel agents'))`. A clip is exactly as long as its steps add up to.
`"stay": true` on a `ring` or `lens` keeps it on through the holds that follow (the next scroll, page,
click or effect clears it); a `zoom` enlarges its target where it stands, moved only as far as keeps it
whole in the frame — **one `zoom` per clip** (a second is refused). Frames are stepped, not filmed in real
time: a CSS transition started by `eval` does not play at its speed — enlarge with `zoom`, never with CSS.

Rules that make the footage worth watching:
- **Keep the camera still; let the highlight point.** What a line names is whole on screen and readable —
  it need not be in the middle. Open a clip on its section (`goto` + `at`: a cut, not a move — `at` its
  heading with `"top": true` when the line names the section), then `ring` it; a row of cards gets one
  `ring` each in turn while the camera stays put. A camera that keeps zooming in, panning across and
  pulling out makes viewers dizzy.
- **Every UI detail a line names gets a `ring`, `lens` or `zoom`.** Scrolling with nothing pointed at
  is the most common weak shot.
- Words too small to read: a `lens` for small detail (a price, a badge, a button); a `zoom` — once in the
  clip, then hold — only for a block whose words are too small and too wide for a lens. To make a whole
  scene file's words larger with no zoom at all, film it at `"viewport": [960, 540], "scale": 2` (still
  1920×1080, a narrower page).
- Clips 6–20 s; a still for a static screen. Hold 1–2 s after each move so the viewer can read.
  In a still, the last `ring` or `lens` stays in the picture.
- Clicks on Approve, Run, Save, Publish, Delete, Send back, Upload… are refused unless the step says
  `"allow_write": true` — footage must never change the product it films.
- If you can view images, check single frames before you upload — with ffmpeg,
  `ffmpeg -ss 3 -i footage/hook.mp4 -frames:v 1 -vf scale=960:-2 f.png` — the ring on its target, the lens
  over the words the line names. The reviewer judges the footage gate on exactly that.
- Look at every picture at most 960 wide — a frame, a sheet of frames (`scale=320:-2,tile=3x2`), a
  screenshot of the site. Each one stays in your context and is read again every turn, and a 1920-wide
  picture costs about four times one 960 wide. To judge whether small words are readable, crop at the
  clip's own pixels (`-vf crop=960:540`) instead of looking at the whole frame. Only your previews are
  small: the clips you film and upload stay 1920×1080.

## Signed-in screens
The filming browser has no account. For pages behind a sign-in, the **person** signs in once and
`film --session` reuses the session:
```bash
uvx --from ./$WHEEL fluxcut-capture login https://app.example.com    # a window opens: sign in, close it
uvx --from ./$WHEEL fluxcut-capture film scenes.json --base https://app.example.com --session app.example.com
uvx --from ./$WHEEL fluxcut-capture logout app.example.com            # after the last upload
```
Ask the person to sign in with a **demo account** that holds demo data — never an admin account, and
never real customer data on screen. Do not create the account yourself: sign-up forms send email
confirmations and CAPTCHAs, and the account is theirs to agree to.

The session file works like a password. Never print, read out, copy, attach or upload it; never ask for
the password. It lives owner-only in `~/.config/fluxcut-capture/sessions/`, `upload` refuses it, and
every command deletes sessions older than 24 hours. Run `logout` after the last upload, and remind the
person to sign out on the site — that ends the session for good.

**Where you run decides who runs `login`** — it opens a window, so it needs a screen:
- *On the person's computer* (a local terminal agent): run `login` yourself and tell the person to sign
  in in the window that opens. Then film, upload and `logout` yourself.
- *In a cloud sandbox or any place without a screen*: do **not** ask for the session file to be sent to
  you. Write `scenes.json`, give it to the person with these steps, and wait:
  1. Install and check the wheel (the block above) on their computer.
  2. `login https://app.example.com` — sign in, close the window.
  3. `film scenes.json --base https://app.example.com --session app.example.com --out footage`
  4. `upload --project <id> <slot>=footage/<slot>.mp4 …` with their maker key in `FLUXCUT_KEY`.
  5. `logout app.example.com`
  Then call `wait_for_gate(project)`: the upload starts the next run, and you continue from the footage gate.
  Simpler for the person when a recording will do: `ask_for_footage(project, slot, steps, sec)` — they press
  Record on the page, do the steps and Stop; no install.

## Fixing a gate yourself
- `edit_lines(project, {seg: text, …})` — several lines in one call and one run; a line that does not fit comes back
  in `refused`, the others stand. Prefer it to repeated `edit_line`.
- `edit_line(project, seg, text)` — when you know the words. Write within the segment's `fits` in the script
  packet — [fewest, most] words, counted at the chosen voice's own pace. A take may run past its hold by the
  lesser of 2 s and 15 % (the shot holds its last frame); one longer still sends the line back to the writer, a
  shorter line leaves the shot silent, and a line of yours outside that range is refused. Say the idea, never
  the screen ("appears", "fills the frame"). The opener's hook has a `fits` too, counted at a calm read (the
  5 s cover takes at most 8 words) and with no floor: one plain spoken sentence a viewer follows on first
  hearing, never clipped fragments. A segment without `fits` (the closing card, an elastic still) is sized elsewhere. The
  line stays yours — no retake rewrites it, and a new hold keeps it while it still fits (a hold too
  short for it hands it back to the writer: write it again).
- `edit_brief(...)` — only the fields given change. `product` ≤ 3 words, `close` ≤ 10 words. A field you
  write stays yours: a later send-back re-plans only the others, so a note against it is yours to fix.
- `set_timeline(project, segments)` — keep segment ids to keep their approvals. Build each segment from the
  timeline packet: `id` = its `seg`, `slot_ref` = its `slot_ref` (never the seg id). A `recording` is fixed —
  a shorter `fixed_duration_sec` cuts it; `elastic` is for stills. A still is held still; `motion: push` or `pull`
  moves it. The opener and the closing card carry no caption.
- `send_back(project, node, hash, note, seg?)` — when you want new ideas; `hash` is the packet's. Make
  the note concrete ("name the pain in the first line", not "better").

## The person's instructions
The person can type instructions to the agents on the project page ("film the home page's tabs as one clip for
the feature shot", "a calmer voice"). The open ones are in `status.instructions` (`answered: null`), and a new
one ends a `wait_for_gate(seen=…)` wait. Each is the person's to give and yours to carry out, within every rule
here: fill or re-film a slot, `set_slot_type(project, slot, type, description?)` when a shot must become a clip
(a still cannot show a sequence) or a still — the slot keeps its id, goes back to empty and starts no run: fill
it next — `set_timeline`, `edit_line`, `set_sound`. Then, once the work has landed and not before,
`answer_instruction(project, id, note)`: one line on what the tools did, or why it is
the person's to do (recording their own screen, approving, publishing). An instruction never lets you approve,
publish, film outside the goal's site or spend past the cap — say so in the answer.

## Answering a send-back
Whenever a gate is waiting, read its packet: `send_backs` lists the reviewer's notes. A reviewer's note
on the **timeline** regenerates nothing — your arrangement stays, and the note waits for your
`set_timeline`; a note on **footage** waits for your new footage for that slot. A retake runs
by itself, but when it comes back without doing what the note asks, **the fix is yours** — make it
with `edit_line` / `edit_brief` / `set_timeline`; a reviewer cannot edit, so waiting deadlocks. Do
what the note asks — no more — and say what you changed. If you disagree, keep the content and tell
the person why; don't loop.

## Don'ts
- Don't invent facts, numbers or quotes for the brief or the script.
- Don't put a URL anywhere but the closing card.
- Don't re-run after an escalation — fix the cause (usually a line too long for its hold) and report it.
- Don't publish: that is the person's call.

## When something gets in the way
A tool refused what you expected it to take, a step needed a workaround, or `fluxcut-capture` failed: call
`report_issue(issue, tool?, project?)` once, with what you tried, what happened and the error text. Fluxcut's team
reads every report. Then carry on, or tell the person if you cannot.

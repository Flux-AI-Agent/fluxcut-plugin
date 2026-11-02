# Fluxcut for Codex

This plugin lets Codex make a product video with Fluxcut. One install adds the remote MCP server, the fluxcut-maker skill and a tool timeout of 300 seconds, so a wait can hold for four minutes instead of stopping at sixty seconds.

Make a maker key at https://www.fluxcut.dev/settings/keys. In the terminal you start Codex from, run `export FLUXCUT_KEY=fcx_…`. Codex reads that variable when it starts. The plugin never stores the key.

```sh
codex plugin marketplace add Flux-AI-Agent/fluxcut-plugin && codex plugin add fluxcut@fluxcut
```

Start a new task and ask Codex to use the fluxcut-maker skill. You approve each step, and you publish. The reviewer skill is a second agent, set up from https://www.fluxcut.dev/connect.

## What it runs, fetches and sends

- **The MCP server.** Every tool call goes to Fluxcut's server, https://www.fluxcut.dev/mcp, with your key: the goal, your edits, footage links, approvals and send-backs.
- **Filming, only when the agent films footage.** The fluxcut-maker skill has the agent download `fluxcut-capture`, a Python package, from https://www.fluxcut.dev/agents/, check its SHA-256 against https://github.com/Flux-AI-Agent/fluxcut-checksums, and run it with `uv`. Its first run downloads a headless Chromium from Playwright's servers (cdn.playwright.dev, storage.googleapis.com). It opens the site you name, records it, and uploads the clips and the logo to www.fluxcut.dev with your key.
- **Nothing else.** The plugin has no hooks and sends nothing to any other service. Fluxcut logs which tools an agent called, not what it wrote, for 90 days. What Fluxcut keeps, and for how long: https://www.fluxcut.dev/privacy.

Privacy: https://www.fluxcut.dev/privacy
Terms: https://www.fluxcut.dev/terms
License: MIT

"Fluxcut" and the Fluxcut logo are trademarks of Fluxcut. The MIT License covers the files in this repo, not the name or the logo.

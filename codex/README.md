# Fluxcut for Codex

This plugin lets Codex make a product video with Fluxcut. One install adds the remote MCP server, the fluxcut-maker skill and a tool timeout of 300 seconds, so a wait can hold for four minutes instead of stopping at sixty seconds.

Make a maker key at https://www.fluxcut.dev/settings/keys. In the terminal you start Codex from, run `export FLUXCUT_KEY=fcx_…`. Codex reads that variable when it starts. The plugin never stores the key.

```sh
codex plugin marketplace add Flux-AI-Agent/fluxcut-plugin && codex plugin add fluxcut@fluxcut
```

Start a new task and ask Codex to use the fluxcut-maker skill. You approve each step, and you publish. The reviewer skill is a second agent, set up from https://www.fluxcut.dev/connect.

Privacy: https://www.fluxcut.dev/privacy
Terms: https://www.fluxcut.dev/terms
License: MIT

"Fluxcut" and the Fluxcut logo are trademarks of Fluxcut. The MIT License covers the files in this repo, not the name or the logo.

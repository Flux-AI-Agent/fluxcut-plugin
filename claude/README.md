# Fluxcut for Claude Code

This plugin lets Claude Code make a product video with Fluxcut. One install adds the remote MCP server, the fluxcut-maker skill and a five-minute tool timeout, so a wait can hold for four minutes instead of stopping at sixty seconds.

Make a maker key at https://www.fluxcut.dev/settings/keys. In the terminal you start Claude Code from, run `export FLUXCUT_KEY=fcx_…`. The plugin stores that name, never the key.

```sh
claude plugin install fluxcut --marketplace Flux-AI-Agent/fluxcut-plugin
```

Start a new session and ask Claude Code to use the fluxcut-maker skill. If you set Fluxcut up by hand before, run `claude mcp remove fluxcut` first.

You approve each step, and you publish. The reviewer skill is a second agent, set up from https://www.fluxcut.dev/connect.

Privacy: https://www.fluxcut.dev/privacy
Terms: https://www.fluxcut.dev/terms
License: MIT

"Fluxcut" and the Fluxcut logo are trademarks of Fluxcut. The MIT License covers the files in this repo, not the name or the logo.

# Fluxcut for Claude Code

This plugin lets Claude Code make a product video with Fluxcut. One install adds the remote MCP server, the fluxcut-maker skill and a five-minute tool timeout, so a wait can hold for four minutes instead of stopping at sixty seconds.

Make a maker key at https://www.fluxcut.dev/settings/keys. The plugin asks for it once and keeps it in your system's secure storage (the macOS Keychain, for example), never in a file. With the key exported as `FLUXCUT_KEY`, install and save it in two lines:

```sh
claude plugin install fluxcut --marketplace Flux-AI-Agent/fluxcut-plugin
printf '{"fluxcut_key":"%s"}' "$FLUXCUT_KEY" | claude plugin configure fluxcut@fluxcut --values-stdin
```

Or type the key in Claude Code: `/plugin configure fluxcut@fluxcut`. The server loads once the key is set. To film footage, the skill's `fluxcut-capture` reads the key from `FLUXCUT_KEY`, so keep it exported in that terminal.

Start a new session and ask Claude Code to use the fluxcut-maker skill. If you set Fluxcut up by hand before, run `claude mcp remove fluxcut` first.

You approve each step, and you publish. The reviewer skill is a second agent, set up from https://www.fluxcut.dev/connect.

Privacy: https://www.fluxcut.dev/privacy
Terms: https://www.fluxcut.dev/terms
License: MIT

"Fluxcut" and the Fluxcut logo are trademarks of Fluxcut. The MIT License covers the files in this repo, not the name or the logo.

# Fluxcut for Cursor

This plugin lets Cursor's agent make a product video with Fluxcut. One install adds the remote MCP server and the fluxcut-maker skill.

Make a maker key at https://www.fluxcut.dev/settings/keys and set `FLUXCUT_KEY` in the environment Cursor starts in. The plugin reads `${env:FLUXCUT_KEY}` and never stores the key.

Cursor has no per-server timeout setting, so this plugin uses the server's default wait of 45 seconds. Waits are shorter than with the Claude Code or Codex plugin, but none is cut off.

You approve each step, and you publish. The reviewer skill is a second agent, set up from https://www.fluxcut.dev/connect.

Privacy: https://www.fluxcut.dev/privacy
Terms: https://www.fluxcut.dev/terms
License: MIT

"Fluxcut" and the Fluxcut logo are trademarks of Fluxcut. The MIT License covers the files in this repo, not the name or the logo.

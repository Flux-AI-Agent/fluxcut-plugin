# Fluxcut agent plugins

Fluxcut makes a short product video from a goal. These plugins let a coding agent make one for you: the agent writes, films and drives each step, and you approve each step and publish.

One install adds three things:

- the Fluxcut MCP server, `https://www.fluxcut.dev/mcp`
- the `fluxcut-maker` skill, which tells the agent how to make the video
- a five-minute tool timeout, so one wait can hold for four minutes instead of stopping at sixty seconds

## Your key

Make a maker key at [Settings → Agent keys](https://www.fluxcut.dev/settings/keys). Then, in the terminal you start your agent from:

```sh
export FLUXCUT_KEY=fcx_…
```

The Claude Code plugin keeps the key in your system's secure storage (the macOS Keychain, for example). The Codex and Cursor plugins store the name `FLUXCUT_KEY`, never the key, and read it from the environment, so for them add that line to your shell profile. `fluxcut-capture`, the filming tool the skill uses, reads `FLUXCUT_KEY` too.

## Claude Code

```sh
claude plugin install fluxcut --marketplace Flux-AI-Agent/fluxcut-plugin
printf '{"fluxcut_key":"%s"}' "$FLUXCUT_KEY" | claude plugin configure fluxcut@fluxcut --values-stdin
```

The second line saves the key you exported into the plugin's settings. You can instead type it in Claude Code: `/plugin configure fluxcut@fluxcut`. The server loads once the key is set. The install command needs Claude Code 2.1.292 or later. On an older version, add the marketplace first: `claude plugin marketplace add Flux-AI-Agent/fluxcut-plugin && claude plugin install fluxcut@fluxcut`. Start a new session, then ask: "Use the fluxcut-maker skill to make a promo for <your product>."

If you set Fluxcut up by hand before, `claude mcp remove fluxcut` so the plugin's server is the only one.

## Codex

```sh
codex plugin marketplace add Flux-AI-Agent/fluxcut-plugin && codex plugin add fluxcut@fluxcut
```

Codex reads `FLUXCUT_KEY` when it starts. Start a new task after installing.

## Cursor

In Cursor, open the marketplace and install **Fluxcut**. Before it is listed there, clone this repo and copy `cursor/` to `~/.cursor/plugins/local/fluxcut`, then run **Developer: Reload Window**. Cursor reads `FLUXCUT_KEY` from the environment it starts in. Its waits use the server's default of 45 seconds.

## Any other MCP client

Point it at `https://www.fluxcut.dev/mcp` with the header `Authorization: Bearer <your key>`. Add `?wait=240` only if the client allows tool calls of five minutes. [fluxcut.dev/connect](https://www.fluxcut.dev/connect) has the steps for each agent and the reviewer skill. A reviewer is a second agent with its own key.

## What is in this repo

| Path | What it is |
| --- | --- |
| `claude/` | the Claude Code plugin; `.claude-plugin/marketplace.json` lists it |
| `codex/` | the Codex plugin; `.agents/plugins/marketplace.json` lists it |
| `cursor/` | the Cursor plugin; `.cursor-plugin/marketplace.json` lists it |
| `server.json` | the entry for the MCP registry |
| `glama.json` | the maintainer, for Glama |

The skill is Fluxcut's published maker playbook. The minor version number is the playbook's version.

Privacy: https://www.fluxcut.dev/privacy · Terms: https://www.fluxcut.dev/terms · License: MIT

"Fluxcut" and the Fluxcut logo are trademarks of Fluxcut. The MIT License covers the files in this repo, not the name or the logo.

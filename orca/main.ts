import type { OrcaWorkerApi } from 'orca/worker'

const INSTALLERS = {
  'fluxcut.setupClaude': {
    agent: 'Claude Code',
    command: 'claude plugin install fluxcut --marketplace Flux-AI-Agent/fluxcut-plugin',
    next: 'In Claude Code, run /plugin configure fluxcut@fluxcut to save your maker key, then start a new session.'
  },
  'fluxcut.setupCodex': {
    agent: 'Codex',
    command: 'codex plugin marketplace add Flux-AI-Agent/fluxcut-plugin && codex plugin add fluxcut@fluxcut',
    next: 'Start a new Codex task with FLUXCUT_KEY set in its environment.'
  }
} as const

export default function activate(orca: OrcaWorkerApi): void {
  for (const [id, installer] of Object.entries(INSTALLERS)) {
    orca.commands.register(id, async () => {
      const context = await orca.host.call('workspace.readContext', {})
      if (!context?.workspaceId) {
        return 'Open a workspace, then run this command again.'
      }
      await orca.host.call('terminal.create', {
        workspaceId: context.workspaceId,
        title: `Set up Fluxcut for ${installer.agent}`,
        command: installer.command
      })
      return `Started Fluxcut setup for ${installer.agent} in a new terminal. ${installer.next}`
    })
  }
}

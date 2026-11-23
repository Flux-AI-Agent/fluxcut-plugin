import { assert, mockHost, mountWorker, test } from 'orca/testing'
import * as main from './main'

const context = {
  workspaceId: 'workspace-1',
  branch: 'main',
  displayName: 'Product',
  terminals: []
}

test('sets up Claude Code in a dedicated terminal without handling its key', async () => {
  const worker = await mountWorker(main, {
    host: mockHost({ results: { 'workspace.readContext': context, 'terminal.create': { terminalId: 'terminal-1' } } })
  })

  const result = await worker.command('fluxcut.setupClaude')

  assert.deepEqual(worker.host.callsOf('terminal.create'), [{
    workspaceId: 'workspace-1',
    title: 'Set up Fluxcut for Claude Code',
    command: 'claude plugin install fluxcut --marketplace Flux-AI-Agent/fluxcut-plugin'
  }])
  assert.match(String(result), /\/plugin configure fluxcut@fluxcut/)
  assert.deepEqual(worker.refusals, [])
  await worker.deactivate()
})

test('sets up Codex with its existing marketplace installer', async () => {
  const worker = await mountWorker(main, {
    host: mockHost({ results: { 'workspace.readContext': context, 'terminal.create': { terminalId: 'terminal-1' } } })
  })

  const result = await worker.command('fluxcut.setupCodex')

  assert.deepEqual(worker.host.callsOf('terminal.create'), [{
    workspaceId: 'workspace-1',
    title: 'Set up Fluxcut for Codex',
    command: 'codex plugin marketplace add Flux-AI-Agent/fluxcut-plugin && codex plugin add fluxcut@fluxcut'
  }])
  assert.match(String(result), /FLUXCUT_KEY/)
  assert.deepEqual(worker.refusals, [])
  await worker.deactivate()
})

test('does not open a terminal when no workspace is available', async () => {
  const worker = await mountWorker(main, {
    host: mockHost({ results: { 'workspace.readContext': null } })
  })

  assert.equal(await worker.command('fluxcut.setupClaude'), 'Open a workspace, then run this command again.')
  assert.deepEqual(worker.host.callsOf('terminal.create'), [])
  assert.deepEqual(worker.refusals, [])
  await worker.deactivate()
})

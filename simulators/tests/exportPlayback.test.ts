import test from 'node:test'
import assert from 'node:assert/strict'
import coPilotDefault from '../content/co-pilot.default.json'
import { runScript } from '../engine/runScript'
import { buildStandaloneHtml } from '../../web/src/lib/export/buildStandaloneHtml'

test('runScript replays steps in exact authored order', async () => {
  const received: string[] = []
  await runScript(coPilotDefault.script as any, (step) => {
    received.push(step.id)
  })
  const expected = coPilotDefault.script.map((step: any) => step.id)
  assert.deepEqual(received, expected)
})

test('standalone html contains simulator payload', () => {
  const html = buildStandaloneHtml(coPilotDefault as any)
  assert.equal(html.includes('Cumulus Experience Export'), true)
  assert.equal(html.includes(coPilotDefault.assistant.greeting), true)
  assert.equal(html.includes(coPilotDefault.script[0].text), true)
})

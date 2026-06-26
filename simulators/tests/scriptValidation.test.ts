import test from 'node:test'
import assert from 'node:assert/strict'
import coPilotDefault from '../content/co-pilot.default.json'
import { validateScript } from '../engine/validateScript'

test('default co-pilot script validates cleanly', () => {
  const errors = validateScript(coPilotDefault as any)
  assert.equal(errors.length, 0)
})

test('fails when toolAction has no title', () => {
  const broken: any = JSON.parse(JSON.stringify(coPilotDefault))
  broken.script.push({
    id: 'bad-tool',
    type: 'toolAction',
    text: 'Action without title',
  })

  const errors = validateScript(broken)
  assert.equal(errors.some((error) => error.includes('toolAction requires a title')), true)
})

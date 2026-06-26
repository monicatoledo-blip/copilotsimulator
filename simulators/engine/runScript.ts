import type { ScriptStep } from './validateScript'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function runScript(
  steps: ScriptStep[],
  onStep: (step: ScriptStep, index: number) => void,
) {
  for (let index = 0; index < steps.length; index += 1) {
    const step = steps[index]
    if (step.delayMs && step.delayMs > 0) {
      await sleep(step.delayMs)
    }
    onStep(step, index)
  }
}

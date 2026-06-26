import { COPILOT_ICON } from './copilotIconData'

export default function CopilotMark({ size = 20 }: { size?: number }) {
  return (
    <img
      src={COPILOT_ICON}
      width={size}
      height={size}
      alt="Copilot"
      style={{ display: 'block', objectFit: 'contain' }}
    />
  )
}

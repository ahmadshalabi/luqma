import { memo } from 'react'

/**
 * InstructionStep primitive component for displaying a single instruction step.
 * Presentational component.
 * Memoized to prevent unnecessary re-renders when props haven't changed.
 * 
 * @param {Object} props
 * @param {string} props.instruction - Instruction text
 * @param {number} props.stepNumber - Step number (1-indexed)
 */
const InstructionStepComponent = ({ instruction, stepNumber }) => {
  return (
    <li className="flex gap-4">
      <span
        className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm"
        aria-label={`Step ${stepNumber}`}
      >
        {stepNumber}
      </span>
      <p className="flex-1 text-gray-700 leading-relaxed pt-1">
        {instruction}
      </p>
    </li>
  )
}

export const InstructionStep = memo(InstructionStepComponent)


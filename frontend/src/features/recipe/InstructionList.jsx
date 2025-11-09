import { Section } from '@/primitives/Section'

/**
 * InstructionList component displaying step-by-step cooking instructions.
 *
 * @param {Object} props - Component props
 * @param {Array} props.instructions - Array of instruction strings
 * @returns {JSX.Element} InstructionList component
 */
export function InstructionList({ instructions }) {
  const isEmpty = !instructions || instructions.length === 0

  return (
    <Section
      title="Instructions"
      isEmpty={isEmpty}
      emptyMessage="No cooking instructions available."
    >
      <ol className="space-y-4 list-none">
        {instructions.map((instruction, index) => (
          <li
            key={index}
            className="flex gap-4"
          >
            <span
              className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm"
              aria-label={`Step ${index + 1}`}
            >
              {index + 1}
            </span>
            <p className="flex-1 text-gray-700 leading-relaxed pt-1">
              {instruction}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}


import { Section } from '@/components/ui/Section'
import { Alert } from '@/components/ui/Alert'
import { InstructionStep } from './InstructionStep'

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
    <Section title="Instructions">
      {isEmpty ? (
        <Alert
          variant="info"
          message="No cooking instructions available."
        />
      ) : (
        <ol className="space-y-4 list-none">
          {instructions.map((instruction, index) => (
            <InstructionStep
              key={index}
              instruction={instruction}
              stepNumber={index + 1}
            />
          ))}
        </ol>
      )}
    </Section>
  )
}


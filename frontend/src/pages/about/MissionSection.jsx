import { Heading, Text } from '@/components/ui/Typography'

/**
 * MissionSection - Displays the mission statement.
 * Presentational component.
 */
export function MissionSection() {
  return (
    <article className="space-y-4">
      <Heading as="h2" size="lg" weight="semibold">
        Our Mission
      </Heading>
      <Text size="lg" variant="body" color="gray" className="text-gray-700">
        Luqma helps you discover and explore recipes while making informed decisions about your nutrition. 
        We believe that cooking should be enjoyable and accessible to everyone, with the ability to customize 
        recipes based on dietary preferences and restrictions.
      </Text>
    </article>
  )
}


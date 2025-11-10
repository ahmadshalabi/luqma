import { Card } from '@/components/ui/Card'
import { IconBox } from '@/components/ui/IconBox'
import { Heading, Text } from '@/components/ui/Typography'

/**
 * FeatureCard component for displaying a feature with icon and description.
 * 
 * @param {Object} props
 * @param {string} props.icon - Icon name
 * @param {string} props.iconColor - Icon color theme
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 */
export function FeatureCard({ icon, iconColor, title, description }) {
  return (
    <Card padding="md">
      <div className="flex items-start gap-4">
        <IconBox icon={icon} color={iconColor} size="lg" />
        <div className="flex-1">
          <Heading as="h3" size="sm" weight="semibold" className="mb-2">
            {title}
          </Heading>
          <Text variant="body" color="muted">
            {description}
          </Text>
        </div>
      </div>
    </Card>
  )
}


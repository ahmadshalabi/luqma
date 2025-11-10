import { Card } from '@/components/ui/Card'
import { Icon } from '@/utils/iconRegistry'
import { Heading, Text } from '@/components/ui/Typography'
import { getColorClasses } from '@/utils/colorUtils'

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
  const { textPrimary } = getColorClasses(iconColor)

  return (
    <Card padding="md">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-${iconColor}-100 flex items-center justify-center`}>
          <Icon name={icon} className={`w-6 h-6 ${textPrimary}`} />
        </div>
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


import { Card } from '../ui/Card'
import { Icon } from '@/utils/iconRegistry'
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  )
}


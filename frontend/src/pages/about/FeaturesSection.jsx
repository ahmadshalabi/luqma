import { FeatureCard } from './FeatureCard'
import { Grid } from '@/components/ui/Grid'
import { Heading } from '@/components/ui/Typography'

/**
 * FeaturesSection - Displays the features grid.
 * Presentational component.
 */
export function FeaturesSection() {
  const features = [
    {
      icon: 'search',
      iconColor: 'blue',
      title: 'Live Search',
      description: 'Search recipes with instant feedback. Results update as you type with smart debouncing for optimal performance.'
    },
    {
      icon: 'checkCircle',
      iconColor: 'green',
      title: 'Nutritional Info',
      description: 'View detailed nutritional information including calories for every recipe.'
    },
    {
      icon: 'xMark',
      iconColor: 'purple',
      title: 'Ingredient Exclusion',
      description: "Exclude ingredients you don't like or can't eat, and see updated nutritional information in real-time."
    }
  ]

  return (
    <article className="space-y-6">
      <Heading as="h2" size="lg">
        Features
      </Heading>
      <Grid cols={{ default: 1, md: 2 }} gap={8}>
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            iconColor={feature.iconColor}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </Grid>
    </article>
  )
}


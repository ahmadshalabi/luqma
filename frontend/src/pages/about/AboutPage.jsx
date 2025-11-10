import { HeroSection } from '@/components/layout/HeroSection'
import { Container } from '@/components/layout/Container'
import { MissionSection } from './MissionSection'
import { FeaturesSection } from './FeaturesSection'

/**
 * AboutPage - Main about page component.
 * Displays company mission and product features.
 */
export function AboutPage() {
  return (
    <>
      <HeroSection
        title="About Luqma"
        description="Your companion for discovering delicious recipes with detailed nutritional information"
      />

      <Container>
        <div className="space-y-12">
          <MissionSection />
          <FeaturesSection />
        </div>
      </Container>
    </>
  )
}

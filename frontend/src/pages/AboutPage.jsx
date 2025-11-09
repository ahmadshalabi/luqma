import { HeroSection } from '@/features/layout/HeroSection'
import { PageSection } from '@/features/layout/PageSection'
import { FeatureCard } from '@/features/about/FeatureCard'

export const AboutPage = () => {
  return (
    <main id="main-content" className="flex-grow">
      <HeroSection
        title="About Luqma"
        description="Your companion for discovering delicious recipes with detailed nutritional information"
      />

      <PageSection>
        <div className="space-y-12">
          <article className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Our Mission
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Luqma helps you discover and explore recipes while making informed decisions about your nutrition. 
              We believe that cooking should be enjoyable and accessible to everyone, with the ability to customize 
              recipes based on dietary preferences and restrictions.
            </p>
          </article>

          <article className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                icon="search"
                iconColor="blue"
                title="Live Search"
                description="Search recipes with instant feedback. Results update as you type with smart debouncing for optimal performance."
              />
              <FeatureCard
                icon="checkCircle"
                iconColor="green"
                title="Nutritional Info"
                description="View detailed nutritional information including calories for every recipe."
              />
              <FeatureCard
                icon="xMark"
                iconColor="purple"
                title="Ingredient Exclusion"
                description="Exclude ingredients you don't like or can't eat, and see updated nutritional information in real-time."
              />
            </div>
          </article>
        </div>
      </PageSection>
    </main>
  )
}


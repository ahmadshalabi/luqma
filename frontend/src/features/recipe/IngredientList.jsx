import { Section } from '@/primitives/Section'

/**
 * IngredientList component displaying recipe ingredients with measurements.
 *
 * @param {Object} props - Component props
 * @param {Array} props.ingredients - Array of ingredient objects
 * @returns {JSX.Element} IngredientList component
 */
export function IngredientList({ ingredients }) {
  const isEmpty = !ingredients || ingredients.length === 0

  return (
    <Section
      title="Ingredients"
      isEmpty={isEmpty}
      emptyMessage="No ingredient information available."
    >
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <li
            key={ingredient.id || index}
            className="flex items-start gap-3 text-gray-700"
          >
            <span className="text-blue-600 mt-1 flex-shrink-0" aria-hidden="true">
              •
            </span>
            <span>
              {ingredient.amount && ingredient.amount > 0 && (
                <span className="font-medium">
                  {ingredient.amount.toFixed(ingredient.amount % 1 === 0 ? 0 : 1)}
                  {ingredient.unit && ` ${ingredient.unit}`}
                  {' - '}
                </span>
              )}
              <span>{ingredient.name || 'Unknown ingredient'}</span>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  )
}


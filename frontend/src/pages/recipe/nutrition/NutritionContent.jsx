import { NutritionCard } from './NutritionCard'

/**
 * NutritionContent component for displaying nutrition details grid.
 * Presentational component.
 * 
 * @param {Object} props
 * @param {Object} props.nutrition - Nutrition data object
 */
export function NutritionContent({ nutrition }) {
  const {
    calories = 0,
    protein = 0,
    fat = 0,
    carbohydrates = 0,
    fiber = 0,
    percentProtein = 0,
    percentFat = 0,
    percentCarbs = 0
  } = nutrition

  return (
    <div className="p-3 md:p-5 pt-3 md:pt-4 border-t border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {calories > 0 && (
          <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-blue-100 p-3 md:p-4 rounded-lg border border-blue-200">
            <div className="text-center">
              <span className="text-xs font-medium text-blue-900 uppercase tracking-wide block mb-1">Calories</span>
              <span className="text-2xl md:text-3xl font-bold text-blue-900 block">
                {calories.toFixed(0)}
              </span>
              <span className="text-xs text-blue-700">kcal</span>
            </div>
          </div>
        )}

        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {protein > 0 && (
            <NutritionCard
              label="Protein"
              value={protein}
              percentage={percentProtein}
              color="green"
            />
          )}

          {fat > 0 && (
            <NutritionCard
              label="Fat"
              value={fat}
              percentage={percentFat}
              color="orange"
            />
          )}

          {carbohydrates > 0 && (
            <NutritionCard
              label="Carbs"
              value={carbohydrates}
              percentage={percentCarbs}
              color="blue"
            />
          )}

          {fiber > 0 && (
            <NutritionCard
              label="Fiber"
              value={fiber}
              percentage={20}
              percentageLabel="Essential"
              color="purple"
            />
          )}
        </div>
      </div>
    </div>
  )
}


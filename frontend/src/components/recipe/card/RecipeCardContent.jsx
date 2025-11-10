/**
 * RecipeCardContent primitive component for displaying recipe title.
 * Presentational component.
 * 
 * @param {Object} props
 * @param {string} props.title - Recipe title
 */
export function RecipeCardContent({ title }) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
        {title}
      </h3>
    </div>
  )
}


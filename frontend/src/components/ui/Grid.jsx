/**
 * Grid component for consistent responsive grid layouts.
 * Provides column-based layouts with responsive breakpoints.
 * 
 * Note: Uses explicit class mappings instead of dynamic template literals
 * to ensure Tailwind's JIT compiler can detect and generate the classes.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Grid items
 * @param {Object|number} [props.cols] - Column configuration (object for responsive or number for static)
 * @param {number} [props.cols.default=1] - Default columns (mobile)
 * @param {number} [props.cols.sm] - Columns at sm breakpoint (640px)
 * @param {number} [props.cols.md] - Columns at md breakpoint (768px)
 * @param {number} [props.cols.lg] - Columns at lg breakpoint (1024px)
 * @param {number} [props.cols.xl] - Columns at xl breakpoint (1280px)
 * @param {number} [props.gap=6] - Gap size (in Tailwind spacing scale: 0-96)
 * @param {string} [props.as='div'] - HTML element to render
 * @param {string} [props.className] - Additional CSS classes
 */
export function Grid({
  children,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 6,
  as: Element = 'div',
  className = '',
  ...rest
}) {
  // Handle both object and number formats for cols
  const colConfig = typeof cols === 'number' 
    ? { default: cols } 
    : { default: 1, ...cols }
  
  // Build responsive column classes
  const buildColClass = (breakpoint, colCount) => {
    if (!colCount) return ''
    
    // Map column counts to explicit Tailwind classes for JIT compiler
    const colMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    }
    
    const colClass = colMap[colCount]
    if (!colClass) return ''
    
    const prefix = breakpoint === 'default' ? '' : `${breakpoint}:`
    return `${prefix}${colClass}`
  }
  
  const colClasses = [
    buildColClass('default', colConfig.default),
    buildColClass('sm', colConfig.sm),
    buildColClass('md', colConfig.md),
    buildColClass('lg', colConfig.lg),
    buildColClass('xl', colConfig.xl),
  ].filter(Boolean).join(' ')
  
  // Map gap values to explicit Tailwind classes for JIT compiler
  const gapMap = {
    0: 'gap-0',
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    7: 'gap-7',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12',
    16: 'gap-16',
    20: 'gap-20',
    24: 'gap-24',
  }
  
  const gapClass = gapMap[gap] || 'gap-6'
  
  const gridClasses = `
    grid
    ${colClasses}
    ${gapClass}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <Element className={gridClasses} {...rest}>
      {children}
    </Element>
  )
}


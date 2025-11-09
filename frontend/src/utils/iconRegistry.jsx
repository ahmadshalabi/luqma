/**
 * Centralized icon registry for consistent icon usage across components.
 * Maps string names to Heroicon components.
 * 
 * @module iconRegistry
 */

import { 
  MagnifyingGlassIcon, 
  CheckCircleIcon, 
  XMarkIcon,
  LightBulbIcon,
  ClockIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const ICON_REGISTRY = {
  search: MagnifyingGlassIcon,
  arrowLeft: ArrowLeftIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  bars: Bars3Icon,
  checkCircle: CheckCircleIcon,
  xMark: XMarkIcon,
  close: XMarkIcon,
  exclamationTriangle: ExclamationTriangleIcon,
  exclamationCircle: ExclamationCircleIcon,
  lightbulb: LightBulbIcon,
  clock: ClockIcon,
  users: UsersIcon,
  chartBar: ChartBarIcon
}

/**
 * Icon component that renders the appropriate Heroicon based on the name prop.
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - Name of the icon
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Icon component
 * 
 * @example
 * <Icon name="search" className="w-5 h-5" />
 */
export function Icon({ name, className, ...props }) {
  const IconComponent = ICON_REGISTRY[name] || LightBulbIcon
  return <IconComponent className={className} {...props} />
}

/**
 * Get an icon component by name.
 * Returns LightBulbIcon as fallback if icon name not found.
 * 
 * @deprecated Use the Icon component instead
 * @param {string} iconName - Name of the icon
 * @returns {React.Component} Heroicon component
 */
export function getIcon(iconName) {
  return ICON_REGISTRY[iconName] || LightBulbIcon
}

/**
 * Check if an icon name exists in the registry.
 * 
 * @param {string} iconName - Name of the icon to check
 * @returns {boolean} True if icon exists in registry
 * 
 * @example
 * hasIcon('search') // Returns true
 * hasIcon('invalid') // Returns false
 */
export function hasIcon(iconName) {
  return iconName in ICON_REGISTRY
}

/**
 * Get all available icon names.
 * 
 * @returns {string[]} Array of icon names
 */
export function getAvailableIcons() {
  return Object.keys(ICON_REGISTRY)
}


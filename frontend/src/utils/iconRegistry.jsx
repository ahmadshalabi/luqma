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
  ChevronDownIcon,
  UsersIcon,
  ChartBarIcon,
  InformationCircleIcon,
  MinusIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

const ICON_REGISTRY = {
  search: MagnifyingGlassIcon,
  arrowLeft: ArrowLeftIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  chevronDown: ChevronDownIcon,
  bars: Bars3Icon,
  checkCircle: CheckCircleIcon,
  xMark: XMarkIcon,
  close: XMarkIcon,
  exclamationTriangle: ExclamationTriangleIcon,
  exclamationCircle: ExclamationCircleIcon,
  info: InformationCircleIcon,
  lightbulb: LightBulbIcon,
  clock: ClockIcon,
  users: UsersIcon,
  chartBar: ChartBarIcon,
  chart: ChartBarIcon,
  minus: MinusIcon,
  image: PhotoIcon
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


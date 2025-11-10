/**
 * UI Constants
 * 
 * Centralized constants for UI behavior and styling.
 */

/**
 * Pagination configuration
 */
export const PAGINATION = {
  /** Default items per page for recipe search */
  DEFAULT_PAGE_SIZE: 9,
  /** Minimum page number */
  MIN_PAGE: 1,
  /** Maximum visible page numbers in pagination */
  MAX_VISIBLE_PAGES: 7
}

/**
 * Touch target sizes for mobile accessibility (in pixels)
 */
export const TOUCH_TARGET = {
  /** Minimum height for mobile touch targets (WCAG AAA) */
  MIN_HEIGHT_MOBILE: 44,
  /** Minimum width for mobile touch targets */
  MIN_WIDTH_MOBILE: 44,
  /** Standard desktop height */
  HEIGHT_DESKTOP: 40
}

/**
 * Animation and timing constants (in milliseconds)
 */
export const ANIMATION = {
  /** Duration for collapsible animations */
  COLLAPSE_DURATION: 600,
  /** Duration for fade animations */
  FADE_DURATION: 300,
  /** Delay for tooltip appearance */
  TOOLTIP_DELAY: 500
}

/**
 * Z-index layers for consistent stacking context
 */
export const Z_INDEX = {
  /** Base layer */
  BASE: 0,
  /** Dropdowns and popovers */
  DROPDOWN: 1000,
  /** Sticky elements */
  STICKY: 1020,
  /** Fixed navigation */
  FIXED: 1030,
  /** Modal backdrop */
  MODAL_BACKDROP: 1040,
  /** Modal content */
  MODAL: 1050,
  /** Notifications/toasts */
  TOAST: 1060,
  /** Tooltips */
  TOOLTIP: 1070
}

/**
 * Breakpoints (must match Tailwind config)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}

/**
 * Grid configuration
 */
export const GRID = {
  /** Gap between grid items */
  DEFAULT_GAP: 6,
  /** Recipe card grid columns */
  RECIPE_COLS: {
    DEFAULT: 1,
    SM: 2,
    LG: 3
  }
}


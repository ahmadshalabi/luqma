import { useMobileMenu } from '@/hooks/useMobileMenu'
import { SkipLink } from './SkipLink'
import { HeaderLogo } from './HeaderLogo'
import { HeaderNav } from './HeaderNav'
import { HeaderMobileMenu } from './HeaderMobileMenu'
import { HeaderMobileMenuToggle } from './HeaderMobileMenuToggle'

const navigationLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' }
]

/**
 * Header component - Main application header with navigation.
 * 
 * Combines reusable header components to create a responsive navigation system.
 * Includes skip link for accessibility, logo, desktop/mobile navigation, and mobile menu toggle.
 */
export const Header = () => {
  const { isOpen, toggle, close } = useMobileMenu()

  return (
    <>
      <SkipLink />
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <HeaderLogo />
            <HeaderNav links={navigationLinks} />
            <HeaderMobileMenuToggle isOpen={isOpen} onToggle={toggle} />
          </div>
          {isOpen && <HeaderMobileMenu links={navigationLinks} onClose={close} />}
        </div>
      </header>
    </>
  )
}

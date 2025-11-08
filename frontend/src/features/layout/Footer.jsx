export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-gray-600">
          &copy; {currentYear} Luqma. All rights reserved.
        </p>
      </div>
    </footer>
  )
}


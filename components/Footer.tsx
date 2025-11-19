export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-gray-600 text-sm">
          © {currentYear} MayIMeetYou.io
        </p>
      </div>
    </footer>
  )
}

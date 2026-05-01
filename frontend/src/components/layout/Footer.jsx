import { useTheme } from '../../context/ThemeContext'

function Footer() {
  const { darkMode } = useTheme()

  return (
    <footer className={`text-center py-6 text-sm mt-10 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
      <p>© {new Date().getFullYear()} Crave Food. Made with ❤️ for food lovers.</p>
    </footer>
  )
}

export default Footer

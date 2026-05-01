import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

function Avatar({ src, name, size = 'md', className = '', showRing = true }) {
  const { darkMode } = useTheme()

  const sizes = {
    xs: { box: 'w-7 h-7', text: 'text-[10px]', ring: 'p-[1.5px]' },
    sm: { box: 'w-9 h-9', text: 'text-xs', ring: 'p-[2px]' },
    md: { box: 'w-11 h-11', text: 'text-sm', ring: 'p-[2px]' },
    lg: { box: 'w-16 h-16', text: 'text-xl', ring: 'p-[2.5px]' },
    xl: { box: 'w-24 h-24', text: 'text-3xl', ring: 'p-[3px]' },
    '2xl': { box: 'w-32 h-32', text: 'text-5xl', ring: 'p-[3px]' },
  }

  const s = sizes[size] || sizes.md
  const initial = name?.charAt(0)?.toUpperCase() || '?'

  return (
    <div
      className={`${s.box} shrink-0 rounded-full ${showRing ? `bg-gradient-to-br from-red-500 via-orange-500 to-amber-400 ${s.ring}` : ''} ${className}`}
    >
      <div
        className={`w-full h-full rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold uppercase overflow-hidden ${
          showRing ? (darkMode ? 'ring-1 ring-[#0c0c18]' : 'ring-1 ring-white') : ''
        }`}
      >
        {src ? (
          <img src={src} alt={name || ''} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className={s.text}>{initial}</span>
        )}
      </div>
    </div>
  )
}

export default Avatar
import { useTheme } from '../../context/ThemeContext'

function CardSkeleton({ count = 4, layout = 'grid' }) {
  const { darkMode } = useTheme()
  const skBg = darkMode ? 'bg-white/5' : ''

  if (layout === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-4 rounded-2xl border ${
              darkMode ? 'bg-white/[0.03] border-white/5' : 'bg-white/70 border-black/5'
            }`}
          >
            <div className={`w-11 h-11 rounded-xl skeleton shrink-0 ${skBg}`} />
            <div className="flex-1 space-y-2">
              <div className={`h-3.5 w-3/4 rounded-full skeleton ${skBg}`} />
              <div className={`h-2.5 w-1/2 rounded-full skeleton ${skBg}`} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-3xl overflow-hidden border ${
            darkMode ? 'bg-white/[0.03] border-white/5' : 'bg-white/70 border-black/5'
          }`}
        >
          <div className={`h-40 skeleton ${skBg}`} />
          <div className="p-4 space-y-2">
            <div className={`h-4 w-32 rounded-lg skeleton ${skBg}`} />
            <div className={`h-3 w-24 rounded-lg skeleton ${skBg}`} />
            <div className={`h-3 w-40 rounded-lg skeleton ${skBg}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CardSkeleton

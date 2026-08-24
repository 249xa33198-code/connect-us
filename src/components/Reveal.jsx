import { useEffect, useRef, useState } from 'react'

/**
 * Wraps children and fades/slides them in once they scroll into view.
 * Respects prefers-reduced-motion (handled globally in index.css, but we
 * also skip the initial hidden state here so nothing gets stuck invisible
 * if JS is slow to attach the observer).
 *
 * Usage: <Reveal><section>...</section></Reveal>
 * Optional delay (ms) to stagger multiple items: <Reveal delay={150}>
 */
export default function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // animate once, don't re-trigger on scroll back up
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

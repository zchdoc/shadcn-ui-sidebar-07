import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Hook to detect if the screen is mobile size.
 * Returns an object with `isMobile` (boolean) and `isMounted` (boolean).
 * `isMounted` is true only after the component has mounted on the client,
 * ensuring `isMobile` reflects the actual client state post-hydration.
 */
export function useIsMobile() {
  const [isMounted, setIsMounted] = React.useState(false)
  // Default to false for SSR and initial client render
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // Component is now mounted on the client
    setIsMounted(true)

    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check after mount
    checkDevice()

    // Listener for resize changes
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener('change', checkDevice)

    // Cleanup
    return () => {
      mql.removeEventListener('change', checkDevice)
    }
  }, [])

  // Return both values
  return { isMobile, isMounted }
}

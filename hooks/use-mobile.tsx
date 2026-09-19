import { useEffect, useState } from "react";

/**
 * True below the given breakpoint.
 *
 * Uses `matchMedia`, which only fires when the breakpoint is actually crossed.
 * The previous implementation called `setState` on every `resize` event, so
 * dragging a desktop window triggered dozens of re-renders.
 *
 * Note this still starts `false` on the server and on the first client render —
 * so never use it to pick which image to render. Do that with CSS, or the
 * browser downloads the desktop asset before hydration and the mobile one
 * after.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    onChange(mql);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return isMobile;
}

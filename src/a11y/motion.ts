/** "auto" when the reader asked the system for reduced motion, otherwise "smooth". */
export function scrollBehavior(
  prefersReducedMotion: () => boolean = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
): ScrollBehavior {
  return prefersReducedMotion() ? "auto" : "smooth";
}

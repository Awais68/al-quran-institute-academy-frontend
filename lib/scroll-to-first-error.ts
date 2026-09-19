/**
 * Bring the first invalid control into view after a failed submit.
 *
 * Red borders only help if the user can see them — on a long form (or a form
 * scrolled inside a modal) the field that failed is often off-screen, so the
 * submit looks like it did nothing at all.
 *
 * Matches either marker: `aria-invalid="true"` on the control itself, or
 * `data-field-error="true"` on a wrapper around a third-party widget that
 * renders its own markup (phone input, datepicker, country selector).
 *
 * Call it right after setting the error state. The state update from a submit
 * handler is flushed before the next frame, so the rAF callback already sees
 * the highlighted fields in the DOM.
 *
 * @param container Scope the search to one form. Omit to search the document.
 */
export function scrollToFirstError(container?: HTMLElement | null) {
  if (typeof window === "undefined") return;

  requestAnimationFrame(() => {
    const root: ParentNode = container ?? document;
    const target = root.querySelector<HTMLElement>(
      '[data-field-error="true"], [aria-invalid="true"]'
    );
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });
    // preventScroll: scrollIntoView above already owns the scrolling, and
    // focus() would otherwise jump the element to the edge of the viewport.
    target.focus({ preventScroll: true });
  });
}

import '@testing-library/jest-dom'

// ---------- IntersectionObserver mock ----------
// Sidebar.tsx uses IntersectionObserver. jsdom doesn't implement it.
// We expose triggerIntersection() so component tests can simulate observer callbacks.

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void

const observerCallbacks = new Map<Element, ObserverCallback>()

class MockIntersectionObserver {
  constructor(private callback: ObserverCallback) {}

  observe(el: Element) {
    observerCallbacks.set(el, this.callback)
  }
  unobserve(el: Element) {
    observerCallbacks.delete(el)
  }
  disconnect() {
    observerCallbacks.clear()
  }
  takeRecords() { return [] }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(global as any).IntersectionObserver = MockIntersectionObserver

/** Simulate a heading entering or leaving the observed viewport area. */
export function triggerIntersection(element: Element, isIntersecting: boolean) {
  const cb = observerCallbacks.get(element)
  if (!cb) return
  cb([{ target: element, isIntersecting } as IntersectionObserverEntry])
}

// ---------- window.matchMedia mock ----------
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

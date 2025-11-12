// Detecta clicks/touches fuera de un elemento contenedor y ejecuta una callback
import type { Ref } from 'vue'

export function useClickOutside(
  containerRef: Ref<HTMLElement | null>,
  onOutside: () => void,
  opts: { listenToEscape?: boolean; events?: string[] } = {}
) {
  const events = opts.events || ['pointerdown', 'touchstart']
  const listenToEscape = opts.listenToEscape ?? true

  function handler(e: Event) {
    const el = containerRef.value
    if (!el) return

    let path: EventTarget[] = []
    const anyEvent = e as any
    if (typeof anyEvent.composedPath === 'function') {
      path = anyEvent.composedPath()
    } else if (Array.isArray(anyEvent.path)) {
      path = anyEvent.path
    } else {
      let node: Node | null = (e.target as Node) || null
      while (node) {
        path.push(node)
        node = node.parentNode
      }
      path.push(document)
      path.push(window)
    }

    const target = (e.target as Node) || null
    const clickedInside = path.includes(el) || (target && el.contains(target))
    if (!clickedInside) onOutside()
  }

  function onKeydown(e: KeyboardEvent) {
    if (listenToEscape && e.key === 'Escape') {
      onOutside()
    }
  }

  function start() {
    events.forEach((ev) => document.addEventListener(ev, handler))
    if (listenToEscape) document.addEventListener('keydown', onKeydown)
  }

  function stop() {
    events.forEach((ev) => document.removeEventListener(ev, handler))
    if (listenToEscape) document.removeEventListener('keydown', onKeydown)
  }

  // auto-start
  start()

  return { stop }
}

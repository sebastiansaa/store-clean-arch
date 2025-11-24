import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMiniCartStore } from '../useMiniCartStore'

// Mock del logger
vi.mock('@/shared/services/logger', () => ({
    logger: {
        debug: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
    },
}))

describe('useMiniCartStore', () => {
    let store: ReturnType<typeof useMiniCartStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        store = useMiniCartStore()
    })

    describe('Estado inicial', () => {
        it('debe inicializar con estado "closed"', () => {
            expect(store.state).toBe('closed')
            expect(store.isOpen).toBe(false)
            expect(store.isMini).toBe(false)
            expect(store.isExpanded).toBe(false)
        })
    })

    describe('openMini', () => {
        it('debe cambiar el estado a "mini"', () => {
            store.openMini()

            expect(store.state).toBe('mini')
            expect(store.isOpen).toBe(true)
            expect(store.isMini).toBe(true)
            expect(store.isExpanded).toBe(false)
        })
    })

    describe('openExpanded', () => {
        it('debe cambiar el estado a "expanded"', () => {
            store.openExpanded()

            expect(store.state).toBe('expanded')
            expect(store.isOpen).toBe(true)
            expect(store.isMini).toBe(false)
            expect(store.isExpanded).toBe(true)
        })
    })

    describe('expand', () => {
        it('debe expandir desde "mini" a "expanded"', () => {
            store.openMini()
            expect(store.state).toBe('mini')

            store.expand()
            expect(store.state).toBe('expanded')
            expect(store.isExpanded).toBe(true)
        })

        it('no debe cambiar el estado si ya está "closed"', () => {
            expect(store.state).toBe('closed')

            store.expand()

            expect(store.state).toBe('closed') // No debería cambiar
        })

        it('no debe cambiar el estado si ya está "expanded"', () => {
            store.openExpanded()
            expect(store.state).toBe('expanded')

            store.expand()

            expect(store.state).toBe('expanded') // Debe permanecer igual
        })
    })

    describe('close', () => {
        it('debe cerrar desde estado "mini"', () => {
            store.openMini()
            expect(store.isOpen).toBe(true)

            store.close()

            expect(store.state).toBe('closed')
            expect(store.isOpen).toBe(false)
        })

        it('debe cerrar desde estado "expanded"', () => {
            store.openExpanded()
            expect(store.isOpen).toBe(true)

            store.close()

            expect(store.state).toBe('closed')
            expect(store.isOpen).toBe(false)
        })

        it('no debe tener problema si se llama cuando ya está cerrado', () => {
            expect(store.state).toBe('closed')

            store.close()

            expect(store.state).toBe('closed')
        })
    })

    describe('resetStore', () => {
        it('debe resetear el store a estado cerrado', () => {
            store.openExpanded()
            expect(store.state).toBe('expanded')

            store.resetStore()

            expect(store.state).toBe('closed')
            expect(store.isOpen).toBe(false)
        })
    })

    describe('Getters computados', () => {
        it('isOpen debe ser true cuando el estado es "mini"', () => {
            store.openMini()
            expect(store.isOpen).toBe(true)
        })

        it('isOpen debe ser true cuando el estado es "expanded"', () => {
            store.openExpanded()
            expect(store.isOpen).toBe(true)
        })

        it('isOpen debe ser false cuando el estado es "closed"', () => {
            expect(store.isOpen).toBe(false)
        })

        it('isMini debe ser true solo cuando el estado es "mini"', () => {
            expect(store.isMini).toBe(false)

            store.openMini()
            expect(store.isMini).toBe(true)

            store.expand()
            expect(store.isMini).toBe(false)
        })

        it('isExpanded debe ser true solo cuando el estado es "expanded"', () => {
            expect(store.isExpanded).toBe(false)

            store.openExpanded()
            expect(store.isExpanded).toBe(true)

            store.close()
            expect(store.isExpanded).toBe(false)
        })
    })

    describe('Flujos de navegación', () => {
        it('flujo: closed -> mini -> expanded -> closed', () => {
            expect(store.state).toBe('closed')

            store.openMini()
            expect(store.state).toBe('mini')

            store.expand()
            expect(store.state).toBe('expanded')

            store.close()
            expect(store.state).toBe('closed')
        })

        it('flujo: closed -> expanded -> closed', () => {
            expect(store.state).toBe('closed')

            store.openExpanded()
            expect(store.state).toBe('expanded')

            store.close()
            expect(store.state).toBe('closed')
        })
    })
})

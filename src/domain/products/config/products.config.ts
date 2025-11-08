import { SHARED_CONFIG } from '../../../shared/config/shared.config'

// Configuración específica de productos (no compartida)
export const PRODUCTS_CONFIG = {
  // Reutilizar configuración compartida
  ...SHARED_CONFIG,

  // Query keys específicos para productos
  api: {
    ...SHARED_CONFIG.api,
    queryKeys: {
      all: ['products'],
      byId: (id: string) => ['products', id],
      byCategory: (category: string) => ['products', 'category', category],
    }
  },

  // Estilos específicos de productos (Design tokens)
  styles: {
    shadows: {
      none: 'none',
      small: '0 1px 3px rgba(0, 0, 0, 0.04)',
      base: '0 2px 8px rgba(0, 0, 0, 0.06)',
      medium: '0 4px 12px rgba(0, 0, 0, 0.08)',
      large: '0 8px 24px rgba(0, 0, 0, 0.12)',
      xlarge: '0 16px 48px rgba(0, 0, 0, 0.16)',
      // Alias semánticos para contextos específicos
      card: '0 2px 8px rgba(0, 0, 0, 0.06)',
      cardHover: '0 8px 24px rgba(0, 0, 0, 0.12)',
    },
    borderRadius: {
      card: '12px',
      image: '8px',
      thumbnail: '6px',
      button: '50%',
    },
    transitions: {
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.8s',
      easing: 'ease',
      easingSmooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    spacing: {
      gap: {
        xs: '0.25rem',
        small: '0.5rem',
        medium: '1rem',
        large: '1.5rem',
        xlarge: '2rem',
        xxlarge: '3rem',
      },
      padding: {
        small: '0.5rem',
        medium: '1rem',
        large: '1.5rem',
        xlarge: '2rem',
      },
    },
  },

  // Configuración de carousels
  carousel: {
    relatedProducts: {
      desktop: {
        visibleCount: 3,      // productos visibles simultáneamente
        maxResults: 8,        // máximo de productos relacionados a cargar
      },
      mobile: {
        visibleWidth: '65%',  // ancho de cada card para efecto 1.5 productos
        maxResults: 8,
      },
    },
  },


} as const



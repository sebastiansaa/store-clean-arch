# practicaeco

**Ecommerce moderno sin usuarios, solo comprar.**

Este proyecto es una tienda online construida con Vue 3, Pinia, Vite y TanStack Query, que permite explorar productos, navegar por categorías, agregar al carrito y simular el proceso de compra y pago, todo sin autenticación ni gestión de usuarios. El objetivo es demostrar una arquitectura limpia, modular y profesional, enfocada en la experiencia de compra directa y el código mantenible.

## Características principales

- Navegación profesional y dinámica por categorías (consumidas desde API)
- Visualización de productos filtrados por categoría
- Carrito de compras funcional
- Simulación de proceso de pago
- Sin registro ni login: cualquier visitante puede comprar
- Arquitectura limpia, modular y DRY
- Uso de Vue 3, Pinia, Vue Router, TanStack Query, Axios, Vee-Validate, Zod, Toastification y Heroicons

## Requisitos

- Node.js ^20.19.0 o >=22.12.0
- npm

## Instalación

```bash
npm install
```

## Scripts

- `npm run dev` — Inicia el servidor de desarrollo (Vite)
- `npm run build` — Compila el proyecto para producción
- `npm run preview` — Previsualiza el build de producción
- `npm run lint` — Linting con ESLint
- `npm run format` — Formatea el código con Prettier
- `npm run type-check` — Verifica tipos con TypeScript

## Estructura principal

```
src/
  components/
  views/
  router/
  stores/
  shared/
  App.vue
  main.ts
public/
```

## Tecnologías

- Vue 3
- Pinia
- Vue Router
- Vite
- **TypeScript** (tipado estricto en toda la app)
- Axios
- TanStack Vue Query
- Vee-Validate + Zod
- Heroicons
- Vue Toastification

## Uso de TypeScript

Todo el proyecto está desarrollado con TypeScript, incluyendo componentes, stores y composables. Se recomienda usar un editor con soporte para TS (como VS Code) para aprovechar el tipado y la autocompletación.

## Para decisiones de diseño y arquitectura consulta `DECISIONS.md`.

> Proyecto para práctica de arquitectura limpia, navegación y tipado estricto en Vue 3.

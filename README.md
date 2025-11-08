# practicaeco

Ecommerce simple hecho con Vue 3, Pinia y Vite. Esta app permite explorar productos y categorías, agregar al carrito y navegar entre secciones, todo sin autenticación ni lógica de usuario. El enfoque es una arquitectura limpia, navegación clara y código mantenible.

## Descripción

Esta aplicación es una tienda online de ejemplo, pensada para practicar buenas prácticas de arquitectura en Vue 3. No incluye autenticación ni gestión de usuarios: cualquier visitante puede navegar, buscar productos y simular compras. El objetivo es mantener el código simple, directo y fácil de mantener.

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

---

> Proyecto para práctica de arquitectura limpia, navegación y tipado estricto en Vue 3.

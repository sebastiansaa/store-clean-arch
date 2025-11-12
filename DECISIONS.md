# DECISIONS

Este archivo documenta decisiones de diseño y arquitectura tomadas durante el desarrollo del proyecto. Está destinado a ayudar a futuros mantenedores a entender por qué se eligieron ciertas soluciones.

## Dropdown de búsqueda — "mostrar más" (SearchDropdown)

- Decisión
  - Mantener la lógica de "mostrar más" (incremental, p. ej. +5) dentro del componente `SearchDropdown` (componente hijo), y no mover esa responsabilidad al composable `useSearch` ni al componente padre.

- Motivación
  - El proyecto actualmente maneja un volumen reducido de productos; mantener la lógica en el componente favorece la simplicidad, el encapsulamiento y evita cambios innecesarios en la capa de datos.
  - La lógica no es reutilizable en otras partes de la app por ahora, por lo que centralizarla no aporta ventajas inmediatas.

- Consecuencia práctica
  - `useSearch` devuelve los matches completos (filtrado local) y `SearchDropdown` decide cuántos renderizar y cuándo expandir la lista.
  - El componente controla su propio estado (p. ej. `shownCount`) y lo reinicia cuando cambia el término de búsqueda o se cierra el dropdown.

- Consideraciones futuras
  - Si el conjunto de datos crece significativamente o se requiere paginación en backend, considerar trasladar la responsabilidad al composable `useSearch` (con `limit`/`page` y `loadMore`) o exponer `initialLimit`/`increment` como props en `SearchDropdown`.
  - Documentar cualquier cambio de esa política en este archivo.

---

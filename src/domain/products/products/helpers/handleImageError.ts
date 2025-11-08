//manejar errores de carga de imágenes en aplicaciones web

export const handleImageError = (
  event: Event,
  fallbackSrc: string = '/placeholder.jpg'
): void => {
  const target = event.target as HTMLImageElement
  //prevenir bucle infinito de errores
  if (target && target.src !== fallbackSrc) {
    target.src = fallbackSrc
  }
}

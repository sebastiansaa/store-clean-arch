

export const truncate = (text: string, max: number): string => {
  return text.length > max ? text.substring(0, max) + '...' : text;
}


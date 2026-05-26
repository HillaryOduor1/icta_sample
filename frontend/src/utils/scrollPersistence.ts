export function saveScrollPosition(y: number): void {
  try {
    sessionStorage.setItem('scrollY', y.toString());
  } catch(error) {
    console.error('Failed to save scroll position', error);
  }
}

export function restoreScrollPosition(): void {
  try {
    const y = sessionStorage.getItem('scrollY');
    if (y !== null) window.scrollTo(0, parseInt(y, 10));
    sessionStorage.removeItem('scrollY');
  } catch(error) {
    console.error('Failed to restore scroll position', error);
  }
}
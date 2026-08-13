export function useDocumentVisibility(): 'visible' | 'hidden' {
  return document.visibilityState
}

// lib/comparison-state.ts
// Utility functions for managing program comparison state

export function getComparisonIdsFromUrl(
  searchParams: URLSearchParams
): number[] {
  const idsParam = searchParams.get("ids");
  if (!idsParam) return [];

  return idsParam
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id) && id > 0)
    .slice(0, 4); // Max 4 programs
}

export function getComparisonIdsFromStorage(): number[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem("comparison-ids");
    if (!stored) return [];

    const ids = JSON.parse(stored);
    return Array.isArray(ids) ? ids.slice(0, 4) : [];
  } catch {
    return [];
  }
}

export function saveComparisonIdsToStorage(ids: number[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("comparison-ids", JSON.stringify(ids.slice(0, 4)));
  } catch {
    // Ignore localStorage errors
  }
}

export function addProgramToComparison(
  currentIds: number[],
  newId: number
): number[] {
  if (currentIds.includes(newId)) return currentIds;
  if (currentIds.length >= 4) return currentIds;

  return [...currentIds, newId];
}

export function removeProgramFromComparison(
  currentIds: number[],
  idToRemove: number
): number[] {
  return currentIds.filter((id) => id !== idToRemove);
}

export function buildCompareUrl(ids: number[]): string {
  if (ids.length === 0) return "/compare";
  return `/compare?ids=${ids.join(",")}`;
}

export function getComparisonIds(searchParams: URLSearchParams): number[] {
  const urlIds = getComparisonIdsFromUrl(searchParams);
  if (urlIds.length > 0) {
    // URL takes precedence, save to localStorage
    saveComparisonIdsToStorage(urlIds);
    return urlIds;
  }

  // Fallback to localStorage
  return getComparisonIdsFromStorage();
}

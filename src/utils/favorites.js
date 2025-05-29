const FAVORITES_KEY = "favorites";

export function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

export function toggleFavorite(id) {
  const favorites = getFavorites();
  const updated = favorites.includes(id)
    ? favorites.filter((favId) => favId !== id)
    : [...favorites, id];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.includes(id);
}
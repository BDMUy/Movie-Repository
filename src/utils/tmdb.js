export async function fetchFromTMDb(path, query = {}) {
    const searchParams = new URLSearchParams(query).toString();
    const response = await fetch(`/api/tmdb?path=${path}&${searchParams}`);
    if (!response.ok) throw new Error('Error al cargar datos');
    return await response.json();
  }
  
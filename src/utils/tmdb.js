export async function fetchFromTMDb(path, query = {}) {
  const searchParams = new URLSearchParams(query).toString();

  // Usa la variable del entorno (CRA la inyecta si empieza con REACT_APP_)
  const baseUrl = process.env.REACT_APP_API_URL || '';

  const response = await fetch(`${baseUrl}/api/tmdb?path=${path}&${searchParams}`);

  const contentType = response.headers.get("content-type");
  if (!response.ok || !contentType?.includes("application/json")) {
    const text = await response.text();
    console.error("❌ Respuesta inesperada:", text);
    throw new Error("Respuesta no válida desde el backend");
  }

  return await response.json();
}

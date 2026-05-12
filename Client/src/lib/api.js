// Helper centralizado para llamar al API.
// - Lee la URL del API desde una variable de entorno (.env).
//   Así no tenemos que cambiar 5 archivos cuando subamos a producción.
// - Adjunta automáticamente el token JWT del admin si existe en localStorage.
// - Si el servidor responde 401 (token vencido/inválido), borra el token
//   y manda al usuario al login.

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5286/api";

// Base del servidor sin "/api". La usamos para mostrar imágenes y archivos
// que el backend devuelve como rutas relativas (ej: "/uploads/foo.jpg").
export const FILES_BASE = API_URL.replace(/\/api\/?$/, "");

// Devuelve los headers con el token Authorization si hay sesión.
// IMPORTANTE: NO ponemos Content-Type aquí porque para FormData (subir imágenes)
// el navegador debe poner el boundary automáticamente. Si vas a mandar JSON,
// agrega "Content-Type": "application/json" tú mismo en el fetch.
export function authHeaders() {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Wrapper alrededor de fetch:
//  - Le pega el token automáticamente
//  - Si recibe 401, cierra sesión y redirige al login
export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  // Token vencido o sin permisos → forzar nuevo login
  if (response.status === 401) {
    localStorage.removeItem("adminToken");
    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }
  }

  return response;
}

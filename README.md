# 🎬 Movie Repository

Aplicación web inspirada en Netflix que permite explorar películas y series usando la API de [The Movie Database (TMDb)](https://www.themoviedb.org/).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React, React Router, Framer Motion
- **Backend**: Node.js, Express (servidor proxy para ocultar API Key)
- **Estilos**: CSS Modularizado
- **Consumo de datos**: API TMDb
- **Diseño Responsive**: Adaptado a móvil, tablet y desktop

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/movie-repository.git
cd movie-repository
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Crear archivo `.env` en la raíz del proyecto

```bash
TMDB_API_KEY=tu_api_key_de_tmdb
PORT_BACK=5000
REACT_APP_API_URL=http://localhost:5000
```

> Podés obtener una clave en: https://www.themoviedb.org/settings/api
> También podés copiar el archivo `.env.example` incluido y renombrarlo como `.env`.

### 4. Iniciar el servidor backend

```bash
node src/server.js
```

### 5. Iniciar el frontend

```bash
npm start
```

> Abre `http://localhost:5000` en tu navegador.

---

## 🌐 Estructura de Rutas

| Ruta            | Descripción                        |
|-----------------|------------------------------------|
| `/`             | Página de inicio                   |
| `/movies`       | Listado de películas               |
| `/series`       | Listado de series                  |
| `/movie/:id`    | Detalle de una película            |
| `/serie/:id`    | Detalle de una serie               |
| `*`             | Página 404 (ruta inexistente)      |

---

## 🧩 Características Destacadas

- Banners automáticos con animaciones sincronizadas.
- Carruseles horizontales con scroll infinito y efectos hover.
- Visualización de calificación (rojo, amarillo, verde).
- Scroll de actores y plataformas donde ver.
- API centralizada vía backend (`/api/tmdb`).

---

## 📦 API

Este proyecto utiliza la API pública de [TMDb](https://www.themoviedb.org/).  
Todos los datos pertenecen a ellos.

---

## 🤝 Créditos

Creado por [Bruno Martinez](https://github.com/BDMUy) – 2025  
Proyecto personal con fines educativos y de práctica.
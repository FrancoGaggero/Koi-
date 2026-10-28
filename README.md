# Koi Educational Games — web del estudio

Web de [koigamingstudio.com](https://koigamingstudio.com), el sitio del perfil de desarrollador en
Google Play. Astro 6 + Tailwind 4, salida estática; Netlify la publica desde este repo
(`netlify.toml`).

## Comandos

| Comando           | Qué hace                                      |
| :---------------- | :-------------------------------------------- |
| `npm install`     | Instala dependencias                          |
| `npm run dev`     | Servidor local en `localhost:4321`            |
| `npm run build`   | Compila la web en `dist/`                     |
| `npm run preview` | Sirve `dist/` para revisarla antes de subirla |

## Dónde está cada cosa

- **Textos:** `src/i18n/es.ts` y `src/i18n/en.ts` (mismas claves). Español en `/`, inglés en `/en/`.
- **Datos del estudio:** `src/config.ts`: mail, perfil de Play, paquetes de las apps, links de
  privacidad y si cada app ya está publicada (`publicada: false` muestra "Muy pronto en Google Play").
- **Secciones:** `src/components/` (`Hero`, `Apps` + `AppCard`, `Proximamente`, `Nosotros`, `Contacto`).
- **Planeta 3D del hero:** `src/scripts/planeta.ts` (three.js, carga diferida desde
  `arrancarPlaneta.ts`). Los íconos que orbitan son los PNG de `src/assets/planeta/`.
- **Animaciones:** `src/scripts/motion.ts` (GSAP + ScrollTrigger). Con "reducir movimiento" no anima.
- **Imágenes:** `src/assets/` (Astro las pasa a WebP).
- **Videos:** `public/video/` (MP4 + WebM + póster). Se arman con HyperFrames en `video/<nombre>/`:
  `npx hyperframes render . -o ./renders/video.mp4` y después se pasan a la web con ffmpeg
  (720 px los cuadrados, 1280×720 el del estudio). Si falta un video, la tarjeta muestra la imagen de Capi.

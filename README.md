# Aether IPTV

Reproductor y gestor IPTV profesional (M3U, Xtream Codes, EPG XMLTV) para Smart TV, Android TV, móvil, tablet y escritorio.

## Requisitos

- Node.js 20+

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Elige **Explorar Demo** para probar con streams HLS públicos, o añade tu propia lista M3U / API Xtream autorizada.

## Producción

```bash
npm run build
npm run preview
```

## Notas

- Las credenciales Xtream se cifran con AES-GCM en el dispositivo.
- Las contraseñas no se escriben en el registro de diagnóstico.
- Utiliza únicamente fuentes para las que tengas autorización.

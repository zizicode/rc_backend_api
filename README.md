# Media Backend API

Backend para recepción, procesamiento y gestión de imágenes y videos.

## Características

- ✅ Subida de imágenes y videos
- ✅ Validación de tipos de archivo
- ✅ Límite de tamaño (90MB)
- ✅ Procesamiento automático de metadata
- ✅ Almacenamiento en PostgreSQL
- ✅ API para servir archivos
- ✅ Extracción de resolución y duración

## Instalación

\`\`\`bash
# Instalar dependencias
npm install

# Configurar base de datos (opcional)
npm run setup-db

# Desarrollo
npm run dev

# Producción
npm run build
npm start
\`\`\`

## Endpoints

### POST /api/media/upload
Subir archivo multimedia

**Body (form-data):**
- `file`: Archivo (imagen o video)
- `registered_by`: Usuario que sube el archivo (opcional)

**Respuesta:**
\`\`\`json
{
  "success": true,
  "message": "Archivo subido y procesado correctamente",
  "data": {
    "id": 1,
    "file_name": "video.mp4",
    "file_path": "/path/to/file",
    "file_type": "video",
    "mime_type": "video/mp4",
    "file_size": 15728640,
    "resolution": "1920x1080",
    "duration_seconds": 30,
    "registered_by": "user123",
    "created_at": "2024-01-01T12:00:00Z"
  }
}
\`\`\`

### GET /api/media/files
Obtener lista de todos los archivos

### GET /api/media/files/:id
Obtener información de un archivo específico

### GET /api/media/serve/:id
Servir archivo para visualización/descarga

## Tipos de archivo soportados

**Imágenes:**
- JPEG, JPG, PNG, GIF, WebP, BMP, TIFF

**Videos:**
- MP4, AVI, MOV, WMV, FLV, WebM, MKV, M4V

## Configuración

La base de datos PostgreSQL debe estar configurada en:
- Host: 172.19.0.6
- Puerto: 5432
- Base de datos: media_db
- Usuario: rctv
- Contraseña: rctv@01

## Estructura de archivos

\`\`\`
src/
├── config/          # Configuración de BD
├── controllers/     # Controladores de rutas
├── middleware/      # Middleware de upload
├── models/          # Modelos de datos
├── routes/          # Definición de rutas
├── types/           # Tipos TypeScript
├── utils/           # Utilidades
└── server.ts        # Servidor principal

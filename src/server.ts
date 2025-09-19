import express from "express"
import cors from "cors"
import helmet from "helmet"
import path from "path"
import mediaRoutes from "./routes/mediaRoutes"
import { MediaModel } from "./models/MediaModel"

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use("/v1/media", mediaRoutes)

// Ruta de salud
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Media Backend funcionando correctamente",
    timestamp: new Date().toISOString(),
  })
})

// Manejo de errores de multer
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof Error) {
    if (error.message.includes("File too large")) {
      return res.status(413).json({
        success: false,
        message: "El archivo es demasiado grande. Máximo permitido: 90MB",
      })
    }

    if (error.message.includes("Tipo de archivo no válido")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  })
})

// Inicializar base de datos y servidor
async function startServer() {
  try {
    // Crear tabla si no existe
    await MediaModel.createTable()
    console.log("✅ Tabla de medios creada/verificada")

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
      console.log(`📁 Archivos se guardan en: ${path.join(__dirname, "../app/uploads")}`)
      console.log(`🔗 API disponible en: http://localhost:${PORT}/v1/media`)
    })
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error)
    process.exit(1)
  }
}

startServer()

import { Router } from "express"
import { MediaController } from "../controllers/mediaController"
import { upload } from "../middleware/upload"

const router = Router()

// Subir archivo
router.post("/upload", upload.single("file"), MediaController.uploadFile)

// Obtener lista de archivos
router.get("/files", MediaController.getFiles)

// Obtener información de un archivo específico
router.get("/files/:id", MediaController.getFile)

// Servir archivo (para visualización/descarga)
router.get("/serve/:id", MediaController.serveFile)

export default router

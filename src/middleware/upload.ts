import multer from "multer"
import path from "path"
import fs from "fs"
import { FileProcessor } from "../utils/fileProcessor"

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, "../../app/uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const extension = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`)
  },
})

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (FileProcessor.isValidFileType(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Tipo de archivo no válido. Solo se permiten imágenes y videos."))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 90 * 1024 * 1024, // 90MB en bytes
  },
})

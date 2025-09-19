import type { Request, Response } from "express"
import { MediaModel } from "../models/MediaModel"
import { FileProcessor } from "../utils/fileProcessor"
import type { UploadResponse } from "../types/media"
import fs from "fs"
import path from "path"

export class MediaController {
  static async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No se ha enviado ningún archivo",
        } as UploadResponse)
        return
      }

      const { originalname, filename, mimetype, size, path: filePath } = req.file
      const registeredBy = req.body.registered_by || "anonymous"

      // Procesar archivo según su tipo
      let processedData
      const fileType = FileProcessor.getFileType(mimetype)

      if (fileType === "image") {
        processedData = await FileProcessor.processImage(filePath, originalname, mimetype, size)
      } else {
        processedData = await FileProcessor.processVideo(filePath, originalname, mimetype, size)
      }

      // Guardar en base de datos
      const mediaFile = await MediaModel.insert({
        ...processedData,
        registered_by: registeredBy,
      } as any)

      res.status(201).json({
        success: true,
        message: "Archivo subido y procesado correctamente",
        data: mediaFile,
      } as UploadResponse)
    } catch (error) {
      // Si hay error, eliminar archivo subido
      if (req.file) {
        fs.unlink(req.file.path, () => {})
      }

      res.status(500).json({
        success: false,
        message: "Error al procesar el archivo",
        error: error instanceof Error ? error.message : "Error desconocido",
      } as UploadResponse)
    }
  }

  static async getFiles(req: Request, res: Response): Promise<void> {
    try {
      const files = await MediaModel.findAll()
      res.json({
        success: true,
        message: "Archivos obtenidos correctamente",
        data: files,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener los archivos",
        error: error instanceof Error ? error.message : "Error desconocido",
      })
    }
  }

  static async getFile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as {id:string}
      const file = await MediaModel.findById(Number.parseInt(id))

      if (!file) {
        res.status(404).json({
          success: false,
          message: "Archivo no encontrado",
        })
        return
      }

      res.json({
        success: true,
        message: "Archivo encontrado",
        data: file,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener el archivo",
        error: error instanceof Error ? error.message : "Error desconocido",
      })
    }
  }

  static async serveFile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params as {id:string}
      const file = await MediaModel.findById(Number.parseInt(id))

      if (!file) {
        res.status(404).json({
          success: false,
          message: "Archivo no encontrado",
        })
        return
      }

      // Verificar que el archivo existe físicamente
      if (!fs.existsSync(file.file_path)) {
        res.status(404).json({
          success: false,
          message: "Archivo físico no encontrado",
        })
        return
      }

      // Actualizar last_update
      await MediaModel.updateLastUpdate(file.id!)

      // Servir archivo
      res.setHeader("Content-Type", file.mime_type)
      res.setHeader("Content-Disposition", `inline; filename="${file.file_name}"`)
      res.sendFile(path.resolve(file.file_path))
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al servir el archivo",
        error: error instanceof Error ? error.message : "Error desconocido",
      })
    }
  }
}

import sharp from "sharp"
import ffprobe from "ffprobe"
import ffprobeStatic from "ffprobe-static"
import type { MediaFile } from "../types/media"

type MyFFProbeResult = {
  streams: Array<{
    codec_type?: string;
    width?: number;
    height?: number;
  }>;
  format?: {
    duration?: string;
  };
};


export class FileProcessor {
  static async processImage(
    filePath: string,
    fileName: string,
    mimeType: string,
    fileSize: number,
  ): Promise<Partial<MediaFile>> {
    try {
      const metadata = await sharp(filePath).metadata()
      const resolution = `${metadata.width}x${metadata.height}`

      return {
        file_name: fileName,
        file_path: filePath,
        file_type: "image",
        mime_type: mimeType,
        file_size: fileSize,
        resolution,
        duration_seconds: null,
      }
    } catch (error) {
      throw new Error(`Error procesando imagen: ${error}`)
    }
  }

  static async processVideo(
    filePath: string,
    fileName: string,
    mimeType: string,
    fileSize: number,
  ): Promise<Partial<MediaFile>> {
    try {
      const info = await ffprobe(filePath, { path: ffprobeStatic.path }) as MyFFProbeResult;
      const videoStream = info.streams.find((s) => s.codec_type === "video");

      const resolution = videoStream
        ? `${videoStream.width}x${videoStream.height}`
        : "unknown";

      const duration = Math.round(Number.parseFloat(info.format?.duration ?? "0"));

      return {
        file_name: fileName,
        file_path: filePath,
        file_type: "video",
        mime_type: mimeType,
        file_size: fileSize,
        resolution,
        duration_seconds: duration,
      }
    } catch (error) {
      throw new Error(`Error procesando video: ${error}`)
    }
  }

  static isValidFileType(mimeType: string): boolean {
    const validTypes = [
      // Imágenes
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/tiff",
      // Videos
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/flv",
      "video/webm",
      "video/mkv",
      "video/m4v",
    ]

    return validTypes.includes(mimeType.toLowerCase())
  }

  static getFileType(mimeType: string): "image" | "video" {
    return mimeType.startsWith("image/") ? "image" : "video"
  }
}

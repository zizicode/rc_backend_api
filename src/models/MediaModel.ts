import pool from "../config/database"
import type { MediaFile } from "../types/media"

export class MediaModel {
  static async createTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS media_files (
        id SERIAL PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_type VARCHAR(10) NOT NULL CHECK (file_type IN ('image', 'video')),
        mime_type VARCHAR(100) NOT NULL,
        file_size BIGINT NOT NULL,
        resolution VARCHAR(20),
        duration_seconds INTEGER,
        registered_by VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `

    await pool.query(query)
  }

  static async insert(mediaFile: MediaFile): Promise<MediaFile> {
    const query = `
      INSERT INTO media_files (
        file_name, file_path, file_type, mime_type, file_size, 
        resolution, duration_seconds, registered_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `

    const values = [
      mediaFile.file_name,
      mediaFile.file_path,
      mediaFile.file_type,
      mediaFile.mime_type,
      mediaFile.file_size,
      mediaFile.resolution,
      mediaFile.duration_seconds,
      mediaFile.registered_by,
    ]

    const result = await pool.query(query, values)
    return result.rows[0]
  }

  static async findAll(): Promise<MediaFile[]> {
    const query = "SELECT * FROM media_files ORDER BY created_at DESC"
    const result = await pool.query(query)
    return result.rows
  }

  static async findById(id: number): Promise<MediaFile | null> {
    const query = "SELECT * FROM media_files WHERE id = $1"
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  }

  static async updateLastUpdate(id: number): Promise<void> {
    const query = "UPDATE media_files SET last_update = CURRENT_TIMESTAMP WHERE id = $1"
    await pool.query(query, [id])
  }
}

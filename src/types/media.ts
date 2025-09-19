export interface MediaFile {
    id?: number
    file_name: string
    file_path: string
    file_type: "image" | "video"
    mime_type: string
    file_size: number
    resolution?: string
    duration_seconds?: number | null
    registered_by: string
    created_at?: Date
    last_update?: Date
  }
  
  export interface UploadResponse {
    success: boolean
    message: string
    data?: MediaFile
    error?: string
  }
  
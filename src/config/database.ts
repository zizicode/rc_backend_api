import { Pool } from "pg"

const pool = new Pool({
  host: "172.19.0.6",
  port: 5432,
  database: "media_db",
  user: "rctv",
  password: "rctv@01",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export default pool

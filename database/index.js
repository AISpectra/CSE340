// database/index.js
const { Pool } = require("pg")
require("dotenv").config()

/* ***************
 * Connection Pool
 * SSL en desarrollo local para conectarse a la DB remota
 * En producción (deploy del server junto a la DB) sin SSL
 * *************** */

let pool

if (process.env.NODE_ENV === "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  // Log útil en desarrollo
  module.exports = {
    async query(text, params) {
      try {
        const res = await pool.query(text, params)
        console.log("executed query:", text)
        return res
      } catch (error) {
        console.error("error in query:", text, error)
        throw error
      }
    },
  }
} else {
  // Producción: sin SSL y exporta el pool directo
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  module.exports = pool
}

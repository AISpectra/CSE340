// models/inventory-model.js
const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT i.*, c.classification_name
       FROM public.inventory AS i
       JOIN public.classification AS c
         ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1
       ORDER BY i.inv_make, i.inv_model`,
      [classification_id]
    )
    return data.rows // devolvemos solo las filas
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error)
    throw error
  }
}

module.exports = { getClassifications, getInventoryByClassificationId }

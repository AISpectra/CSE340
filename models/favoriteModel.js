const pool = require("../database/")

/* ***************************
 *  Add vehicle to favorites
 * ************************** */
async function addFavorite(accountId, invId) {
  try {
    const existing = await pool.query(
      "SELECT favorite_id FROM public.favorites WHERE account_id = $1 AND inv_id = $2",
      [accountId, invId]
    )

    if (existing.rowCount > 0) {
      return existing.rows[0]
    }

    const sql = `
      INSERT INTO public.favorites (account_id, inv_id)
      VALUES ($1, $2)
      RETURNING *
    `
    const data = await pool.query(sql, [accountId, invId])
    return data.rows[0]
  } catch (error) {
    // 23505 = unique_violation
    if (error.code === "23505") {
      return null
    }
    console.error("addFavorite error:", error)
    throw error
  }
}

/* ***************************
 *  Remove vehicle from favorites
 * ************************** */
async function removeFavorite(accountId, invId) {
  try {
    const sql = "DELETE FROM public.favorites WHERE account_id = $1 AND inv_id = $2"
    const result = await pool.query(sql, [accountId, invId])
    return result.rowCount > 0
  } catch (error) {
    console.error("removeFavorite error:", error)
    throw error
  }
}

/* ***************************
 *  Get favorites for account with vehicle data
 * ************************** */
async function getFavoritesByAccountId(accountId) {
  try {
    const sql = `
      SELECT f.favorite_id, f.account_id, f.inv_id, f.fav_created,
             i.inv_make, i.inv_model, i.inv_year, i.inv_price,
             i.inv_thumbnail, i.inv_image, i.inv_description
      FROM public.favorites AS f
      JOIN public.inventory AS i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.fav_created DESC
    `
    const data = await pool.query(sql, [accountId])
    return data.rows
  } catch (error) {
    console.error("getFavoritesByAccountId error:", error)
    throw error
  }
}

/* ***************************
 *  Check if vehicle is already a favorite
 * ************************** */
async function isFavorite(accountId, invId) {
  try {
    const sql = "SELECT 1 FROM public.favorites WHERE account_id = $1 AND inv_id = $2"
    const result = await pool.query(sql, [accountId, invId])
    return result.rowCount > 0
  } catch (error) {
    console.error("isFavorite error:", error)
    throw error
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByAccountId,
  isFavorite,
}

const utilities = require("../utilities/")
const favoriteModel = require("../models/favoriteModel")

/* ***************************
 *  Build favorites list view
 * ************************** */
async function buildFavoritesView(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData

  try {
    const favorites = await favoriteModel.getFavoritesByAccountId(
      accountData.account_id
    )

    res.render("account/favorites", {
      title: "Mis Vehículos Favoritos",
      nav,
      errors: null,
      favorites,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Add favorite
 * ************************** */
async function addFavorite(req, res, next) {
  const accountData = res.locals.accountData
  const invId = parseInt(req.body.inv_id)

  if (!Number.isInteger(invId)) {
    req.flash("notice", "Invalid vehicle selection.")
    return res.redirect("/inv/")
  }

  try {
    await favoriteModel.addFavorite(accountData.account_id, invId)
    req.flash("notice", "Vehicle added to your favorites.")
  } catch (error) {
    req.flash("notice", "Sorry, we could not add that favorite right now.")
  }

  return res.redirect(`/inv/detail/${invId}`)
}

/* ***************************
 *  Remove favorite
 * ************************** */
async function removeFavorite(req, res, next) {
  const accountData = res.locals.accountData
  const invId = parseInt(req.body.inv_id)

  if (!Number.isInteger(invId)) {
    req.flash("notice", "Invalid vehicle selection.")
    return res.redirect("/favorites")
  }

  try {
    await favoriteModel.removeFavorite(accountData.account_id, invId)
    req.flash("notice", "Vehicle removed from your favorites.")
  } catch (error) {
    req.flash("notice", "Sorry, we could not remove that favorite right now.")
  }

  const redirectTo = req.body.redirectTo || "/favorites"
  return res.redirect(redirectTo)
}

module.exports = {
  buildFavoritesView,
  addFavorite,
  removeFavorite,
}

// controllers/invController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build single vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const invId = req.params.invId
  const vehicleData = await invModel.getVehicleByInvId(invId)
  let nav = await utilities.getNav()

  if (!vehicleData) {
    const error = new Error("Sorry, that vehicle could not be found.")
    error.status = 404
    return next(error)
  }

  const details = await utilities.buildVehicleDetail(vehicleData)
  const title = `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`

  res.render("./inventory/detail", {
    title,
    nav,
    details,
  })
}

module.exports = invCont

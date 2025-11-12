// controllers/invController.js
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id) // array de filas
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()

    // Si hay al menos 1 vehículo, tomamos el nombre de la clasificación de la primera fila
    const className = data.length ? data[0].classification_name : "No results"

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = invCont

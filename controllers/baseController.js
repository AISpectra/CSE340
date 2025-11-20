// controllers/baseController.js
const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav()
  
  res.render("index", { title: "Home", nav })
}

/* ***************************
 *  Intentional 500 error test
 * ************************** */
baseController.triggerError = async function (req, res, next) {
  const err = new Error("Intentional server crash test.")
  err.status = 500
  throw err  // handleErrors lo capturará y lo pasará al middleware de error
}


module.exports = baseController

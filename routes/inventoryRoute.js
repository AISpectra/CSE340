// routes/inventoryRoute.js
// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

/* ***************************
 *  Management view
 * ************************** */
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

/* ***************************
 *  Add Classification view
 * ************************** */
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

/* ***************************
 *  Process add Classification
 * ************************** */
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
)

/* ***************************
 *  Add Inventory view
 * ************************** */
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

/* ***************************
 *  Process add Inventory
 * ************************** */
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
)

/* ***************************
 *  Build inventory by classification view
 * ************************** */
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

/* ***************************
 *  Build single vehicle detail view
 * ************************** */
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
)

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)


router.get(
  "/edit/:inv_id",
  utilities.checkLogin, 
  utilities.handleErrors(invController.editInventoryView)
)

// Process inventory update
router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.updateInventory)
)

// 🔁 UPDATE vehículo
router.post(
  "/update",
  invValidate.inventoryRules(),   // mismas reglas que "add"
  invValidate.checkUpdateData,       // nuevo middleware
  utilities.handleErrors(invController.updateInventory)
)

// Delete inventory item - show confirmation view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteInventory)
)

// Delete inventory item - process delete
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventory)
)


module.exports = router

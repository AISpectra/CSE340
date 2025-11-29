// routes/inventoryRoute.js
// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

/* ***************************
 *  Inventory Management view (solo Employee/Admin)
 * ************************** */
router.get(
  "/",
  utilities.checkAccountType,                    // 🔒 Solo Employee / Admin
  utilities.handleErrors(invController.buildManagement)
)

/* ***************************
 *  Add Classification view
 * ************************** */
router.get(
  "/add-classification",
  utilities.checkAccountType,                    // 🔒 Solo Employee / Admin
  utilities.handleErrors(invController.buildAddClassification)
)

/* ***************************
 *  Process add Classification
 * ************************** */
router.post(
  "/add-classification",
  utilities.checkAccountType,                    // 🔒 Solo Employee / Admin
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
)

/* ***************************
 *  Add Inventory view
 * ************************** */
router.get(
  "/add-inventory",
  utilities.checkAccountType,                    // 🔒 Solo Employee / Admin
  utilities.handleErrors(invController.buildAddInventory)
)

/* ***************************
 *  Process add Inventory
 * ************************** */
router.post(
  "/add-inventory",
  utilities.checkAccountType,                    // 🔒 Solo Employee / Admin
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
)

/* ***************************
 *  Build inventory by classification view (PÚBLICO)
 * ************************** */
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

/* ***************************
 *  Build single vehicle detail view (PÚBLICO)
 * ************************** */
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
)

/* ***************************
 *  Inventory JSON for management (solo Employee/Admin)
 * ************************** */
router.get(
  "/getInventory/:classification_id",
  utilities.checkAccountType,                    // 🔒 Solo Employee / Admin
  utilities.handleErrors(invController.getInventoryJSON)
)

/* ***************************
 *  Edit Inventory view
 * ************************** */
router.get(
  "/edit/:inv_id",
  utilities.checkAccountType,                    // 🔒 Solo Employee / Admin
  utilities.handleErrors(invController.editInventoryView)
)

/* ***************************
 *  Process inventory update
 * ************************** */
router.post(
  "/update",
  utilities.checkAccountType,                    // 🔒 Solo Employee / Admin
  invValidate.inventoryRules(),                  // mismas reglas que "add"
  invValidate.checkUpdateData,                   // ⬅️ devuelve a edit-inventory si hay errores
  utilities.handleErrors(invController.updateInventory)
)

/* ***************************
 *  Delete inventory item - show confirmation view
 * ************************** */
router.get(
  "/delete/:inv_id",
  utilities.checkAccountType,                    // 🔒 Solo Employee / Admin
  utilities.handleErrors(invController.buildDeleteInventory)
)

/* ***************************
 *  Delete inventory item - process delete
 * ************************** */
router.post(
  "/delete",
  utilities.checkAccountType,                    // 🔒 Solo Employee / Admin
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router

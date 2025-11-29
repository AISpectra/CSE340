
// Needed resources
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const accValidate = require("../utilities/account-validation")

// Route for login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Route to build registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)


// Process registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
  //(req, res) => {
  //  res.status(200).send("login process")
  //}
)

// Default account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)


/* ===== UPDATE VIEW ===== */
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

/* ===== UPDATE ACCOUNT DATA ===== */
router.post(
  "/update",
  utilities.checkLogin,
  accValidate.updateAccountRules(),
  accValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

/* ===== UPDATE PASSWORD ===== */
router.post(
  "/update-password",
  utilities.checkLogin,
  accValidate.updatePasswordRules(),
  accValidate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
)

/* ===== LOGOUT ===== */
router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
})


module.exports = router

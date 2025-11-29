const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()

  // 1. Recogemos datos del formulario
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

  // 2. Hashear contraseña ANTES de guardar
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  // 3. Guardar en BD usando el hash
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  // 4. Resultado
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password

      // JWT: el expiresIn va en SEGUNDOS → 3600 = 1 hora
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      )

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000, // 1 hora en ms
        })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000, // 1 hora en ms
        })
      }

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error("Access Forbidden")
  }
}

/* ****************************************
 *  Build account management view
 * ************************************ */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    notice: req.flash("notice"),
    accountData,
  })
}

/* ***************************
 *  Build update account view
 * ************************** */
async function buildUpdateAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()

  const accountData = await accountModel.getAccountById(account_id)

  res.render("./account/update-account", {
    title: "Update Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  })
}

/* ***************************
 *  Process account update
 * ************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

  try {
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (updateResult) {
      // Consultar datos actualizados y regenerar JWT
      const refreshedAccount = await accountModel.getAccountById(account_id)
      const token = jwt.sign(refreshedAccount, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      })

      res.clearCookie("jwt")
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      })

      req.flash("notice", "Account information updated successfully.")
      return res.redirect("/account/")
    }

    req.flash("notice", "Sorry, the update failed.")
    return res.status(500).render("./account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process password change
 * ************************** */
async function updatePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  try {
    // hash nuevo password
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    )

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
      return res.redirect("/account/")
    }

    req.flash("notice", "Sorry, the password update failed.")
    // reconstruimos la vista con datos del usuario
    const accountData = await accountModel.getAccountById(account_id)
    return res.status(500).render("./account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id,
    })
  } catch (error) {
    next(error)
  }
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateAccount,
  updateAccount,
  updatePassword,
}


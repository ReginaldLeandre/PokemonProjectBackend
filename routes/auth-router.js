const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth-controllers")
const { requireToken } = require("../middleware/auth-middleware")


router.post("/register", authCtrl.register)
router.get('./logout', requireToken, authCtrl.logout)

router.post("/login", authCtrl.login)

module.exports = router
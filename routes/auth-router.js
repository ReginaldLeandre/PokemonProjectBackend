const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth-controllers")
const { requireToken } = require("../middleware/auth-middleware")


router.post("/register", authCtrl.register)
router.get('/logout', requireToken, authCtrl.logout)
router.get('/userShow', requireToken, authCtrl.show)
router.post("/login", authCtrl.login)
router.get('/user/pokemon/:id', requireToken, authCtrl.UpokeShow)

module.exports = router
const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth-controllers")




router.post("/register", authCtrl.register);


router.post("/login", )

module.exports = router;
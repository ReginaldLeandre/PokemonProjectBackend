const express = require('express')
const router = express.Router()


const cartController = require('../controllers/carts')
const { requireToken } = require("../middleware/auth-middleware")


router.post('/addPokeBall', requireToken, cartController.addBall)
router.post('/addPokemon/:id', requireToken, cartController.addPoke)
router.post('/create', requireToken, cartController.create)
router.get('/index', requireToken, cartController.view)




module.exports = router
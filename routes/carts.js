const express = require('express')
const router = express.Router()


const cartController = require('../controllers/carts')
const { requireToken } = require("../middleware/auth-middleware")


router.put('/addPokeBall', requireToken, cartController.addBall)
router.put('/addPokemonPage', requireToken, cartController.addPokeId)
router.post('/create', requireToken, cartController.create)
router.get('/index', requireToken, cartController.view)
router.put('/addPoke', requireToken, cartController.plusle)
router.put('/removePoke', requireToken, cartController.minun)
router.put('/emptyCart', requireToken, cartController.empty)



module.exports = router
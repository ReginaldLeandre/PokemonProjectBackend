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
router.put('/incPokeBall', requireToken, cartController.increasePokeBall)
router.put('/decPokeBall', requireToken, cartController.decreasePokeBall)
router.put('/emptyCart', requireToken, cartController.empty)
router.post('/purchase', requireToken, cartController.purchase)



module.exports = router
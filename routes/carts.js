const express = require('express')
const router = express.Router()


const cartController = require('../controllers/carts')
const { requireToken } = require("../middleware/auth-middleware")


router.put('/addPokeBall', requireToken, cartController.addBall)
router.put('/addPokemon/:id', requireToken, cartController.addPoke)
router.post('/create', requireToken, cartController.create)
router.get('/index', requireToken, cartController.view)
router.put('/addPoke', requireToken, cartController.plusle)
router.put('/removePoke', requireToken, cartController.minun)




module.exports = router
const express = require('express')
const router = express.Router()

const cartController = require('../controllers/carts')



router.post('/addPokeBall', cartController.addBall)
router.post('/addPokemon', cartController.addPoke)





module.exports = router
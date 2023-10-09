const express = require('express')
const router = express.Router()

const pokemonCtrl = require('../controllers/pokemons')


router.get('/pokemon', pokemonCtrl.getRan)



module.exports = router
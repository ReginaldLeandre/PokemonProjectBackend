const express = require('express')
const router = express.Router()

const pokemonCtrl = require('../controllers/pokemons')


router.post('/pokemon', pokemonCtrl.getRan)
router.put('/catch', pokemonCtrl.catch)


module.exports = router
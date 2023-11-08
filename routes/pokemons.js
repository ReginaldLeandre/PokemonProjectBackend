const express = require('express')
const router = express.Router()
const { requireToken } = require("../middleware/auth-middleware")

const pokemonCtrl = require('../controllers/pokemons')


router.get('/pokemon', pokemonCtrl.getRan)
router.post('/catch', pokemonCtrl.catch)
router.get('/:id', pokemonCtrl.show)
router.get('/pokemon/encounter', pokemonCtrl.encounter)
router.get('/pokemon/search', pokemonCtrl.search)

module.exports = router
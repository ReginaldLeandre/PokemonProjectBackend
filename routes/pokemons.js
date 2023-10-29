const express = require('express')
const router = express.Router()
const { requireToken } = require("../middleware/auth-middleware")

const pokemonCtrl = require('../controllers/pokemons')


router.get('/pokemon', pokemonCtrl.getRan)
router.post('/catch', requireToken, pokemonCtrl.catch)
router.get('/:id', pokemonCtrl.show)
router.get('/encounter', requireToken, pokemonCtrl.encounter)
// router.get('/search', pokemonCtrl.search)

module.exports = router
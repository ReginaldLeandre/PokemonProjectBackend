const express = require('express')
const router = express.Router()

const pokemonCtrl = require('../controllers/pokemons')


router.get('/pokemon', pokemonCtrl.getRan)
router.post('/catch', pokemonCtrl.catch)
router.get('/:id', pokemonCtrl.show)
router.get('/encounter', pokemonCtrl.encounter)
// router.get('/search', pokemonCtrl.search)

module.exports = router
const express = require('express')
const router = express.Router()

const pokemonCtrl = require('../controllers/pokemons')


router.get('/pokemon', pokemonCtrl.getRan)
// router.put('/catch', pokemonCtrl.catch)
router.get('/:id', pokemonCtrl.show)


module.exports = router
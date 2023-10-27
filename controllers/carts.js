/***************************************************************************************
 *                                        IMPORTS
 **************************************************************************************/
const { PokeBall } = require('../models')
const { PokeMon } = require('../models')
const { User } = require('../models')



const cart = []



const addPokeBallToCart = async (req, res) => {


    try{
        const ballType = req.body.ballType
        const price = req.body.price

        const pokeBall = {
            ballType: ballType,
            price: price
        }

        cart.push(pokeBall)
        console.log(cart)
        res.status(200).json({ message: 'Poke Ball added to the cart' })
    }
    catch(error){
        res.status(400).json({error: error.message})
    }


}

const addPokemonToCart = async (req, res) => {




    try {
        const pokeDexId = req.body.pokeDexId
        const home = req.body.home
        const pokemonName = req.body.pokemonName
        const type = req.body.type
        const description = req.body.description
        const statName = req.body.statName
        const statData = req.body.statData
        const abilityName = req.body.abilityName
        const abilityDescription = req.body.abilityDescription

        const stats = {
            statName: statName,
            statData: statData
        }

        const abilities = {
            abilityName: abilityName,
            abilityDescription: abilityDescription
        }

        const pokemon = {
            pokeDexId: pokeDexId,
            home: home,
            pokemonName: pokemonName,
            type: type,
            description: description,
            stats: stats,
            abilities: abilities
        }

        cart.push(pokemon)

        console.log(cart)
        res.status(200).json({ message: `${pokemon.pokemonName} added to the cart` })
    }
    catch(error){
        res.status(400).json({error: error.message})
    }

}



module.exports = {
    addBall: addPokeBallToCart,
    addPoke: addPokemonToCart,
    // purchase, 
    // viewCart
}



// pokeDexId
// home
// pokemonName
// type
// description
// statName
// statData
// abilityName
// abilityDescription
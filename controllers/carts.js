const { PokeBall, Cart, PokeMon, User } = require('../models')
const { calculateTotalPriceOfCart } = require('../utils/cartUtil')
const axios = require('axios')
const { handleValidateOwnership } = require("../middleware/auth-middleware");
const BASE_URL = process.env.BASE_URL

const createCart = async (req, res) => {
    try {
        const reqUser = req.user
         
        
        const newCart = {
            user: reqUser._id
        } 

        const foundCart = await Cart.findOne({user: reqUser._id})
        if(foundCart) {
            return res.status(400).json("You can only have one cart.")
        }

        const cart = await Cart.create(newCart)
        console.log("This is the Cart: ", cart)
        console.log("CREATION: Cart has been created!")
        return res.status(200).json(cart)
    } catch (error) {
        console.log("NO CREATION: Cart has NOT been created!")
        return res.status(400).json({ error: error.message })
    }
}

const viewCart = async (req, res) => {

    try{
       const user = req.user
       const cart = await Cart.findOne({user: user._id})
       return res.status(200).json(cart)
   
    }
      catch(error) {
       return res.status(400).json({ error: error.message })
    }
       
   }
   
const decreasePokeItem = async (req, res) => {

    try{
      const reqUser = req.user
    const cart = await Cart.findOne({user: reqUser._id})
    const pokeName = req.body.pokemonName
    const foundPoke = cart.pokemonItems.find((pokemonObject) => pokemonObject.pokemon.pokemonName === pokeName)
    console.log("This is the found pokemon: ", foundPoke)
    if(foundPoke){
        if(foundPoke.quantity > 1) {
            foundPoke.quantity--
            console.log("This is the found pokemon's quantity: ", foundPoke.quantity)
            cart.totalItems--
            console.log("This is the cart's total items: ", cart.totalItems)
            await cart.save()
            return res.status(200).json(`The number of ${foundPoke.pokemon.pokemonName}s has been decreased from the cart!`)
        }
        else if(foundPoke.quantity === 1) {
            cart.pokemonItems = cart.pokemonItems.filter(
                (pokemonObject) => pokemonObject.pokemon.pokemonName !== pokeName
            )
            cart.totalItems--
            await cart.save()
            return res.status(200).json(`The last ${foundPoke.pokemon.pokemonName} has been removed from the cart!`)
        }
    }
    }
    catch(error) {
        return res.status(400).json({ error: error.message})
    }

}

const addPokeToCart = async (req, res) => {
    try {
        const user = req.user
        let price = 0
        
        const cart = await Cart.findOne({ user: user._id })
        const id = req.params.id
        
        const foundPoke = cart.pokemonItems.find((pokemonObject) => pokemonObject.pokemon.pokeDexId === parseInt(id))
        console.log("This is the found pokemon: ", foundPoke)
        if(foundPoke){
            foundPoke.quantity++
            console.log("This is the found pokemon's quantity: ", foundPoke.quantity)
            cart.totalItems++
            console.log("This is the cart's total items: ", cart.totalItems)
            await cart.save()
            return res.status(200).json(`Another ${foundPoke.pokemon.pokemonName} has been added to the cart!`)
        }
        
        const response = await axios.get(`${BASE_URL}pokemon/${id}`)

       
        const responseData = response.data

        const secondResponse = await axios.get(`${BASE_URL}pokemon-species/${id}`)
        const secondData = secondResponse.data

        if (secondData.is_legendary === false && secondData.is_mythical === false) {
            price = 1000
        } else if (secondData.is_legendary === true && secondData.is_mythical === false) {
            price = 10000
        } else if (secondData.is_mythical === true && secondData.is_legendary === false) {
            price = 50000
        }

        const addedPokemon = {
            pokemonName: responseData.name,
            pokeDexId: responseData.id,
            front: responseData.sprites.front_default,
            price: price,
        }

        cart.pokemonItems.push({ pokemon: addedPokemon, quantity: 1 })
        cart.totalItems +=1
        await cart.save()
        return res.status(200).json(`${addedPokemon.pokemonName} has been added to your Cart`)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

const addPokeBallToCart = async (req, res) => {
    try {
        const user = req.user
        const type = req.body.ballType
        const foundUser = await User.findOne({ username: user.username })
        const cart = await Cart.findOne({ user: user._id })
        let price = 0

        const addedPokeBall = {
            ballType: type,
            price: price,
        }

        switch (type) {
            case 'PokeBall':
                price = 5
                break
            case 'GreatBall':
                price = 10
                break
            case 'UltraBall':
                price = 20
                break
            case 'MasterBall':
                if (foundUser.purchasedAMasterBall === true) {
                    return res.status(200).json('One MasterBall can be purchased per account.')
                }
                if (cart.pokeBallItems.some((item) => item.pokeBall.ballType === 'MasterBall')) {
                    return res.status(200).json('You can only purchase one MasterBall per account')
                }
                price = 50
                break
            default:
                break
        }

        const existingItem = cart.pokeBallItems.find((item) => item.pokeBall.ballType === type)
        if (existingItem) {
            existingItem.quantity += 1
        } else {
            const newPokeBall = {
                pokeBall: addedPokeBall,
                quantity: 1,
            }
            cart.pokeBallItems.push(newPokeBall)
        }
        cart.totalItems =+1
        await cart.save()
        return res.status(200).json(`A ${type} has been added to your Cart`)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}


const fetchPokemonFromPokeAPI = async (id) => {
    try {
        const [pokemonResponse, speciesResponse] = await Promise.all([
            axios.get(`${BASE_URL}pokemon/${id}`),
            axios.get(`${BASE_URL}pokemon-species/${id}`),
        ])

        const responseData = pokemonResponse.data
        const speciesData = speciesResponse.data

        let englishFlavorText = null
        for (const entry of speciesData.flavor_text_entries) {
            if (entry.language.name === 'en') {
                englishFlavorText = entry.flavor_text
                break
            }
        }

        const abilityPromises = responseData.abilities.map(async (abilityData) => {
            const abilityResponse = await axios.get(abilityData.ability.url)
            const abilityName = abilityData.ability.name
            const abilityDescription = abilityResponse.data.flavor_text_entries.find(
                (entry) => entry.language.name === 'en'
            )
            return {
                abilityName: abilityName,
                abilityDescription: abilityDescription
                    ? abilityDescription.flavor_text
                    : 'This ability has no description available',
            }
        })

        const abilities = await Promise.all(abilityPromises)

        
        const pokemon = {
            pokemonName: responseData.name,
            pokeDexId: responseData.id,
            description: englishFlavorText,
            front: responseData.sprites.front_default,
            home: responseData.sprites.other.home.front_default,
            abilities: abilities,
            trainer: req.user._id,
            caughtOrPurchased: Date.now(),
            type: responseData.types.map((typeData) => typeData.type.name),
            stats: responseData.stats.map((statsData) => ({
                statName: statsData.stat.name,
                statData: statsData.base_stat,
            
            })),
        }
       return await PokeMon.create(pokemon)

    } catch (error) {
        throw error
    }
}

const createPokeball = async(ballObject) => {
    try {
        

    }
    catch(error) {
        res.status(400).json({error: error.message})
    }
}

const purchaseFromCart = async (req, res) => {
    try{
        const userid = req.user._id
        const cart = await Cart.findOne({user: userid})


        for ( const pokemon of cart.pokemonItems.pokemon ) {
            fetchPokemonFromPokeAPI(pokemon.pokeDexId)  
        }



        cart.pokemonItems = []

        await cart.save()
        return res.status(200).json("Items in cart have been purchased!")
    }
    catch(error) {
        return res.status(400).json({error: error.message})
    }
}

module.exports = {
    create: createCart,
    addPoke: addPokeToCart,
    addBall: addPokeBallToCart,
    view: viewCart,
    purchase: purchaseFromCart
}

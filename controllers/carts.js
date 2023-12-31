const { Cart, PokeMon, User } = require('../models')
const { calculateTotalPriceOfCart, calculateIndividualPrice } = require('../utils/cartUtil')
const axios = require('axios')
const { handleValidateOwnership } = require("../middleware/auth-middleware")
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
        const updatedPrice = calculateTotalPriceOfCart(cart)
        const calculatedPrice = calculateIndividualPrice(cart)



        cart.pokemonItems.calcPrice = calculatedPrice.pokemonCalculatedPrice
        cart.pokeBallItems.calcPrice = calculatedPrice.pokeBallCalculatedPrice
        cart.salesTax = updatedPrice.salesTax
        cart.subTotal = updatedPrice.subtotal
        cart.totalPrice = updatedPrice.total
        await cart.save()    
        return res.status(200).json(cart)
   
    }
      catch(error) {
       return res.status(400).json({ error: error.message })
    }
       
   }
   
const decreasePokeItem = async (req, res) => {
  try {
    const reqUser = req.user
    const cart = await Cart.findOne({ user: reqUser._id })
    const { pokemonName } = req.query

    // if (!pokeName) {
    //   return res.status(400).json({ error: 'Invalid or missing pokemonName in the request body' })
    // }

    const foundPoke = cart.pokemonItems.find(
      (pokemonObject) => pokemonObject.pokemon.pokemonName === pokemonName
    )

    // if (!foundPoke) {
    //   return res.status(404).json({ error: 'Pokemon not found in the cart' })
    // }

    if (foundPoke.quantity > 1) {
      foundPoke.quantity--
      cart.totalItems--

      await cart.save()
      return res.status(200).json(`The number of ${foundPoke.pokemon.pokemonName}s has been decreased from the cart!`)
        } 
    
    else if (foundPoke.quantity === 1) {
      cart.pokemonItems = cart.pokemonItems.filter(
        (pokemonObject) => pokemonObject.pokemon.pokemonName !== pokemonName
      )
      cart.totalItems--

      await cart.save()
      return res.status(200).json(`The last ${foundPoke.pokemon.pokemonName} has been removed from the cart!`)
        }

  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

const increasePokeItem = async (req, res) => {
  try {
    const reqUser = req.user
    const cart = await Cart.findOne({ user: reqUser._id })
    const { pokemonName } = req.query

    // if (!pokeName) {
    //   return res.status(400).json({ error: 'Invalid or missing pokemonName in the request body' })
    // }

    const foundPoke = cart.pokemonItems.find(
      (pokemonObject) => pokemonObject.pokemon.pokemonName === pokemonName
    )

    // if (!foundPoke) {
    //   return res.status(404).json({ error: 'Pokemon not found in the cart' })
    // }

    foundPoke.quantity++
    cart.totalItems++

    await cart.save()
    return res.status(200).json(`More ${foundPoke.pokemon.pokemonName} has been added from the cart!`)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}


const addPokeToCartFromShowPage = async (req, res) => {
    try {
        const reqUser = req.user
        let price = 0
        
        const cartOne = await Cart.findOne({ user: reqUser._id })
        const { pokeDexId } = req.query
        console.log("This is the pokeDexId from pokemon show page: ", pokeDexId)

        if(!cartOne) {
            const newCart = {
                user: reqUser._id
            } 

            await Cart.create(newCart)
        }

        const cart = await Cart.findOne({ user: reqUser._id })

        const foundPoke = cart.pokemonItems.find((pokemonObject) => pokemonObject.pokemon.pokeDexId === parseInt(pokeDexId))
        console.log("This is the found pokemon from pokemon show page: ", foundPoke)
        if(foundPoke){
            foundPoke.quantity++
            console.log("This is the found pokemon's quantity from pokemon show page: ", foundPoke.quantity)
            cart.totalItems++
            console.log("This is the cart's total items from pokemon show page: ", cart.totalItems)
            await cart.save()
            return res.status(200).json(`Another ${foundPoke.pokemon.pokemonName} has been added to the cart!`)
        }
        
        const response = await axios.get(`${BASE_URL}pokemon/${pokeDexId}`)

       
        const responseData = response.data

        const secondResponse = await axios.get(`${BASE_URL}pokemon-species/${pokeDexId}`)
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
        return res.status(200).json({addPokeToCartFromShowPage: `${addedPokemon.pokemonName} has been added to your Cart`})
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error.message })
    }
}

const addPokeBallToCart = async (req, res) => {
    try {
        const reqUser = req.user
        const { ballType } = req.query
        const foundUser = await User.findOne({ _id: reqUser._id })
        const cartOne = await Cart.findOne({ user: reqUser._id })

        if(!cartOne) {
            const newCart = {
                user: reqUser._id
            } 

            await Cart.create(newCart)
        }

        const cart = await Cart.findOne({ user: reqUser._id })
        let price = 0
        let ballImage = null

        switch (ballType) {
            case 'PokeBall':
                price = 5
                ballImage = '/pokeballs/pokeball.jpg'
                break
            case 'GreatBall':
                price = 10
                ballImage = '/pokeballs/greatball.jpg'
                break
            case 'UltraBall':
                price = 20
                ballImage = '/pokeballs/ultraball.jpg'
                break
            case 'MasterBall':
                if (foundUser.purchasedAMasterBall === true) {
                    return res.status(200).json({masterBallError: 'One MasterBall can be purchased per account.'})
                }
                if (cart.pokeBallItems.some((item) => item.pokeBall.ballType === 'MasterBall')) {
                    return res.status(200).json({masterBallError: 'You can only add one MasterBall to your Cart.'})
                }
                price = 50
                ballImage = '/pokeballs/masterball.jpg'
                break
            default:
                break
        }
        const addedPokeBall = {
            ballType: ballType,
            image: ballImage,
            price: price
        }
        const existingItem = cart.pokeBallItems.find((item) => item.pokeBall.ballType === ballType)
        if (existingItem) {
            existingItem.quantity +=1
            cart.totalItems +=1
        } else {
            const newPokeBall = {
                pokeBall: addedPokeBall,
                quantity: +1,
            }
            cart.pokeBallItems.push(newPokeBall)
            cart.totalItems +=1
        }
        await cart.save()
        console.log("Cart updated successfully")
        return res.status(200).json({ pokeballCartMsg: `A ${ballType} has been added to your Cart` })        
    } catch (error) {
        console.log("This is the error coming from the add Pokeball cart function: ", error)
        return res.status(400).json({ error: error.message })
    }
}

const increasePokeBall = async (req, res) => {
    try {
      const reqUser = req.user
      const cart = await Cart.findOne({ user: reqUser._id })
      const { pokeBall } = req.query

      const foundItem = cart.pokeBallItems.find(
        (pokeBallObject) => pokeBallObject.pokeBall.ballType === pokeBall
      )
    
      if(foundItem.pokeBall.ballType === "MasterBall" && foundItem.quantity === 1) {
        return res.status(400).json({masterBallError: "You can only add 1 Master Ball to your cart."})
      }
      foundItem.quantity++
      cart.totalItems++

      await cart.save()
      return res.status(200).json(`More ${foundItem.pokeBall.ballType} has been added from the cart!`)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
}

const decreasePokeBall = async (req, res) => {
    try {
      const reqUser = req.user
      const cart = await Cart.findOne({ user: reqUser._id })
      const { pokeBall } = req.query

      const foundItem = cart.pokeBallItems.find(
        (pokeBallObject) => pokeBallObject.pokeBall.ballType === pokeBall
      )

      if (foundItem.quantity > 1) {
        foundItem.quantity--
        cart.totalItems--
  
        await cart.save()
        return res.status(200).json(`The number of ${foundItem.pokeBall.ballType}s has been decreased from the cart!`)
          } 
      
      else if (foundItem.quantity === 1) {
        cart.pokeBallItems = cart.pokeBallItems.filter(
          (pokeBallObject) => pokeBallObject.pokeBall.ballType !== pokeBall
        )
        cart.totalItems--
  
        await cart.save()
        return res.status(200).json(`The last ${foundItem.pokeBall.ballType} has been removed from the cart!`)
          }
  
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }


const fetchPokemonFromPokeAPI = async (id, user, date) => {
    try {
        const pokeObjectId = null
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

        const ability = await Promise.all(
            responseData.abilities.map(async (abilityData) => {
                const abilityResponse = await axios.get(abilityData.ability.url)
                const abilityName = abilityData.ability.name
        
                
                const englishFlavorTextEntry = abilityResponse.data.flavor_text_entries.find(
                    (entry) => entry.language.name === 'en'
                )
        
                const abilityDescription = englishFlavorTextEntry
                    ? englishFlavorTextEntry.flavor_text
                    : 'This ability has no description available'
        
                return {
                    abilityName: abilityName,
                    abilityDescription: abilityDescription,
                }
            })
        )
        
        const fetchedPokemon = {
            pokemonName: responseData.name,
            pokeDexId: responseData.id,
            description: englishFlavorText,
            front: responseData.sprites.front_default,
            home: responseData.sprites.other.home.front_default,
            abilities: ability,
            trainer: user._id,
            caughtOrPurchased: date,
            type: responseData.types.map((typeData) => typeData.type.name),
            stats: responseData.stats.map((statsData) => ({
                statName: statsData.stat.name,
                statData: statsData.base_stat,
            
            })),
        }
        const secondPokeObject = {
            pokemon: fetchedPokemon
        }
        return secondPokeObject
    } catch (error) {
        throw error
    }
}

const purchaseFromCart = async (req, res) => {
    try {
        const userid = req.user._id
        const cart = await Cart.findOne({ user: userid })
        const user = await User.findById(userid)
        let dateObj = new Date()
        let month = dateObj.getUTCMonth() + 1
        let day = dateObj.getUTCDate()
        let year = dateObj.getUTCFullYear()


        const newdate = `${month}/${day}/${year}`

        for (const pokemonItem of cart.pokemonItems) {
            const { pokemon, quantity } = pokemonItem

            for (let i = 0; i < quantity; i++) {
                const fetched = fetchPokemonFromPokeAPI(pokemon.pokeDexId, user, newdate)
                let newPokemon = await PokeMon.create((await fetched).pokemon)
                user.pokemon.push(newPokemon._id)
            }
        }

        
        
        for (const pokeBallItem of cart.pokeBallItems) {
            const { pokeBall, quantity } = pokeBallItem
            const existingPokeball = user.pokeballs.find(pb => pb.ballType === pokeBall.ballType)
        
            if (pokeBall.ballType === "MasterBall") {
                user.purchasedAMasterBall = true
            }
        
            if (existingPokeball) {
           
                await User.findOneAndUpdate(
                    { _id: userid, "pokeballs.ballType": existingPokeball.ballType },
                    { $inc: { "pokeballs.$.quantity": quantity } },
                    { new: true }
                )
            } else {
               
                user.pokeballs.push({ ballType: pokeBall.ballType, image: pokeBall.image, quantity })
                await user.save()
            }
            
        }
        
        
        
          cart.pokemonItems = []
          cart.pokeBallItems = []
          cart.subTotal = 0
          cart.salesTax = 0
          cart.totalItems = 0
          cart.totalPrice = 0
        
        await cart.save()  
        await user.save()
        return res.status(200).json({CartPurchaseMsg: "You have purchased your items!"})
    } catch (error) {
        console.log("This is the error message from Puchase: ", error.message)
        return res.status(400).json({ error: error.message })
    }
}


const emptyCart = async (req, res) => {

    try {
       const user = req.user
    const cart = await Cart.findOne({user: user._id})

    cart.pokemonItems = []
    cart.pokeBallItems = []
    cart.subTotal = 0
    cart.salesTax = 0
    cart.totalItems = 0
    cart.totalPrice = 0
    await cart.save()

    res.status(200).json({cart: cart, emptyCartMessage: "Your cart has been emptied!"}) 
    }
    
    catch(error) {
        console.log("This is the error messsage emptyCart", error)
        return res.status(400).json({error: error.message})
    }
}


module.exports = {
    create: createCart,
    addBall: addPokeBallToCart,
    view: viewCart,
    purchase: purchaseFromCart,
    minun: decreasePokeItem,
    plusle: increasePokeItem,
    addPokeId: addPokeToCartFromShowPage,
    empty: emptyCart, 
    increasePokeBall, 
    decreasePokeBall
}

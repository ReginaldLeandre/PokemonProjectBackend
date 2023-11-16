/***************************************************************************************
 *                                        IMPORTS
 **************************************************************************************/
const axios = require('axios')
const { PokeMon } = require('../models')
const { User } = require('../models')
const { handleValidateOwnership } = require("../middleware/auth-middleware")

const BASE_URL = process.env.BASE_URL



function getRandomNumber(min, max) {
    min = Math.ceil(min) 
    max = Math.floor(max) 
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

const geRandomPokemon = async (req, res) => {

    try {
        const pokemonArray = []

        for(let i = 0; i < 5; i++) {
            const allRegions = getRandomNumber(1, 905)
            const response = await axios.get(`${BASE_URL}pokemon/${allRegions}`)
            const responseData = response.data
            
            

            const pokemon = {
                pokemonName: responseData.name,
                pokeDexId: responseData.id,
                home: responseData.sprites.other.home.front_default,
            }
            pokemonArray.push(pokemon)
        }
    

        

        res.status(200).json(pokemonArray)
        
    }
    catch(error){
        console.log(error)
        res.status(400).json({error: error.message})
    }   
}


const showPokemon = async (req, res) => {
    try{
    const id = req.params.id
    const response = await axios.get(`${BASE_URL}pokemon/${id}`)
    const responseData = response.data

    const secondResponse = await axios.get(`${BASE_URL}pokemon-species/${id}`)
    const secondResponseData = secondResponse.data
    let englishFlavorText = null


    for (const entry of secondResponseData.flavor_text_entries) {
      if (entry.language.name === 'en') {
        englishFlavorText = entry.flavor_text
        break  
      }
    }
    const ability = await Promise.all(
        responseData.abilities.map(async (abilityData) => {
            const abilityResponse = await axios.get(abilityData.ability.url)
            const abilityName = abilityData.ability.name
            const abilityDescription = abilityResponse.data.flavor_text_entries.find(
                (entry) => entry.language.name === 'en'
            )
            return {
                abilityName: abilityName,
                abilityDescription: abilityDescription ? abilityDescription.flavor_text : 'This ability has no description available',
            }
        })
    )

    
    const pokemon = {
        pokemonName: responseData.name,
        pokeDexId: responseData.id,
        description: englishFlavorText,
        home: responseData.sprites.other.home.front_default,
        abilities: ability,
        type: responseData.types.map(typeData => typeData.type.name),
        stats: responseData.stats.map(statsData => ({
            statName: statsData.stat.name, 
            statData: statsData.base_stat
            })),

    }
    res.status(200).json(pokemon)
    }
    catch(error){
        console.log(error)
        res.status(400).json({error: error.message})
    }   
}


const encounterPokemon = async (req, res) => {

    try {
        const allRegions = getRandomNumber(1, 905)
        const response = await axios.get(`${BASE_URL}pokemon/${allRegions}`)
        const responseData = response.data
        

    const pokemon = {
        pokemonName: responseData.name,
        pokeDexId: responseData.id,
        home: responseData.sprites.other.home.front_default,
    }

    res.status(200).json({pokemon: pokemon})

}
catch(error){
    console.log(error)
    res.status(400).json({error: error.message})
}   
}

const catchPokemon = async (req, res) => {
    try {
        let changeImageObject = false
        let dateObj = new Date()
        let month = dateObj.getUTCMonth() + 1 
        let day = dateObj.getUTCDate()
        let year = dateObj.getUTCFullYear()

        const newdate = `${month}/${day}/${year}`
        const { pokeDexId } = req.query
        const { ballType } = req.query
        const reqUser = req.user

        const user = await User.findById(reqUser._id)
        

        



        
        console.log("This is ballType ball: ", ballType)



        const result = await User.findOneAndUpdate(
            { _id: reqUser._id, 'pokeballs.ballType': ballType, 'pokeballs.quantity': { $gt: 0 } },
            { $inc: { 'pokeballs.$.quantity': -1 } },
            { new: true }
        )
        if(!result) {
            console.log(`No ${ballType}s left`)
            return res.status(200).json({catchingPokemonMsg: `You have no ${ballType}s left!`})
        }


        let catchRateModifier = 1
        switch (ballType) {
            case 'PokeBall': 
                catchRateModifier = 1 //base chance
                
                break
            case 'GreatBall':
                catchRateModifier = 1.5  // 50% higher chance
                break
            case 'UltraBall':
                catchRateModifier = 2  // 2x catch rate
                break
            case 'MasterBall':
                catchRateModifier = Infinity  // Always catch
                break
            default:
                break
        }
    
            const catching = getRandomNumber(1, 1500)
    
            if (catching * catchRateModifier <= 700 ) {
                return res.status(200).json({catchingPokemonMsg: `It broke free!`}
                )
            } else if (catching * catchRateModifier <= 1300) {
                return res.status(200).json({catchingPokemonMsg: 'Darn! Almost caught!'}
                )
            }   
            else {
                const response = await axios.get(`${BASE_URL}pokemon/${pokeDexId}`)
                const responseData = response.data

                const secondResponse = await axios.get(`${BASE_URL}pokemon-species/${pokeDexId}`)
                const secondResponseData = secondResponse.data
                
                let englishFlavorText = null
                
                for (const entry of secondResponseData.flavor_text_entries) {
                    if (entry.language.name === 'en') {
                      englishFlavorText = entry.flavor_text
                      break  
                    }
                  }

                  const ability = await Promise.all(
                    responseData.abilities.map(async (abilityData) => {
                        const abilityResponse = await axios.get(abilityData.ability.url)
                        const abilityName = abilityData.ability.name
                
                        // Find the first English flavor text entry
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
                  const pokemon = {
                    pokemonName: responseData.name,
                    pokeDexId: responseData.id,
                    description: englishFlavorText,
                    front: responseData.sprites.front_default,
                    home: responseData.sprites.other.home.front_default,
                    abilities: ability,
                    type: responseData.types.map(typeData => typeData.type.name),
                    stats: responseData.stats.map(statsData => ({
                        statName: statsData.stat.name, 
                        statData: statsData.base_stat
                        })),
                    caught: true,
                    caughtOrPurchased: newdate,
                    pokeBall: ballType,
                    trainer: reqUser._id     

                }
                  
                const newPokemon = await PokeMon.create(pokemon)
                console.log("This is the created POKEMON: ", newPokemon)
                user.pokemon.push(newPokemon._id)
                await user.save()
                return res.status(200).json({pokemon: newPokemon, catchingPokemonMsg: `Gotcha! ${newPokemon.pokemonName} has been caught! `, changeToPokeball: true})
            }
        } catch (error) {
            console.log("This is the error msg:", error)
            return res.status(400).json({ error: error.message })
        }
}


const searchPokemon = async (req, res) => {
    

    try {
        const { pokemonName } = req.query
        console.log("this is the query pokemon Id or name: ", pokemonName)
        const lowercaseSearch = pokemonName.toLowerCase()
        console.log("this is the query lowercaseSearch: ",lowercaseSearch)
        const response = await axios.get(`${BASE_URL}pokemon/${ lowercaseSearch }`)
        
        const responseData = response.data

        const pokemon = {
            pokemonName: responseData.name,
            pokeDexId: responseData.id,
            home: responseData.sprites.other.home.front_default,
        }
        res.status(200).json(pokemon)
    }
    catch(error){
        const { pokemonName } = req.query

        console.log("This is the catch of the search function: ", error)
        if (!isNaN(parseInt(pokemonName))) {
            console.log("This is integer if statement was hit: ", pokemonName)
            return res.status(404).json({spellingOrIdError: `${pokemonName} is not a valid National PokeDex ID`, SearchErrorMessage: error.message})
        }
        else {
            console.log("This is spelling if statement was hit: ", pokemonName)
            return res.status(404).json({spellingOrIdError: `${pokemonName} is not a valid pokemon. Please check spelling.`, SearchErrorMessage: error.message}) 
        }
    }  
}    



module.exports = {
    getRan: geRandomPokemon,
    show: showPokemon,
    encounter: encounterPokemon,
    catch: catchPokemon,
    search: searchPokemon
}





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

        let price = 0
        const pokemonArray = []

        for(let i = 0; i < 10; i++) {
            const allRegions = getRandomNumber(1, 905)
            const response = await axios.get(`${BASE_URL}pokemon/${allRegions}`)
            const responseData = response.data
            
            const secondResponse = await axios.get(`${BASE_URL}pokemon-species/${allRegions}`)
            const secondData = secondResponse.data

            if(secondData.is_legendary === false && secondData.is_mythical === false) {
                price = 1000
            }
            else if(secondData.is_legendary === true && secondData.is_mythical === false) {
                price = 10000
            }
            else if(secondData.is_mythical === true && secondData.is_legendary === false) {
                price = 50000
            }


            const pokemon = {
                pokemonName: responseData.name,
                pokeDexId: responseData.id,
                home: responseData.sprites.other.home.front_default,
                price: price
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
        front: responseData.sprites.front_default,
        back: responseData.sprites.back_default,
        dreamWorld: responseData.sprites.other.dream_world.front_default,
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

    res.status(200).json(pokemon)

}
catch(error){
    console.log(error)
    res.status(400).json({error: error.message})
}   
}

const catchPokemon = async (req, res) => {
    try {
        let dateObj = new Date()
        let month = dateObj.getUTCMonth() + 1 
        let day = dateObj.getUTCDate()
        let year = dateObj.getUTCFullYear()

        newdate = `${month}/${day}/${year}`
        const pokeName = req.body.pokemonName
        const ballType = req.body.ballType
        
        
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
    
            const catching = getRandomNumber(1, 100)
    
            if (catching * catchRateModifier <= 50 ) {
                return res.status(200).json(`${pokeName} broke free!!`)
            } else if (catching * catchRateModifier <= 85) {
                return res.status(200).json('Darn! Almost caught!')
            } 
            else {
                const response = await axios.get(`${BASE_URL}pokemon/${pokeName}`)
                const responseData = response.data

                const secondResponse = await axios.get(`${BASE_URL}pokemon-species/${pokeName}`)
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
                        const abilityDescription = abilityResponse.data.effect_entries.find(
                            (entry) => entry.language.name === 'en'
                        )
                        return {
                            name: abilityName,
                            description: abilityDescription ? abilityDescription.effect : 'No description available',
                        }
                    })
                )
                  const pokemon = {
                    pokemonName: responseData.name,
                    pokeDexId: responseData.id,
                    description: englishFlavorText,
                    front: responseData.sprites.front_default,
                    back: responseData.sprites.back_default,
                    dreamWorld: responseData.sprites.other.dream_world.front_default,
                    home: responseData.sprites.other.home.front_default,
                    abilities: ability,
                    type: responseData.types.map(typeData => typeData.type.name),
                    stats: responseData.stats.map(statsData => ({
                        statName: statsData.stat.name, 
                        statData: statsData.base_stat
                        })),
                    caught: true,
                    caughtOrPurchased: newdate,
                    pokeBall: ballType    

                }
                  
                const newPokemon = await PokeMon.create(pokemon)

                return res.status(200).json(`Gotcha! ${pokeName} has been caught! `)
            }
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    }


const searchPokemon = async (req, res) => {
    

    try {
        const { pokemonName } = req.query
        console.log("this is the query name: ", pokemonName)
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
        console.log(error)
        res.status(400).json({error: error.message})
    }  
}    


module.exports = {
    getRan: geRandomPokemon,
    show: showPokemon,
    encounter: encounterPokemon,
    catch: catchPokemon,
    search: searchPokemon
}





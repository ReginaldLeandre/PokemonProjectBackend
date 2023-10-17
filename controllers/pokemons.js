/***************************************************************************************
 *                                        IMPORTS
 **************************************************************************************/
const axios = require('axios')
const { PokeMon } = require('../models')
const BASE_URL = process.env.BASE_URL



function getRandomNumber(min, max) {
    min = Math.ceil(min); 
    max = Math.floor(max); 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

const geRandomPokemon = async (req, res) => {

    try {

        
        const pokemonArray = []

        for(let i = 0; i < 10; i++) {
            const allRegions = getRandomNumber(1, 905)
            const response = await axios.get(`${BASE_URL}pokemon/${allRegions}`)
            const responseData = response.data


            const pokemon = {
                name: responseData.name,
                pokeDexId: responseData.id,
                front: responseData.sprites.front_default,
                back: responseData.sprites.back_default,
                dreamWorld: responseData.sprites.other.dream_world.front_default,
                type: responseData.types.map(typeData => typeData.type.name),
                stats: responseData.stats.map(statsData => ({
                    statName: statsData.stat.name, 
                    statData: statsData.base_stat
                    })),

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
        englishFlavorText = entry.flavor_text;
        break  
      }
    }


    const pokemon = {
        name: responseData.name,
        pokeDexId: responseData.id,
        description: englishFlavorText,
        front: responseData.sprites.front_default,
        back: responseData.sprites.back_default,
        dreamWorld: responseData.sprites.other.dream_world.front_default,
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


const catchPokemon = async (req, res) => {
    const allRegions = getRandomNumber(1, 905)
    const response = await axios.get(`${BASE_URL}pokemon/${allRegions}`)
    const responseData = response.data

    const secondResponse = await axios.get(`${BASE_URL}pokemon-species/${allRegions}`)
    const secondResponseData = secondResponse.data

    let englishFlavorText = null

    for (const entry of secondResponseData.flavor_text_entries) {
      if (entry.language.name === 'en') {
        englishFlavorText = entry.flavor_text;
        break  
      }
    }

    const pokemon = {
        name: responseData.name,
        pokeDexId: responseData.id,
        description: englishFlavorText,
        front: responseData.sprites.front_default,
        back: responseData.sprites.back_default,
        dreamWorld: responseData.sprites.other.dream_world.front_default,
        type: responseData.types.map(typeData => typeData.type.name),
        stats: responseData.stats.map(statsData => ({
            statName: statsData.stat.name, 
            statData: statsData.base_stat
            })),

    }






}


module.exports = {
    getRan: geRandomPokemon,
    show: showPokemon
    // catch: catchPokemon,
}














// const catchPokemon = async (req, res) => {
//     try {
//         const pokemonName = req.body.name; 
//         //console.log(pokemonName)

//         const foundPokemon = await PokeMon.findOne({ name: pokemonName });

//         if (!foundPokemon) {
//             return res.status(404).json({ error: `Pokemon ${pokemonName} not found.` });
//         }

//         if (foundPokemon.caught) {
//             return res.status(200).json(`You already caught ${foundPokemon.name}`);
//         }

//         const catching = getRandomNumber(1, 100);

//         if (catching <= 50) {
//             return res.status(200).json(`${foundPokemon.name} broke free!!`);
//         } else if (catching <= 85) {
//             return res.status(200).json('Darn! Almost caught!');
//         } else {
//             foundPokemon.caught = true;
//             await foundPokemon.save();
//             return res.status(200).json(`${foundPokemon.name} has been caught!`);
//         }
//     } catch (error) {
//         return res.status(400).json({ error: error.message });
//     }
// }
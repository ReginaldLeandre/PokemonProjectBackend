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

const geRandomtPokemon = async (req, res) => {

    try {
        const hoennRegion = getRandomNumber(1, 386)
        const response = await axios.get(`${BASE_URL}pokemon/${hoennRegion}`)
        const responseData = response.data

        const pokemon = {
            name: responseData.name,
            pokeDexId: responseData.id,
            front: responseData.sprites.front_default,
            back: responseData.sprites.back_default,
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
        res.status(400).json(error)
    }   
}




module.exports = {
    getRan: geRandomtPokemon
}



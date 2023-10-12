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

        const foundPokemon = await PokeMon.findOne({name: pokemon.name})

        if(!foundPokemon) {
            const newPokemon = await PokeMon.create(pokemon)
            res.status(200).json(newPokemon)
        }
        else {
            res.status(200).json(await PokeMon.findOne({name: pokemon.name}))
        }
        
    }
    catch(error){
        console.log(error)
        res.status(400).json({error: error.message})
    }   
}



const catchPokemon = async (req, res) => {
    try {
        const pokemonName = req.body.name; 
        console.log(pokemonName)

        const foundPokemon = await PokeMon.findOne({ name: pokemonName });

        if (!foundPokemon) {
            return res.status(404).json({ error: `Pokemon ${pokemonName} not found.` });
        }

        if (foundPokemon.caught) {
            return res.status(200).json(`You already caught ${foundPokemon.name}`);
        }

        const catching = getRandomNumber(1, 100);

        if (catching <= 50) {
            return res.status(200).json(`${foundPokemon.name} broke free!!`);
        } else if (catching <= 85) {
            return res.status(200).json('Darn! Almost caught!');
        } else {
            foundPokemon.caught = true;
            await foundPokemon.save();
            return res.status(200).json(`${foundPokemon.name} has been caught`);
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}






module.exports = {
    getRan: geRandomtPokemon,
    catch: catchPokemon,
}



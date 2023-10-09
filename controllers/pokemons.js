/***************************************************************************************
 *                                        IMPORTS
 **************************************************************************************/
const axios = require('axios');
const { PokeMon } = require('../models')
const BASE_URL = process.env.BASE_URL



function getRandomNumber(min, max) {
    min = Math.ceil(min); 
    max = Math.floor(max); 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

const getPokemon = async () => {
    const response = await axios.get()
}






/***************************************************************************************
 *                                        DEPENDENCIES
 **************************************************************************************/
require('dotenv').config();
require('./config/database')
const express = require('express');
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')



const pokemonRouter = require('./routes/pokemons')
const cartRouter = require('./routes/carts')

















/***************************************************************************************
 *                                        APP CONFIG
 **************************************************************************************/
const { PORT } = process.env
const app = express()



























/***************************************************************************************
 *                                        MIDDLEWARE
 **************************************************************************************/
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json());


























/***************************************************************************************
 *                                        ROUTER MIDDELWARE
 **************************************************************************************/
app.use('/api', pokemonRouter)
app.use('/cart', cartRouter)

























/***************************************************************************************
 *                                        SERVER
 **************************************************************************************/
app.listen(PORT, ()=> console.log(`Listening on port: ${PORT}`))
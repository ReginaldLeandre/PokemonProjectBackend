/***************************************************************************************
 *                                        DEPENDENCIES
 **************************************************************************************/
require('dotenv').config();
require('./config/database')
const express = require('express');
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const path = require('path')


const pokemonRouter = require('./routes/pokemons')
const cartRouter = require('./routes/carts')
const authRouter = require('./routes/auth-router')
















/***************************************************************************************
 *                                        APP CONFIG
 **************************************************************************************/
const { PORT } = process.env
const app = express()
const picturesPath = path.join(__dirname, 'pokeballs')


























/***************************************************************************************
 *                                        MIDDLEWARE
 **************************************************************************************/
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json());
app.use('/pokeballs', express.static(picturesPath))

























/***************************************************************************************
 *                                        ROUTER MIDDELWARE
 **************************************************************************************/
app.use('/api', pokemonRouter)
app.use('/cart', cartRouter)
app.use('/auth', authRouter)
























/***************************************************************************************
 *                                        SERVER
 **************************************************************************************/
app.listen(PORT, ()=> console.log(`Listening on port: ${PORT}`))
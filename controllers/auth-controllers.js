const { User, PokeMon } = require("../models")
const bcrypt = require("bcrypt")
const { createUserToken } = require("../middleware/auth-middleware")



async function register (req, res) {
  
  try {

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(req.body.password, salt)

    const cachedPW = req.body.password
    

    req.body.password = passwordHash
    

    const newUser = await User.create(req.body)

		if (newUser) {
      req.body.password = cachedPW
      const authenticatedUserToken = createUserToken(req, newUser)
      res.status(201).json({
        user: newUser,
        token: authenticatedUserToken,
      })
    } else {
      res.status(400).json({createUserError: "There was an issue creating this user."})
    }
  } catch (err) {
    res.status(400).json({ error : err.message })
  }
}

async function login(req, res ) {
  try {
    const loggingUser = req.body.username
    const foundUser = await User.findOne({ username: loggingUser })
    const token = await createUserToken(req, foundUser)

    res.status(200).json({
      user: foundUser,
      token,
    })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
}

async function logout (req, res) {
  try {
    res.status(200).json({
      token: ""
		
    })

  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

const pokeBallShowForCatchPage = async (req, res) => {
  try {
    const reqUser = req.user
    const user = await User.findById(reqUser._id)
    return res.status(200).json({availableBalls: user.pokeballs})

  }
  catch (err) {
    res.status(400).json({ GettingPokeBallsForCatchError: err.message })
  }
}


const show = async (req, res) => {
  try {
    const reqUser = req.user
    const user = await User.findById(reqUser._id)
    const allUserPokemon = await PokeMon.find({trainer: reqUser._id})
    const allUserPokeBall = user.pokeballs

    const userShowPageObject = {
      user: user,
      allUserPokemon: allUserPokemon,
      allUserPokeBall: allUserPokeBall
    }

    return res.status(200).json(userShowPageObject)
  }
  catch(error) {
    console.log("This is the user show page error: ", error)
    return res.status(400).json({userShowError: error.message})
  }
}


const userPokemonShow = async (req,res) => {
  try {
    const reqUser = req.user
    const id = req.params.id
    const user = await User.findById(reqUser._id)
    const allUserPokemon = await PokeMon.find({trainer: reqUser._id})

    const matchingPokemon = allUserPokemon.find(pokemon => pokemon.pokeDexId === parseInt(id))

   return res.status(200).json({pokemon: matchingPokemon, user: user})
  }
  catch(error) {
    console.log("This is the user's pokemon show page error: ", error)
    return res.status(400).json({userPokemonShowError: error.message})
  }
}


const letGoOfAllPokemon = async (req, res) => {
  try {
    const reqUser = req.user
    const user = await User.findById(reqUser._id)
    const allUserPokemon = await PokeMon.find({trainer: user._id})
    
    allUserPokemon.forEach(async (pokemon) => {
      await PokeMon.findByIdAndDelete(pokemon._id)
    })
    user.pokemon = []
    await user.save()

    return res.status(200).json({deletedPokemonMsg: "You have deleted all of your pokemon!"})
  }
  catch(error) {
    console.log("This is the user's letGoOfPokemon error: ", error)
    return res.status(400).json({userLetgoPokemonError: error.message})
  }
}


const throwAwayPokeBalls = async (req, res) => {
  try {
    const reqUser = req.user
    const user = await User.findById(reqUser._id)
    user.pokeballs = []
    await user.save()
    res.status(200).json({throwAwayPokeBalls: "You have thrown away all of your pokeballs"})
  }
  catch(error) {
    console.log("This is the user's letGoOfPokemon error: ", error)
    return res.status(400).json({userThrowAwayPokeBallError: error.message})
  }
}

module.exports = {
  register,
  login,
  logout,
  show,
  UpokeShow: userPokemonShow,
  deleteAllPoke: letGoOfAllPokemon,
  deleteAllBall: throwAwayPokeBalls,
  balls4Catch: pokeBallShowForCatchPage
}

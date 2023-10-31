const { User } = require("../models")
const bcrypt = require("bcrypt");
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
      throw new Error("Something went wrong")
    }
  } catch (err) {
    res.status(400).json({ error : err.message });
  }
}

async function login(req, res ) {
  try {
    const loggingUser = req.body.username;
    const foundUser = await User.findOne({ username: loggingUser });
    const token = await createUserToken(req, foundUser);

    res.status(200).json({
      user: foundUser,
      token,
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function logout (req, res) {
  try {
    res.status(200).json({
      token: ""
		
    })

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  register,
  login,
  logout
}

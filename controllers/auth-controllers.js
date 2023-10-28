const { User } = require("../models");
const bcrypt = require("bcrypt");

async function register(req, res, next){
 
  try {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(req.body.password, salt)
 	req.body.password = passwordHash;
 	const newUser = await User.create(req.body)
 	res.status(201).json({
 		user: newUser,
    })
  } catch (err) {
    res.status(400).json({ err: err.message })
  }
}



module.exports = {
	register
}

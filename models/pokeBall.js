const mongoose = require("mongoose");
const Schema = mongoose.Schema



const pokeBallSchema = new Schema({
    ballType: {
        type: String,
        enum: ["Poke Ball", "Great Ball", "Ultra Ball", "Master Ball"],
        default: "Poke Ball"
    },
    quantity: {
      type: Number,
      default: 0,
    },
},
{
    timestamps: true
})



const PokeBall = mongoose.model('PokeBall', pokeBallSchema)
module.exports = PokeBall
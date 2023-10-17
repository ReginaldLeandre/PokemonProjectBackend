const mongoose = require("mongoose");
const Schema = mongoose.Schema




const pokemonSchema = new Schema({
    name: {
        type: String,
    },
    pokeDexId: {
        type: Number
    },
    front: {
        type: String
        //front_default
    },
    back: {
        type: String
        //back_default
    },
    dreamWorld: {
        type: String
    },
    stats: {
        type: [Object]
        //base_stat
        //stat
            //name
    },
    type: {
        type: [String],
        //type
            //name
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    caught: {
        type: Boolean,
        default: false
    },
    pokeBall: {
        type: String,
        default: null
    }

},
{
    timestamps: true
})


const PokeMon = mongoose.model('PokeMon', pokemonSchema);
module.exports = PokeMon;
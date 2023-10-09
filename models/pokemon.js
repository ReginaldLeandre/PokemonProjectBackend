const mongoose = require("mongoose");
const Schema = mongoose.Schema




const pokemonSchema = new Schema({
    name: {
        type: String,
    },
    pokeDexId: {
        type: Number
    },
    sprites: {
        type: Object
        //back_default
        //front_default
    },
    stats: {
        type: [Object]
        //base_stat
        //stat
            //name
    },
    types: {
        type: [String],
        //type
            //name
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }

},{
    timestamps: true
})


const PokeMon = mongoose.model('PokeMon', pokemonSchema);
module.exports = PokeMon;
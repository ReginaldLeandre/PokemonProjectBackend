const mongoose = require("mongoose")
const Schema = mongoose.Schema




const pokemonSchema = new Schema({
    pokemonName: {
        type: String,
    },
    pokeDexId: {
        type: Number
    },
    description: {
        type: String
    },
    front: {
        type: String
        //front_default
    },
    home: {
        type: String
    },
    abilities: {
        type: [Object]
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
    caughtOrPurchased: {
        type: Date,
        default: null
    },
    caught: {
        type: Boolean,
        default: false
    },
    pokeBall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PokeBall',
        default: null
    }

},
{
    timestamps: true
})


const PokeMon = mongoose.model('PokeMon', pokemonSchema)
module.exports = PokeMon
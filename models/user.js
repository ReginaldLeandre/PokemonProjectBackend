const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pokeballs: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "PokeBall",
        default: []
    },
    pokemon: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "PokeMon",
      default: [],
    },
    purchasedAMasterBall: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
     
      transform: (_doc, ret) => {
        delete ret.password
        return ret
      }
    }
  }
)

module.exports = mongoose.model("User", userSchema);
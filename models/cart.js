const mongoose = require("mongoose")
const Schema = mongoose.Schema

const cartSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pokemonItems: [
    {
      pokemon: {
        type: Object,
      },
      quantity: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0
      }
    },
  ],
  pokeBallItems: [
    {
      pokeBall: {
        type: Object
      },
      quantity: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0
      }
    },
  ],
  subTotal: {
    type: Number,
    default: 0
  },
  salesTax: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
},
{
    timestamps: true
})

const Cart = mongoose.model("Cart", cartSchema)
module.exports = Cart
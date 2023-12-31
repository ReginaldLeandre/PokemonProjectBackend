function calculateIndividualPrice(cart) {
    let pokemonCalculatedPrice = 0
    let pokeBallCalculatedPrice = 0
    cart.pokemonItems.forEach((pokemonItem) => {
      const pokemonPrice = pokemonItem.pokemon.price || 0
      pokemonCalculatedPrice += pokemonPrice * pokemonItem.quantity
  
 
      pokemonItem.calcPrice = pokemonPrice * pokemonItem.quantity
    })

    cart.pokeBallItems.forEach((pokeBallItem) => {
      const pokeballPrice = pokeBallItem.pokeBall.price || 0
      pokeBallCalculatedPrice += pokeballPrice * pokeBallItem.quantity


      pokeBallItem.calcPrice = pokeballPrice * pokeBallItem.quantity
    })
  
    return { pokemonCalculatedPrice, pokeBallCalculatedPrice }
  }
  

function calculateTotalPriceOfCart(cart) {
    let subtotal = 0
  
    cart.pokemonItems.forEach((pokemonItem) => {
      const pokemonPrice = pokemonItem.pokemon.price || 0
      subtotal += pokemonPrice * pokemonItem.quantity
    })
  
    cart.pokeBallItems.forEach((pokeBallItem) => {
      const pokeBallPrice = pokeBallItem.pokeBall.price || 0
      subtotal += pokeBallPrice * pokeBallItem.quantity
    })
  

    const salesTaxRate = 0.1
    const salesTax = subtotal * salesTaxRate
  

    const total = subtotal + salesTax
  
    return { subtotal, total, salesTax }
  }
  
  module.exports = {
    calculateTotalPriceOfCart,
    calculateIndividualPrice
  }
  
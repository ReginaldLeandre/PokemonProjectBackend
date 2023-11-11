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
  }
  
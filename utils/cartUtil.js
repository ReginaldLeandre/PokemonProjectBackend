function calculateTotalPriceOfCart(cart) {
    let totalPrice = 0

    
    cart.pokemonItems.forEach((pokemonItem) => {
        const pokemonPrice = pokemonItem.pokemon.price || 0
        totalPrice += pokemonPrice * pokemonItem.quantity
    })

   
    cart.pokeBallItems.forEach((pokeBallItem) => {
        const pokeBallPrice = pokeBallItem.pokeBall.price || 0
        totalPrice += pokeBallPrice * pokeBallItem.quantity
    })

    return totalPrice
}

module.exports = {
    calculateTotalPriceOfCart
}

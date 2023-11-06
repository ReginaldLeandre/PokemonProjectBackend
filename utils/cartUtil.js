function calculateTotalPriceOfCart(cart) {
    let totalPrice = 0;

    // Calculate the total price for pokemon items
    cart.pokemonItems.forEach((pokemonItem) => {
        const pokemonPrice = pokemonItem.pokemon.price || 0;
        totalPrice += pokemonPrice * pokemonItem.quantity;
    });

    // Calculate the total price for pokeBall items
    cart.pokeBallItems.forEach((pokeBallItem) => {
        const pokeBallPrice = pokeBallItem.pokeBall.price || 0;
        totalPrice += pokeBallPrice * pokeBallItem.quantity;
    });

    return totalPrice;
}

module.exports = {
    calculateTotalPriceOfCart
}

function calculateTotalPriceOfCart(cart){
    let totalPrice = 0; 
    cart.products.forEach((product)=> totalPrice += (product.price * product.quantity))
    return totalPrice; 
}
module.exports = {
    calculateTotalPriceOfCart
}
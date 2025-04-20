import './index.css'

const ProductCard = ({ product,isCartItem,addToCart}) => {
    //console.log(product)
   // console.log(isCartItem)
    const addItemToCarts = () => {
        let quantity = prompt(`Enter quantity for ${product.name}:`, '1');
        if (quantity !== null && quantity !== "") {
          quantity = parseInt(quantity);
          if (!isNaN(quantity) && quantity > 0) {
            addToCart(product, quantity);
            //console.log(product,quantity)
          } else {
            alert('Invalid quantity. Please enter a valid number greater than zero.');
          }
        }
    }
    return(
        <li key={product.productId} className="product-card">
            <img src={product.imageUrl} alt={product.name} className="card-image" />
            <h3>{product.name}</h3>
            <p>Rs: {product.pricePerUnit}.00</p>
            {isCartItem ?<button disable="true">In Cart</button>:<button onClick={addItemToCarts}>Order Now</button>}
            {isCartItem && <p>Note*: Go to the cart by clicking on navbar to see the cart items and place order.</p>}
        </li>
    )
}

export default ProductCard
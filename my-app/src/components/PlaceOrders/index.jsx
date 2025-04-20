import {useState,useEffect} from 'react';
import { Link,useNavigate } from 'react-router-dom'
import {Navbar} from "../Navbar"
import successful from '../../assets/successful.jpg'
import './index.css'

const PlaceOrders = () => {
    const [cart, setCart] = useState([])
    const [showForm,setShowForm] = useState(false)
    const [ordersuccess,setOrderSuccess] = useState(false)
    const [orderId,setOrderId] = useState('')
    const [loader,setLoader] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
      const [formError,setFormError] = useState('')
      //const navigate = useNavigate()

    const removeProduct = (id) => {
        const newCart = cart.filter(eachItem=>eachItem.productId!==id);
        setCart(newCart);
        sessionStorage.setItem('cart', JSON.stringify(newCart));
    }


    const validateForm = () => {
        let isValid = true;
        let newErrors;
        if (!formData.name) {
          newErrors = 'Name is required';
          isValid = false;
          setFormError(newErrors);
          return isValid;
        }
        if (!formData.email) {
          newErrors = 'Email is required';
          isValid = false;
          setFormError(newErrors);
          return isValid;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
          newErrors.email = 'Invalid email address';
          isValid = false;
          setFormError(newErrors);
          return isValid;
        }
        if (!formData.phone) {
          newErrors = 'Phone number is required';
          isValid = false;
          setFormError(newErrors);
          return isValid;
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors = 'Invalid phone number. Must be 10 digits.';
            isValid = false;
            setFormError(newErrors);
            return isValid;
        }
        if (!formData.address) {
          newErrors = 'Address is required';
          isValid = false;
          setFormError(newErrors);
          return isValid;
        }
    
        setFormError();
        return isValid;
      };

      const placeOrder = async (event) => {
        event.preventDefault()
        if (!validateForm()) {
          return;
        }
        setLoader(true)
        const orderData = {
            ...formData,
            items: cart,
            totalPrice: cart.reduce((total, item) => total + (item.pricePerUnit * item.quantity), 0),
        };
        setFormError('')
        try {
            const response = await fetch('https://veggis-fruits-backend.onrender.com/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(orderData),
            });
            const data = await response.json()
            if(response.ok){
                sessionStorage.removeItem('cart');
                setCart([]);
                setShowForm(false)
                setOrderId(data.orderId)
                setOrderSuccess(true)
                setLoader(false)
                //setOrderMessage('success')
            }else{
                setFormError('Something went wrong. Please try again')
            }
        }catch(error){
            setFormError('Something went wrong. Please try again')
            console.log(error)
        }finally{
            setLoader(false)
        }
    }



    useEffect(() => {
    const cartItems = sessionStorage.getItem('cart');
    try {
        const parsedCart = cartItems ? JSON.parse(cartItems) : [];
        setCart(parsedCart);
    } catch (error) {
        console.error("Error parsing cart data from sessionStorage:", error);
        setCart([]);
         }
    }, []);


    if(cart.length==0 && !ordersuccess){
        return(
            <>
            <Navbar></Navbar>
            <div className='no-items-container'>
                <h1>No Item avaliable to place order.</h1>
                <p>Go to home page to add itmes <Link to='/user'>here</Link>.</p>
            </div>
            </>
        )
    }

    return(
    <>
    <Navbar></Navbar>
    {!ordersuccess && <div className='place-order-btn-conatainer'>
    <button className='place-order-btn' onClick={()=>setShowForm(true)}>Place Order</button>
    </div>}
    <div className='place-order-container'>
    {showForm && (
        <div className='form-container'>
            <form>

                <h3>Enter Details & place Order</h3>
                {formError?<p className='error-message'>Error: *{formError}</p>:""}

                <label htmlFor='name'>Name:</label><br />
                <input type='text' id='name' placeholder='Enter Your Name' value={formData.name} onChange={(event)=>setFormData({...formData,name:event.target.value})} /><br />
                <label htmlFor='email'>Email:</label><br />
                <input type='email' id='email' placeholder='Enter Your Email' value={formData.email} onChange={(event)=>setFormData({...formData,email:event.target.value})} /><br />
                <label htmlFor='phone-number'>Phone:</label><br />
                <input type='phone number' id='phone-number' placeholder='Enter Your Phone Number' value={formData.phone} onChange={(event)=>setFormData({...formData,phone:event.target.value})} /><br />
                <label htmlFor='address'>Address:</label><br />
                <textarea id='address' value={formData.address} cols={20} rows={3} onChange={(event)=>setFormData({...formData,address:event.target.value})}></textarea><br />
                <button onClick={placeOrder}>{loader?"submitting..." : "Place Order"}</button>
                <button className='close-btn' onClick={()=>setShowForm(false)}>Close</button>
            </form>
        </div>
    )}

    {ordersuccess && (
        <div className='form-container'>
            <section className='section-item'>
                <img src={successful} alt='success' />
                <h3>Your Order Placed Successfully</h3>
                <p>Your order Id is <span className='order-id'>{orderId}</span></p>
                <span>Note*: Please keep this order id safe. You can track the order using this order id</span><br />
                <Link to='/user' className='link'>Contuine Shopping</Link>
            </section>
        </div>
    )}

        <ul className='cart-items-container'>
            {cart.map(eachItem=>
                (<li key={eachItem.productId}>
                    <div>
                        <section className='image-title-section'>
                        <img src={eachItem.imageUrl} alt={eachItem.name} className='cart-image' />
                        <h3>{eachItem.name}</h3>
                        </section>
                        <section className='cart-price-quantity-section'>
                        <span>Price Per Unit: {eachItem.pricePerUnit}.00</span>
                        <span>Quantity: {eachItem.quantity}</span>
                        <span>Total: {eachItem.pricePerUnit*eachItem.quantity}.00</span>
                        </section>
                    </div>
                    <hr />
                    <button className='remove-product' onClick={() => removeProduct(eachItem.productId)}>Remove product</button>
                </li>)
            )}
        </ul>


    </div>
    </>
    )
}

export default PlaceOrders;
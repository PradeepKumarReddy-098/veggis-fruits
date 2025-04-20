import { useState,useEffect } from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {Navbar} from "../Navbar";
import ProductCard from "../ProductCard";
import Banner from '../../assets/Bannermain.jpg'
import Banner1 from '../../assets/Banner1.jpg'
import Banner2 from '../../assets/Banner2.jpg'
import Banner3 from '../../assets/Banner3.jpg'
import Banner4 from '../../assets/Banner4.jpg'
import './index.css'

const Home = () => {
    const [products,setProducts] = useState([]);
    const [loader,setLoader] = useState(false);
    const [error,setError] = useState(false);
    const cart = JSON.parse(sessionStorage.getItem('cart')) || []
    const [cartItems, setCartItems] = useState(cart);


    useEffect(() => {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('cart', JSON.stringify(cartItems));
      }
    }, [cartItems]);

    useEffect(()=>{
        const fetchProducts = async () => {
            setLoader(true)
            setError(false)
            try {
              const response = await fetch('https://veggis-fruits-backend.onrender.com/products');
              if (!response.ok) {
                setError(true)
                throw new Error(`Failed to fetch products: ${response.status}`);
              }
              const data = await response.json();
              setProducts(data.products);
            } catch (err) {
                console.log(err)
                setError(true)
              //setError(err.message || 'An error occurred while fetching products.');
            } finally {
              setLoader(false);
            }
          };
      
          setLoader(true);
          fetchProducts();
    },[]);

    const tryAgain = () => {
      const fetchProducts = async () => {
        setLoader(true)
        setError(false)
        try {
          const response = await fetch('https://veggis-fruits-backend.onrender.com/products');
          if (!response.ok) {
            setError(true)
            throw new Error(`Failed to fetch products: ${response.status}`);
          }
          const data = await response.json();
          setProducts(data.products);
        } catch (err) {
            console.log(err)
          //setError(err.message || 'An error occurred while fetching products.');
        } finally {
          setLoader(false);
        }
      };
  
      setLoader(true);
      fetchProducts();
    }

    const addToCart = (product, quantity) => {
      let updatedCart = [...cartItems];
      updatedCart.push({ ...product, quantity });
      setCartItems(updatedCart);
    };

    if(loader){
        return(
            <div className="loader">Loading......</div>
        )
    }

    if(error){
      return(
        <section className="no-products-section">
          <h2>Failed to featch the products</h2>
          <button onClick={tryAgain}>Try again</button>
        </section>
      )
    }

    return(
      <>
      <Navbar></Navbar>
    <div className="Home-container">
      <div className="carousel-container">
        <img src={Banner} alt="image" className="banner-image" />
        <img src={Banner1} alt="image" className="banner-image1" />
      </div>
      {products.length>0 && (<h1 className="heading">All Products</h1>)}
      {products.length>0 ? <ul className="products-container">
        {products.map(eachItem=><ProductCard key={eachItem.productId} product={eachItem}
        addToCart = {addToCart}
        isCartItem = {cartItems.some(item => item.productId === eachItem.productId)}
        />)}
      </ul>:<section className="no-products-section">
          <h2>No Products avaliable try to add the products</h2>
          <button onClick={tryAgain}>Try again</button>
        </section>}


    </div>
    </>
    )
}

export default Home
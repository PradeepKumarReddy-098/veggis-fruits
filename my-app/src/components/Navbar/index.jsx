import { useNavigate } from 'react-router-dom'
import './index.css'

const Navbar = () => {
    return (
        <nav>
            <span className="Logo"><a href='/' className='logo'>Veggis/Fruits</a></span>
            <div>
                <a href='/user'>Home</a>
                <a href='/place-order'>Cart</a>
                <a href='/track-orders'>Track Order</a>
            </div>
        </nav>
    )

}

const AdminNavbar = () => {
    return (
        <nav>
            <span className="Logo"><a href='/' className='logo'>Veggis/Fruits</a></span>
            <div>
                <a href='/admin'>Home</a>
                <a href='/admin/add-product'>Add Product</a>
                <a href='/admin/orders'>All Orders</a>
            </div>
        </nav>
    )
}

export {Navbar,AdminNavbar}
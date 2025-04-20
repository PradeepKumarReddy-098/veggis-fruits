import { Link } from "react-router-dom"
import addmin from '../../assets/admin.jpg'
import user from '../../assets/user.png'
import './index.css'

const Welcolme = () =>{
    return(
        <div className="welcome-container">
            <section className="welcome-section">
                <h1>Hello, user</h1>
                <h2>Explore as </h2>
                <div className="w-container">

                <Link to='/user' className="welcome-link">
                <img src={user} alt="normal user" className="welcome-image" />
                <h4>Normal User</h4>
                </Link>

                <h2>OR</h2>

                <Link to='/admin' className="welcome-link">
                <img src={addmin} alt="admin-user" className="welcome-image"/>
                <h4>Admin</h4>
                </Link>

                </div>
            </section>
        </div>
    )
}

export default Welcolme
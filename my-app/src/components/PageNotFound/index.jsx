import { Link } from 'react-router-dom'
import Notfound from '../../assets/Notfound.jpg'
import './index.css'

const PageNotFound = () => {
    return(
        <div className='not-found-container'>
            <img src={Notfound} alt='Not Found' className='not-found-image' />
            <h1>Page Not Found</h1>
            <p>Move to Home Page <Link to='/'>here</Link></p>
        </div>
    )
}

export default PageNotFound;
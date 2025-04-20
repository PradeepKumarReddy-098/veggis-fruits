import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './components/Home'
import PlaceOrders from './components/PlaceOrders'
import TrackOrder from './components/TrackOrder'
import OrderList from './components/Orders'
import AddProduct from './components/AddProduct'
import AdminProducts from './components/AdminProducts'
import Welcolme from './components/Welcome'
import PageNotFound from './components/PageNotFound'
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Welcolme></Welcolme>} />
      <Route path='/user' element={<Home></Home>} />
      <Route path='/place-order' element={<PlaceOrders></PlaceOrders>} />
      <Route path='/track-orders' element={<TrackOrder></TrackOrder>}/>
      <Route path='/admin/orders' element={<OrderList></OrderList>} />
      <Route path='/admin/add-product' element={<AddProduct></AddProduct>} />
      <Route path='/admin' element={<AdminProducts></AdminProducts>} />
      <Route path='*' element={<PageNotFound></PageNotFound>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App

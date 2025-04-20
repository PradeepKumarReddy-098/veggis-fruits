import {useState} from 'react'
import {Navbar} from "../Navbar"
import './index.css'

const TrackOrder = () => {
    const [orderId,setOrderId] = useState('')
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [orderDetails,setOrderDetails] =useState({})
    const [loader,setLoader] = useState(false)
    const [error,setError] = useState('')
    console.log(orderDetails)

    const getOrderDetails = async(e) => {
        e.preventDefault();
        if(!orderId){
            setError('Plese enter the order Id')
        }
        setLoader(true)
        try{
            const response = await fetch(`https://veggis-fruits-backend.onrender.com/api/orders/${orderId}`);
            const data = await response.json()
            //console.log(data)
            if(response.ok){
                setOrderDetails(data)
            }else{
                setError(data.error)
            }
        }catch(error){
            setError('Some internal error occur')
            console.log(error)
        }finally{
            setLoader(false)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'red';
            case 'delivered':
                return 'green';
            case 'in progress':
                return 'orange';
            default:
                return 'gray';
        }
    };


    return(
        <>
        <Navbar></Navbar>
        {!orderDetails.items ? <div className="trackOrder-container">
            <form>
                {error && <p className='error-para'>Error: {error}</p>}
                <h2>Enter Order Details</h2>
                <label htmlFor="orderId">Order Id</label><br />
                <input type="text" placeholder="enter order Id" id="orderId" value={orderId} onChange={(e)=>setOrderId(e.target.value)} required /><br />
                <label htmlFor="name">Name</label><br />
                <input type="text" placeholder="enter name" id="name" value={name} onChange={(e)=>setName(e.target.value)} /><br />
                <label htmlFor="email">Name</label><br />
                <input type="email" placeholder="enter email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} /><br />
                <button type='button' onClick={getOrderDetails} disable={loader?'true':'false'}>{loader?'submitting...':'submit'}</button>
            </form>
        </div>:<div className='order-details-container'>
            <div className='order-details'>
                <div className='user-details-status-sections'>
                <section>
                    <h2>Hello, {orderDetails.name}</h2>
                    <p>Email: {orderDetails.email}</p>
                    <p>Mobile: {orderDetails.phone}</p>
                </section>
                <section>
                    <h2>Status: <span style={{ color: getStatusColor(orderDetails.status) }}>{orderDetails.status}</span></h2>
                    <p>Ordered Date: <span>{orderDetails.order_date}</span></p>
                </section>
                </div>
                <h3 className='summary'>Summary</h3>
                <h4>OrderId: {orderDetails.order_id}</h4>
                <h3>Products</h3>
                <ul className='order-details-list'>
                    {orderDetails.items.map(eachProduct=>(
                        <li key={eachProduct.productId}>
                            <p>Product: {eachProduct.name}</p>
                            <p>Quantity: {eachProduct.quantity}</p>
                            <p>Price: {eachProduct.pricePerUnit}</p>
                        </li>
                    ))}
                </ul>
                <span>Grand Total: {orderDetails.total_price}</span>
            </div>
            </div>}
        </>

    )
}

export default TrackOrder

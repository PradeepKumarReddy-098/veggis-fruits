import React, { useState, useEffect } from 'react';
import OrderItem from '../OrderItems';
import { AdminNavbar } from '../Navbar';
import './index.css'

const OrderList = () =>{
    const [orders, setOrders] = useState([]);
    const [loader,setLoader] = useState(false)

    useEffect(() => {
         const getOrderDetails = async()=>{
            setLoader(true)
        try{
            const response = await fetch(`https://veggis-fruits-backend.onrender.com/api/orders`)
            const data = await response.json()
        if(response.ok){
            setOrders(data.orders)
            
        }else{
            console.log(data)
        }
        }catch(error){
            console.log(error)
        }finally{
            setLoader(false)
        }
    } 

    getOrderDetails()

    }, []);

    const handleUpdateStatus = async(orderId, newStatus) => {
        try{
            const response = await fetch(`https://veggis-fruits-backend.onrender.com/api/orders/${orderId}`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }),
            });
            const result = await response.json()
            if(response.ok){
                alert('status updated successfully')
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.order_id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            }else {
                console.error('Failed to update order status');
            }
        }catch(error){
            console.error('Error updating order status:', error)
        }
    };

    if(loader){
        return(
            <div className="loader">Loading......</div>
        )
    }

    return (
        <>
        <AdminNavbar></AdminNavbar>
        <div className='all-orders-container'>
            <h1 className='heading'>Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className="order-list">
                    {orders.map(order => (
                        <OrderItem key={order.order_id} order={order} onUpdateStatus={handleUpdateStatus} />
                    ))}
                </ul>
            )}
        </div>
        </>
    );
}

export default OrderList
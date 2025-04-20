import React, { useState } from 'react';
import './index.css'

function OrderItem({ order, onUpdateStatus }) {
    const [status, setStatus] = useState(order.status);
    const items = JSON.parse(order.items)

    const statusChange = (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        onUpdateStatus(order.order_id, newStatus);
    };

    return (
        <li className="order-item">
            <p><strong>Order ID:</strong> {order.order_id}</p>
            <p><strong>Buyer:</strong> {order.name} ({order.email}, {order.phone})</p>
            <p><strong>Delivery Address:</strong> {order.address}</p>
            <p><strong>Total Price:</strong> Rs{order.total_price.toFixed(2)}</p>
            <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
            <p><strong>Current Status: </strong>{order.status}</p>
            <label htmlFor={`status-${order.order_id}`}>Change Status:</label>
                <select
                    id={`status-${order.order_id}`}
                    className="status-select"
                    value={status}
                    onChange={statusChange}
                >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="delivered">Delivered</option>
                </select>
            <h5>Order Products: </h5>
            <ul className='ordered-products'>
                {items.map(eachItem=><li key={eachItem.productId} className='ordered-product-li'>
                    <p><strong>Product Name:</strong> {eachItem.name}</p>
                    <p><strong>Product Price:</strong> {eachItem.pricePerUnit}</p>
                    <p><strong>Product Quantity:</strong> {eachItem.quantity}</p>
                </li>)}
            </ul>
            <div>
            </div>
        </li>
    );
}

export default OrderItem;
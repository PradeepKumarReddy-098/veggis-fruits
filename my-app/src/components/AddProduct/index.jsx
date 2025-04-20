import { useState } from "react";
import { AdminNavbar } from "../Navbar"
import './index.css'

const AddProduct = () => {
    const [newProduct, setNewProduct] = useState({ name: '', price_per_unit: '', image_url: '' });
    const [requestSuccess,setResquestSuccese] = useState(false)
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const handleAddProduct = async(event) =>{
        event.preventDefault();
        if(!newProduct.name || !newProduct.price_per_unit || !newProduct.image_url){
            setError('All fields are required. Please fill all the fields')
            return
        }
        setLoading(true)
        setError('')
        try{
            const response = await fetch('https://veggis-fruits-backend.onrender.com/api/products', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
              })
              const result = await response.json()
              if(response.ok){
                setResquestSuccese(true)
                setNewProduct({ name: '', price_per_unit: '', image_url: '' })
              }
              else{
                setError('Error in adding the Product!')
              }
            
        }catch(err){
            console.error('Failed to add the product')
            setError('Error in adding the Product')
        }finally{
            setLoading(false)
        }
    }

  

    return(
        <>
       <AdminNavbar></AdminNavbar>
       <div className="add-product-container">
        <h1>Inventory Management</h1>

        <div className="add-product">
            <h2>Add New Item</h2>
            {requestSuccess && <h4 className="successful-add">Product Added Successfully</h4>}
            {error && <p className="error-msg">*{error}</p>}
            <form onSubmit={handleAddProduct}>
            <div className="form-group">
                <label htmlFor="name">Product Name:</label>
                <input type="text" id="name" name="name" value={newProduct.name} onChange={(event)=>setNewProduct({...newProduct,name:event.target.value})} required />
            </div>
            <div className="form-group">
                <label htmlFor="price_per_unit">Product Price per Unit:</label>
                <input type="number" id="price_per_unit" name="price_per_unit" value={newProduct.price_per_unit} onChange={(event)=>setNewProduct({...newProduct,price_per_unit:event.target.value})} required />
            </div>
            <div className="form-group">
                <label htmlFor="image_url">Product Image URL:</label>
                <input type="text" id="image_url" name="image_url" value={newProduct.image_url} onChange={(event)=>setNewProduct({...newProduct,image_url:event.target.value})} required  />
            </div>
            <button className="add-product-btn" type="submit" disable={loading?'true':'false'}>{loading?'Submitting....':'submit'}</button>
            </form>
        </div>
        </div>
      </>
    )
}

export default AddProduct
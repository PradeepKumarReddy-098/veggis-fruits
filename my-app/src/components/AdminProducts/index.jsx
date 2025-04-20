import { useState,useEffect } from "react"
import { AdminNavbar } from "../Navbar";
import AdminProduct from "../AdminProduct";
import './index.css'

const AdminProducts = () => {
    const [products,setProducts] = useState([]);
    const [loader,setLoader] = useState(false);
    const [error,setError] = useState(false)
    const [editingProductId, setEditingProductId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: "", pricePerUnit: "", imageUrl: "" });
    //console.log(products)

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

    useEffect(()=>{
          fetchProducts();
    },[]);

    const tryAgain = () => {
        fetchProducts()
    }

    const onDeleteProduct = async(id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
              const response = await fetch(`https://veggis-fruits-backend.onrender.com/api/products/${id}`, {
                method: "DELETE",
              });
              if (!response.ok) {
                alert(`Failed to delete product`);
              }
              setProducts(products.filter((product) => product.productId !== id));
              alert("Product deleted successfully")
            } catch (err) {
              console.error("Error deleting product:", err);
              alert("Failed to delete product.");
            }
          }
    }

    const edit = (product) => {
        setEditingProductId(product.productId);
        setEditFormData({
          name: product.name,
          pricePerUnit: product.pricePerUnit,
          imageUrl: product.imageUrl,
        });
      };
    
      const editFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const saveEdit = async (id) => {
        try {
          const response = await fetch(`https://veggis-fruits-backend.onrender.com/api/products/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editFormData),
          });
          if (!response.ok) {
            alert("Failed to update product.");
          }
          const updatedProducts = products.map((product) =>
            product.productId === id ? { ...product, ...editFormData } : product
          );
          alert('Product udated successfully')
          setProducts(updatedProducts);
          setEditingProductId(null);
        } catch (err) {
          console.error("Error updating product:", err);
          alert("Failed to update product.");
        }
      };
    
      const cancelEditItem = () => {
        setEditingProductId(null);
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
        <AdminNavbar></AdminNavbar>
        <div className="admin-container">
        <h1 className="main-head">All Avaliable Products</h1>
        {products.length>0 ? <ul className="all-avaliable-products">
            {products.map(eachItem=><AdminProduct key={eachItem.productId} 
            onDelete = {onDeleteProduct} 
            product={eachItem}
            onEdit={edit}
            isEditing={editingProductId === eachItem.productId}
            editFormData={editFormData}
            formChange={editFormChange}
            onSaveEdit={saveEdit}
            onCancelEdit={cancelEditItem}
            />)}
        </ul>:<section className="no-products-section">
            <h2>No Products avaliable try to add the products</h2>
            <button onClick={tryAgain}>Try again</button>
            </section>}
        </div>
        </>
    )
}

export default AdminProducts
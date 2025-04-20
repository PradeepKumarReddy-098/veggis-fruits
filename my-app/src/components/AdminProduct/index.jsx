import "./index.css";

const AdminProduct = ({
  product,
  onDelete,
  onEdit,
  isEditing,
  editFormData,
  formChange,
  onSaveEdit,
  onCancelEdit,
}) => {
  const deleteProduct = () => {
    onDelete(product.productId);
  };

  const save = () => {
    onSaveEdit(product.productId);
  };

  return (
    <li className="product-card" key={product.productId}>
      <img src={product.imageUrl} alt={product.name} className="card-image" />
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            name="name"
            value={editFormData.name}
            onChange={formChange}
            placeholder="Name"
            className="edit-input"
          />
          <input
            type="number"
            name="pricePerUnit"
            value={editFormData.pricePerUnit}
            onChange={formChange}
            placeholder="Price"
            className="edit-input"
          />
          <input
            type="text"
            name="imageUrl"
            value={editFormData.imageUrl}
            onChange={formChange}
            placeholder="Image URL"
            className="edit-input"
          />
          <div className="edit-actions">
            <button type="button" className="save-btn" onClick={save}>
              Save
            </button>
            <button type="button" className="cancel-btn" onClick={onCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3>{product.name}</h3>
          <p>Rs: {product.pricePerUnit}.00</p>
          <div>
            <button type="button" className="delete-product-btn" onClick={deleteProduct}>
              Delete Product
            </button>
            <button type="button" className="edit-product-btn" onClick={()=>{onEdit(product)}}>
              Edit Product
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default AdminProduct;
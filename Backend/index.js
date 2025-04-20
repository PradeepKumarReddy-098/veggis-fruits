const express = require('express');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
//app.use(bodyParser.json());

const databasePath = path.join(__dirname,'Store.db');

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//Get all products
app.get('/products', async(req,res)=>{
  try{
    const getProducts = `SELECT product_id as productId, name, price_per_unit as pricePerUnit, image_url as imageUrl FROM products`;
    const allProducts = await db.all(getProducts,[])
    res.status(200).json({message:'products fetch successfully',products:allProducts})
  }catch(error){
    console.log(`error: ${error}`)
    res.status(500).json({message:'Failed to fetch products'})
  }
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

app.post('/orders', async(req, res) => {
  const orderData = req.body;
  //console.log(orderData);

  if (!orderData.name || !orderData.email || !orderData.phone || !orderData.address || !orderData.items || !orderData.totalPrice) {
      return res.status(400).json({ error: 'Missing required fields.' });
  }
  try{
    const orderId = uuidv4();
    const itemsJson = JSON.stringify(orderData.items);

    const query = `
    INSERT INTO Orders (order_id, name, email, phone, address, items, total_price, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
      orderId,
      orderData.name,
      orderData.email,
      orderData.phone,
      orderData.address,
      itemsJson,
      orderData.totalPrice,
      'pending',
  ];

  await db.run(query,values)
  res.status(201).json({ message: 'Order placed successfully!', orderId: orderId });
  }catch(error){
    console.error(err.message);
    return res.status(500).json({ error: 'Failed to insert order.', message: err.message });
  }
});

app.get('/api/orders/:order_id', async (req, res) => {
  const orderId = req.params.order_id;
  try {
      if (!orderId) {
          return res.status(400).json({ error: 'Order ID is required' });
      }

      const query = `
          SELECT 
              order_id, 
              order_date, 
              status, 
              name,
              email,
              phone,
              address,
              items, 
              total_price
          FROM Orders
          WHERE order_id = ?;
      `;
      const values = [orderId];

      const orderDetails = await db.get(query, values);
      if(!orderDetails){
        res.status(404).json({error:'Invalid order id. Please provide valid Id'})
        return;
      }
      orderDetails.items = JSON.parse(orderDetails.items)
      res.status(200).json(orderDetails);

  } catch (error) {
      console.log('Error fetching order details:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/orders', async(req, res) => {
  try{
    const query = `SELECT * FROM orders;`
    const orders = await db.all(query,[])
    if(!orders){
      res.status(400).json({error:'No orders avaliable'})
      //console.log('no data')
      return
    }
    res.status(200).json({orders})
  }catch(err){
    res.status(500).json({ error:err });
    console.log(err)
  }

});

app.put('/api/orders/:order_id', async(req, res) => {
  const orderId = req.params.order_id;
  const { status } = req.body;
 try{
  if (!status || !['pending', 'in progress', 'delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided.' });
  }
  const query = `UPDATE orders SET status = ? WHERE order_id = ?`
  await db.run(query,[status,orderId])
  res.status(200).json({message:'status update successfully'})
 }catch(err){
  res.status(500).json({ error:"some Internal error occur" });
 }
});

app.post('/api/products', async(req, res) => {
  const { name, price_per_unit, image_url } = req.body;
  if (!name || !price_per_unit || !image_url){
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try{
    const query = `INSERT INTO Products (name,price_per_unit,image_url)
      VALUES (?, ?, ?)`
    await db.run(query,[name,price_per_unit,image_url])
    res.status(200).json({message:'Producte added successfully'})
  }catch(err){
    res.status(500).json({ error:"some Internal error occur" });
    console.log(err)
  }
});

app.put('/api/products/:id', async(req, res) => {
  const id = req.params.id;
  const { name, pricePerUnit, imageUrl } = req.body;
  //console.log(name)
  try{
    const query = 'UPDATE PRODUCTS SET name=?, price_per_unit=?, image_url=? where product_id=?';
    await db.run(query,[name,pricePerUnit,imageUrl,id])
    res.status(200).json({message:'Producte updated successfully'})
  }catch(error){
    res.status(500).json({ error:"some Internal error occur" });
    console.log(err)
  }
});

app.delete('/api/products/:id', async(req, res) => {
  const id = req.params.id;
  try{
    const query = `DELETE FROM PRODUCTS WHERE product_id = ?`
    await db.run(query,[id])
    res.status(200).json({ message: 'Product deleted successfully' });
  }catch(err){
    console.error(err.message);
    res.status(500).send('Error deleting product');
  }
});
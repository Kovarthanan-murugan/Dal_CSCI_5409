const mysql = require('mysql');
const express = require('express');
const app = express();
app.use(express.json());

//Reference
//[1]	Shahid,“Node.Js and MySQL connection pool example.,” CodeForGeek. [Online]. Available: https://codeforgeek.com/node-mysql-connection-pool-example/. [Accessed: 29 July 2023].
// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'assignment4-db-instance-1.cgqlyygpeau6.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Kovarthan1!',
    port: '3306',
  database: 'main',
});

// Function to establish a connection to the database
const connectToDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('DataBase Connected');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};
//Reference 
//[1]	Alex Burley,“mysql,” githubrepo. [Online]. Available: https://github.com/mysqljs/mysql. [Accessed: 03 Jun 2023].
// Function to create the 'products' table if it doesn't exist
const createProductsTable = async (connection) => {
  try {
    await connection.execute(`
    CREATE TABLE IF NOT EXISTS products(name varchar(30), price varchar(255), availability boolean);
    `);
    console.log('Table Created');
  } catch (error) {
    console.error('Error occured while creating the table:', error);
    throw error;
  }
};

// Function to store products in the database
const storeProducts = async (connection, requestData) => {

  for (const product of requestData) {
    try {
      if (product.name && product.price && product.hasOwnProperty('availability')) {
        const availability = product.availability ? 1 : 0;
        const [result] = await connection.execute(
          'INSERT INTO products (name, price, availability) VALUES (?, ?, ?)',
          [product.name, product.price, availability]
        );
      }
    } catch (error) {
      console.error('Error occured while inserting product:', error);
      throw error;
    }
  }

};
//Reference 
//[1]	Alex Burley,“mysql,” githubrepo. [Online]. Available: https://github.com/mysqljs/mysql. [Accessed: 03 Jun 2023].
// Function to fetch products from the database
const fetchProducts = async (connection) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM products');
    const products = rows.map((row) => ({
      id: row.id,
      name: row.name,
      price: row.price,
      availability: row.availability === 1,
    }));
    return products;
  } catch (error) {
    console.error('Error occured while fetching products:', error);
    throw error;
  }
};

// Route to store products in the database
app.post('/store-products', async (req, res) => {
  const requestData = req.body.products;

  try {
    const connection = await connectToDatabase();
    await createProductsTable(connection);
    const storedProducts = await storeProducts(connection, requestData);
    connection.release();
    res.status(200).json({ message: 'Success.'});
  } catch (error) {
    res.status(500).send('Store products failed');
  }
});

// Route to fetch products from the database
app.get('/list-products', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const products = await fetchProducts(connection);
    connection.release();
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).send('Fetach products failed');
  }
});

// Start the server and listen on port 80
app.listen(80, () => {
  console.log('Server is listening on port 80');
});

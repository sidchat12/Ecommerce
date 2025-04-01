const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config();
const oracledb = require('oracledb');

const { v4: uuidv4 } = require('uuid');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define uploads directory
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

// Middleware imports
const {
    seller_login,
    seller_signup,
    user_login,
    user_signup,
    authenticateJWT,
    isLoggedIn
} = require('./middlewares/authentication.js');

// Controller imports
const {
    update_user_address,
    getuser,
    getseller,
    update_user_id
} = require('./controllers/user.js');

const {
    purchase,
    get_user_history,
    get_order,
    initiate_purchase
} = require('./controllers/transaction.js');

const {
    get_reviews_by_id,
    addreview
} = require('./controllers/review.js');

const {
    add_product,
    uploadProductPhoto,
    get_product,
    get_product_by_category,
    get_product_for_homepage
} = require('./controllers/product.js');

const { add_address } = require('./controllers/address.js');

const { createTables, dropTables } = require('./db_config/init_functions.js');
app.use('/uploads', express.static('uploads'));

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const fs = require('fs');
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.listen(process.env.port, async () => {
    console.log('Server running on port 6000');
    // await dropTables();
    // await createTables();
});

app.post('/seller/signup', seller_signup);
app.post('/seller/login', seller_login);
app.post('/user/signup', user_signup);
app.post('/user/login', user_login);

app.get('/product/:product_id', get_product);
app.get('/category/:category', get_product_by_category);
app.get('/home', get_product_for_homepage);

app.post('/seller/:seller_id/addproduct', upload.single('photo'), async function (req, res) {
    let product_id = uuidv4();
    let { seller_id } = req.params;
    const { product_title, price, description, category } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (!product_id || !product_title || !price || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const sql = `INSERT INTO product (product_id, product_title, price, description, photo, category) 
                     VALUES (:product_id, :product_title, :price, :description, :photo, :category)`;

        await connection.execute(sql, {
            product_id,
            product_title,
            price,
            description,
            photo,
            category
        }, { autoCommit: true });

        await connection.execute(`insert into sells (seller_id, product_id) values (:seller_id, :product_id)`, {
            seller_id,
            product_id
        }, { autoCommit: true });

        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});



app.post('/seller/:seller_id/addaddress', authenticateJWT, isLoggedIn, add_address);
app.post('/user/:user_id/addaddress', authenticateJWT, isLoggedIn, add_address);

app.get('/user/:user_id/profile', authenticateJWT, isLoggedIn, getuser);
app.get('/seller/:seller_id/profile', authenticateJWT, isLoggedIn, getseller);

app.post('/user/:user_id/updateaddress', authenticateJWT, isLoggedIn, update_user_address);

app.post('/user/:user_id/:product_id/addreview', authenticateJWT, isLoggedIn, addreview);
app.get('/product/:product_id/reviews', get_reviews_by_id);

app.get('/user/:user_id/:product_id/order', authenticateJWT, isLoggedIn, initiate_purchase);
app.post('/user/:user_id/:product_id/order', authenticateJWT, isLoggedIn, purchase);
app.get('/user/:user_id/:order_id', authenticateJWT, isLoggedIn, get_order);
app.get('/user/:user_id/history', authenticateJWT, isLoggedIn, get_user_history);

